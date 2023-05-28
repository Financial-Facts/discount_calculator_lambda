import QuarterlyData from "@/resources/discount/models/QuarterlyData";
import AbstractRetriever from "../../retriever/AbstractRetriever";
import RetrieverFactory from "../../retriever/retrieverUtils/RetrieverFactory";
import UnitData from "../models/UnitData";
import AbstractFunction from "./AbstractFunction";

class BvpsFunction extends AbstractFunction {

    private retriever: AbstractRetriever;
    private retrieverFactory: RetrieverFactory;
    
    constructor(cik: string, facts: any) {
        super();
        this.retrieverFactory = new RetrieverFactory();
        this.retriever = this.retrieverFactory.getRetriever(cik, facts);
    }

    calculate(): number[] {
        throw new Error("Method not implemented.");
    }
    setVariables(): void {
        const quarterly_shareholder_equity: QuarterlyData[] = this.retriever.retrieve_quarterly_shareholder_equity();
        const quarterly_outstanding_shares: QuarterlyData[] = this.retriever.retrieve_quarterly_outstanding_shares();
        console.log(quarterly_outstanding_shares);
    }
    annualize(): { firstQuarter: number[]; annualBVPS: number[]; } {
        throw new Error("Method not implemented.");
    }
    
}

export default BvpsFunction;