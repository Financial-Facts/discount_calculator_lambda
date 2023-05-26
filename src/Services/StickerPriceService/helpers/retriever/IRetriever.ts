export default interface IRetriever {
    retrieve_quarterly_shareholder_equity(facts: any): any[];
    retrieve_quarterly_outstanding_shares(facts: any): any[];
    retrieve_quarterly_EPS(facts: any): any[];
    retrieve_benchmark_ratio_price(facts: any, benchmark: number): number;
    retrieve_quarterly_net_income(facts: any): any[];
    retrieve_quarterly_total_debt(facts: any): any[];
    retrieve_quarterly_total_assets(facts: any): any[];
    retrieve_quarterly_total_cash(facts: any): any[];
    retrieve_quarterly_long_term_debt(facts: any): any[];
    retrieve_quarterly_long_term_debt_parts(facts: any): any[][];
}