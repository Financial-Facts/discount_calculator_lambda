import QuarterlyData from "@/resources/discount/models/QuarterlyData";
import AbstractRetriever from "../../retriever/AbstractRetriever";

abstract class AbstractFunction {
    
    protected retriever: AbstractRetriever;

    constructor(retriever: AbstractRetriever) {
        this.retriever = retriever;
    }

    abstract calculate(): QuarterlyData[];
    abstract setVariables(): Promise<void>;
    abstract annualize(quarterlyData: QuarterlyData[]): QuarterlyData[];

}

export default AbstractFunction;