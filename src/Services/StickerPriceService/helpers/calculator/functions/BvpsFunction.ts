import AbstractRetriever from "../../retriever/AbstractRetriever";
import RetrieverFactory from "../../retriever/retrieverUtils/RetrieverFactory";
import AbstractFunction from "./AbstractFunction";

class BvpsFunction extends AbstractFunction {

    private retriever: AbstractRetriever;
    private retrieverFactory: RetrieverFactory;
    
    constructor(symbol: string, facts: any) {
        super();
        this.retrieverFactory = new RetrieverFactory();
        this.retriever = this.retrieverFactory.getRetriever(facts);
    }

    calculate(): number[] {
        throw new Error("Method not implemented.");
    }
    setVariables(): void {
        const a = this.retriever.retrieve_quarterly_shareholder_equity();
    }
    annualize(): { firstQuarter: number[]; annualBVPS: number[]; } {
        throw new Error("Method not implemented.");
    }
    
}

export default BvpsFunction;