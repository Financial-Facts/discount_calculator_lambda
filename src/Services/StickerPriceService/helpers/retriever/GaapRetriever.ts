import { TaxonomyType } from "../../models/TaxonomyType";
import UnitData from "../calculator/models/UnitData";
import Parser from "../parser/Parser";
import AbstractRetriever from "./AbstractRetriever";
import FACTS_KEYS from "./retrieverUtils/FactsKeys";

class GaapRetriever extends AbstractRetriever {

    private parser: Parser;

    constructor(facts: string) {
        super();
        this.parser = new Parser(facts);
    }

    retrieve_quarterly_shareholder_equity(): UnitData[] {
        const factsKeys: string[] = Object.values(FACTS_KEYS.SHAREHOLDER_EQUITY);
        return this.parser.retrieve_quarterly_data(factsKeys, TaxonomyType.GAAP);
    }

    retrieve_quarterly_outstanding_shares(facts: any): any[] {
        throw new Error("Method not implemented.");
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