import QuarterlyData from "@/resources/discount/models/QuarterlyData";
import { TaxonomyType } from "../../models/TaxonomyType";
import Parser from "../parser/Parser";
import AbstractRetriever from "./AbstractRetriever";
import FACTS_KEYS from "./retrieverUtils/FactsKeys";

class GaapRetriever extends AbstractRetriever {

    private cik: string;
    private parser: Parser;

    constructor(cik: string, facts: string) {
        super();
        this.cik = cik;
        this.parser = new Parser(facts);
    }

    retrieve_quarterly_shareholder_equity(): QuarterlyData[] {
        const factsKeys: string[] = Object.values(FACTS_KEYS.SHAREHOLDER_EQUITY);
        return this.parser.retrieve_quarterly_data(this.cik, factsKeys, TaxonomyType.GAAP);
    }

    retrieve_quarterly_outstanding_shares(): QuarterlyData[] {
        const factsKeys: string[] = Object.values(FACTS_KEYS.OUTSTANDING_SHARES);
        const deiFactsKeys: string[] = Object.values(FACTS_KEYS.DEI.OUTSTANDING_SHARES);
        return this.parser.retrieve_quarterly_data(this.cik, factsKeys, TaxonomyType.GAAP, deiFactsKeys);
    }
    
    retrieve_quarterly_EPS(facts: any): any[] {
        throw new Error("Method not implemented.");
    }
    retrieve_benchmark_ratio_price(facts: any, benchmark: number): number {
        throw new Error("Method not implemented.");
    }
    retrieve_quarterly_net_income(facts: any): any[] {
        throw new Error("Method not implemented.");
    }
    retrieve_quarterly_total_debt(facts: any): any[] {
        throw new Error("Method not implemented.");
    }
    retrieve_quarterly_total_assets(facts: any): any[] {
        throw new Error("Method not implemented.");
    }
    retrieve_quarterly_total_cash(facts: any): any[] {
        throw new Error("Method not implemented.");
    }
    retrieve_quarterly_long_term_debt(facts: any): any[] {
        throw new Error("Method not implemented.");
    }
    retrieve_quarterly_long_term_debt_parts(facts: any): any[][] {
        throw new Error("Method not implemented.");
    }

}

export default GaapRetriever;