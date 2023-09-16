import StickerPriceData, { PeriodicData } from "../../../../../services/sticker-price/sticker-price.typings";
import { processPeriodicDatasets, annualizeByLastQuarter } from "../../../utils/periodic-data.utils";
import AbstractFunction from "./AbstractFunction";


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