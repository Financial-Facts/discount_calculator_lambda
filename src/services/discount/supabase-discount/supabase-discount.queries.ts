export const SELECT_DISCOUNT_QUERY = `
cik,
symbol,
name,
last_updated,
active,
sticker_price (
    cik,
    price,
    sticker_price_input (
        cik,
        debt_years,
        annual_bvps (
            cik,
            announced_date,
            value,
            period
        ),
        annual_pe (
            cik,
            announced_date,
            value,
            period
        ),
        annual_roic (
            cik,
            announced_date,
            value,
            period
        ),
        annual_eps (
            cik,
            announced_date,
            value,
            period
        ),
        annual_equity (
            cik,
            announced_date,
            value,
            period
        ),
        annual_revenue (
            cik,
            announced_date,
            value,
            period
        ),
        annual_operating_cash_flow (
            cik,
            announced_date,
            value,
            period
        )
    )
),
benchmark_ratio_price (
    cik,
    price,
    benchmark_ratio_price_input (
        cik,
        industry,
        ttm_revenue,
        shares_outstanding,
        ps_benchmark_ratio
    )
),
discounted_cash_flow_price (
    cik,
    price,
    discounted_cash_flow_input (
        cik,
        symbol,
        wacc,
        long_term_growth_rate,
        terminal_value,
        free_cash_flowt1,
        enterprise_value,
        net_debt,
        diluted_shares_outstanding,
        market_price,
        historical_revenue (
            cik,
            announced_date,
            value,
            period
        ),
        projected_revenue (
            cik,
            announced_date,
            value,
            period
        ),
        historical_operating_cash_flow (
            cik,
            announced_date,
            value,
            period
        ),
        projected_operating_cash_flow (
            cik,
            announced_date,
            value,
            period
        ),
        historical_capital_expenditure (
            cik,
            announced_date,
            value,
            period
        ),
        projected_capital_expenditure (
            cik,
            announced_date,
            value,
            period
        ),
        historical_free_cash_flow (
            cik,
            announced_date,
            value,
            period
        ),
        projected_free_cash_flow (
            cik,
            announced_date,
            value,
            period
        )
    )
)`;
