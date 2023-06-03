import QuarterlyData from "@/resources/discount/models/QuarterlyData";

abstract class AbstractFunction {
    
    abstract calculate(): QuarterlyData[];
    abstract setVariables(): Promise<void>;
    abstract annualize(quarterlyBVPS: QuarterlyData[]): { lastQuarters: number[], annualBVPS: QuarterlyData[] };

}

export default AbstractFunction;