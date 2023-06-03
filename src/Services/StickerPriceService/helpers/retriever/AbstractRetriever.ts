import QuarterlyData from "@/resources/discount/models/QuarterlyData";
import UnitData from "../calculator/models/UnitData";

abstract class AbstractRetriever {

    abstract retrieve_quarterly_shareholder_equity(): Promise<QuarterlyData[]>;
    abstract retrieve_quarterly_outstanding_shares(): Promise<QuarterlyData[]>;
    abstract retrieve_quarterly_EPS(facts: any): any[];
    abstract retrieve_benchmark_ratio_price(facts: any, benchmark: number): number;
    abstract retrieve_quarterly_net_income(facts: any): any[];
    abstract retrieve_quarterly_total_debt(facts: any): any[];
    abstract retrieve_quarterly_total_assets(facts: any): any[];
    abstract retrieve_quarterly_total_cash(facts: any): any[];
    abstract retrieve_quarterly_long_term_debt(facts: any): any[];
    abstract retrieve_quarterly_long_term_debt_parts(facts: any): any[][];

}

export default AbstractRetriever;