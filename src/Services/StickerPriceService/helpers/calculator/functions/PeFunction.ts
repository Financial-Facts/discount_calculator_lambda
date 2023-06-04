import QuarterlyData from "@/resources/discount/models/QuarterlyData";
import AbstractFunction from "./AbstractFunction";
import HistoricalPriceService from "../../../../../Services/HistoricalPriceService/HistoricalPriceService";

class PeFunction extends AbstractFunction {

    private historicalPriceService: HistoricalPriceService;
    private quarterlyEPS: QuarterlyData[];

    constructor(quarterlyEPS?: QuarterlyData[]) {
        super();
        this.historicalPriceService = new HistoricalPriceService();
        this.quarterlyEPS = quarterlyEPS ? quarterlyEPS : [];
    }

    calculate(): QuarterlyData[] {
        throw new Error("Method not implemented.");
    }

    setVariables(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    annualize(quarterlyBVPS: QuarterlyData[]): { lastQuarters: number[]; annualBVPS: QuarterlyData[]; } {
        throw new Error("Method not implemented.");
    }
    
}

export default PeFunction;