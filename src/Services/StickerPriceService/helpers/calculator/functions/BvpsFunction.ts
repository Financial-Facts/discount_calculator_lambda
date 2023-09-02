import QuarterlyData from "@/resources/entities/models/QuarterlyData";
import AbstractFunction from "./AbstractFunction";
import { annualizeByMean, days_between, processQuarterlyDatasets } from "../../../utils/QuarterlyDataUtils";
import StickerPriceData from "@/resources/entities/facts/IStickerPriceData";

class BvpsFunction extends AbstractFunction {

    async calculate(data: StickerPriceData): Promise<QuarterlyData[]> {
        const quarterly_shareholder_equity = data.quarterlyShareholderEquity;
        const quarterly_outstanding_shares = data.quarterlyOutstandingShares;
        return processQuarterlyDatasets(data.cik, 365, quarterly_shareholder_equity, quarterly_outstanding_shares, (a, b) => a/b);
    }

    annualize(cik: string, quarterlyBVPS: QuarterlyData[]): QuarterlyData[] {
        return annualizeByMean(cik, quarterlyBVPS);
    }
    
}

export default BvpsFunction;