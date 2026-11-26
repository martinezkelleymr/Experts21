#!/usr/bin/env python3
"""Deal calculator for buy-and-rent, fix-and-flip and BRRRR (renovate + rent + refinance).

Usage:
    python3 deal_calc.py inputs.json          # or: echo '{...}' | python3 deal_calc.py -

Only "price" is required. Every other input is optional. A missing input either
falls back to a planning default (listed under "Assumptions used", which the
analyst must disclose) or skips the strategy that needs it (e.g., no "rent"
means no rental math). Percentages are decimals (0.25 = 25%).

Inputs (all optional unless noted):
  price (required)          purchase price
  rent                      market rent per month (from rent comps, not the listing's claim)
  arv                       after-repair value (from sold comps)
  rehab                     renovation budget before contingency
  contingency_pct           default 0.15
  annual_tax                property tax per year AFTER purchase; default 1.9% of price
  annual_insurance          default 6300 (Palm Beach County average HO premium, 2026)
  annual_flood              default 0
  monthly_hoa               default 0
  vacancy_pct               default 0.06
  mgmt_pct                  default 0.10 of collected rent
  maint_pct                 default 0.06 of rent
  capex_pct                 default 0.07 of rent
  other_monthly             default 0 (lawn, pool, pest)
  down_pct                  rental loan down payment, default 0.25
  rate                      rental/DSCR rate, default 0.07
  term_years                default 30
  buy_closing_pct           default 0.02 (+ mortgage doc stamps 0.35% and intangible 0.2% of loan)
  sell_cost_pct             default 0.07 (commission, 0.70% deed doc stamps, closing)
  hold_months               flip/BRRRR rehab + sale/lease months, default 6
  hm_rate                   hard-money rate, default 0.11
  hm_points                 default 0.02
  hm_ltc                    hard-money share of purchase + rehab, default 0.85
  utilities_monthly         default 250 during the hold
  refi_ltv                  BRRRR refinance LTV, default 0.75
  refi_rate                 default = rate
  refi_cost_pct             default 0.02 of new loan
  target_flip_margin        flip profit target as % of ARV, default 0.15
  target_dscr               default 1.20
  target_cash_flow          rental monthly cash-flow target, default 200
"""
import json, sys

DEFAULTS = {
    "contingency_pct": 0.15, "annual_insurance": 6300, "annual_flood": 0, "monthly_hoa": 0,
    "vacancy_pct": 0.06, "mgmt_pct": 0.10, "maint_pct": 0.06, "capex_pct": 0.07, "other_monthly": 0,
    "down_pct": 0.25, "rate": 0.07, "term_years": 30, "buy_closing_pct": 0.02, "sell_cost_pct": 0.07,
    "hold_months": 6, "hm_rate": 0.11, "hm_points": 0.02, "hm_ltc": 0.85, "utilities_monthly": 250,
    "refi_ltv": 0.75, "refi_cost_pct": 0.02, "target_flip_margin": 0.15, "target_dscr": 1.20,
    "target_cash_flow": 200,
}
TAX_RATE_DEFAULT = 0.019
LOAN_TAX = 0.0035 + 0.002  # FL note doc stamps + intangible tax


def pmt(rate, years, principal):
    n, r = years * 12, rate / 12
    return principal / n if r == 0 else principal * r / (1 - (1 + r) ** -n)


def load():
    src = sys.argv[1] if len(sys.argv) > 1 else "-"
    data = json.load(sys.stdin if src == "-" else open(src))
    if "price" not in data:
        sys.exit("ERROR: 'price' is required")
    assumed = []
    for k, v in DEFAULTS.items():
        if data.get(k) is None:
            data[k] = v
            assumed.append(k)
    if data.get("refi_rate") is None:
        data["refi_rate"] = data["rate"]
        assumed.append("refi_rate")
    if data.get("annual_tax") is None:
        data["annual_tax_rule"] = True
        assumed.append("annual_tax (1.9% of price)")
    return data, assumed


def tax(d, price):
    return price * TAX_RATE_DEFAULT if d.get("annual_tax_rule") else d["annual_tax"]


def rental(d, price):
    rent = d["rent"]
    loan = price * (1 - d["down_pct"])
    cash_in = price * d["down_pct"] + price * d["buy_closing_pct"] + loan * LOAN_TAX
    pi = pmt(d["rate"], d["term_years"], loan)
    t, ins, fl, hoa = tax(d, price) / 12, d["annual_insurance"] / 12, d["annual_flood"] / 12, d["monthly_hoa"]
    egi = rent * (1 - d["vacancy_pct"])
    opex = t + ins + fl + hoa + egi * d["mgmt_pct"] + rent * (d["maint_pct"] + d["capex_pct"]) + d["other_monthly"]
    noi = egi - opex
    cf = noi - pi
    pitia = pi + t + ins + fl + hoa
    return {"loan": loan, "cash_in": cash_in, "P&I": pi, "PITIA": pitia, "effective_rent": egi,
            "operating_expenses": opex, "NOI_monthly": noi, "cash_flow_monthly": cf,
            "cash_on_cash": cf * 12 / cash_in, "cap_rate": noi * 12 / (price * (1 + d["buy_closing_pct"])),
            "DSCR": rent / pitia, "gross_yield": rent * 12 / price}


