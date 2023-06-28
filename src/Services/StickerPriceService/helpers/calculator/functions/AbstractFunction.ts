import QuarterlyData from "@/resources/entities/models/QuarterlyData";

abstract class AbstractFunction {

    abstract calculate(): QuarterlyData[];
    abstract annualize(quarterlyData: QuarterlyData[]): QuarterlyData[];

}

export default AbstractFunction;