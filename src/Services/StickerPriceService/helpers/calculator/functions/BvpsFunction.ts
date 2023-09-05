import { PeriodicData } from "@/resources/entities/models/PeriodicData";
import { processPeriodicDatasets, annualizeByLastQuarter } from "../../../../../Services/StickerPriceService/utils/QuarterlyDataUtils";
import AbstractFunction from "./AbstractFunction";
import StickerPriceData from "@/resources/entities/facts/IStickerPriceData";

class BvpsFunction extends AbstractFunction {

    async calculate(data: StickerPriceData): Promise<PeriodicData[]> {
        const quarterly_shareholder_equity = data.quarterlyShareholderEquity;
        const quarterly_outstanding_shares = data.quarterlyOutstandingShares;
        const quarterlyBVPS = processPeriodicDatasets(data.cik,
            quarterly_shareholder_equity, quarterly_outstanding_shares, (a, b) => a/b);
        return annualizeByLastQuarter(data.cik, quarterlyBVPS);
    }
    
}

export default BvpsFunction;