def hold_costs(d, price, rehab_total):
    hm_loan = (price + rehab_total) * d["hm_ltc"]
    interest = hm_loan * d["hm_rate"] / 12 * d["hold_months"]
    carry = (tax(d, price) + d["annual_insurance"] + d["annual_flood"]) / 12 * d["hold_months"] \
        + (d["monthly_hoa"] + d["utilities_monthly"]) * d["hold_months"]
    return hm_loan, interest + hm_loan * d["hm_points"], carry


def flip(d, price):
    rehab_total = d["rehab"] * (1 + d["contingency_pct"])
    hm_loan, finance, carry = hold_costs(d, price, rehab_total)
    buy_close = price * d["buy_closing_pct"] + hm_loan * LOAN_TAX
    sell = d["arv"] * d["sell_cost_pct"]
    all_in = price + buy_close + rehab_total + finance + carry
    profit = d["arv"] - sell - all_in
    cash = price + rehab_total - hm_loan + buy_close + hm_loan * d["hm_points"]
    return {"rehab_with_contingency": rehab_total, "buy_closing": buy_close, "financing_cost": finance,
            "carry_cost": carry, "selling_cost": sell, "all_in_cost": all_in, "profit": profit,
            "margin_on_arv": profit / d["arv"], "cash_needed": cash, "ROI_on_cash": profit / cash,
            "rule_70_MAO": 0.70 * d["arv"] - rehab_total}


def brrrr(d, price):
    f = flip(d, price)
    refi = d["arv"] * d["refi_ltv"]
    refi_cost = refi * (d["refi_cost_pct"] + LOAN_TAX)
    all_in = f["all_in_cost"]
    cash_left = all_in + refi_cost - refi
    pi = pmt(d["refi_rate"], d["term_years"], refi)
    rent = d["rent"]
    t = (tax(d, price) / 12) * (1 + d["rehab"] / price if d.get("annual_tax_rule") else 1)
    ins, fl, hoa = d["annual_insurance"] / 12, d["annual_flood"] / 12, d["monthly_hoa"]
    egi = rent * (1 - d["vacancy_pct"])
    opex = t + ins + fl + hoa + egi * d["mgmt_pct"] + rent * (d["maint_pct"] + d["capex_pct"]) + d["other_monthly"]
    cf = egi - opex - pi
    pitia = pi + t + ins + fl + hoa
    return {"all_in_cost": all_in, "refi_loan": refi, "refi_costs": refi_cost,
            "cash_left_in_deal": cash_left, "cash_left_pct_of_all_in": cash_left / all_in,
            "cash_flow_monthly": cf, "DSCR": rent / pitia,
            "cash_on_cash": (cf * 12 / cash_left) if cash_left > 0 else float("inf")}


def solve(fn, d, ok, lo=1000, hi=None):
    """Highest price where ok(result) is True (binary search)."""
    hi = hi or d["price"] * 2
    if not ok(fn(d, lo)):
        return None
    for _ in range(60):
        mid = (lo + hi) / 2
        lo, hi = (mid, hi) if ok(fn(d, mid)) else (lo, mid)
    return lo


def money(x):
    return f"${x:,.0f}" if abs(x) >= 1 or x == 0 else f"${x:,.2f}"


def fmt(k, v):
    if any(s in k for s in ("pct", "cash_on_cash", "cap_rate", "margin", "ROI", "yield")):
        return "∞" if v == float("inf") else f"{v*100:.1f}%"
    if k == "DSCR":
        return f"{v:.2f}"
    return money(v)


def table(title, res):
    print(f"\n### {title}\n\n| Metric | Value |\n|---|---|")
    for k, v in res.items():
        print(f"| {k.replace('_', ' ')} | {fmt(k, v)} |")


def main():
    d, assumed = load()
    p = d["price"]
    print(f"## Deal calculator results (price {money(p)})")
    if d.get("rent") is not None:
        r = rental(d, p); table("Buy and rent", r)
        mao = solve(rental, d, lambda x: x["DSCR"] >= d["target_dscr"] and x["cash_flow_monthly"] >= d["target_cash_flow"])
        print(f"\nMax price for buy-and-rent (DSCR ≥ {d['target_dscr']}, cash flow ≥ {money(d['target_cash_flow'])}/mo): "
              f"{money(mao) if mao else 'none — rent cannot support the targets at any price tested'}")
    else:
        print("\n### Buy and rent\nSkipped: no `rent` provided.")
    if d.get("arv") is not None and d.get("rehab") is not None:
        f = flip(d, p); table("Renovate and resell (flip)", f)
        mao = solve(flip, d, lambda x: x["margin_on_arv"] >= d["target_flip_margin"])
        print(f"\nMax price for flip (profit ≥ {d['target_flip_margin']*100:.0f}% of ARV): {money(mao) if mao else 'none'}")
        if d.get("rent") is not None:
            b = brrrr(d, p); table("Renovate and rent (BRRRR)", b)
            mao = solve(brrrr, d, lambda x: x["DSCR"] >= d["target_dscr"] and x["cash_left_pct_of_all_in"] <= 0.20)
            print(f"\nMax price for BRRRR (DSCR ≥ {d['target_dscr']}, ≤ 20% of all-in cost left in deal): {money(mao) if mao else 'none'}")
        else:
            print("\n### Renovate and rent (BRRRR)\nSkipped: no `rent` provided.")
    else:
        print("\n### Renovate and resell / BRRRR\nSkipped: needs both `arv` and `rehab`.")
    if assumed:
        print("\n### Assumptions used (defaults — disclose these)\n" + "\n".join(f"- {a} = {d.get(a.split(' ')[0], 'see rule')}" if '(' not in a else f"- {a}" for a in assumed))


if __name__ == "__main__":
    main()
