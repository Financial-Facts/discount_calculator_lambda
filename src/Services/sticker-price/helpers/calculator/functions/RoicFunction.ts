import StickerPriceData, { PeriodicData } from "../../../../../services/sticker-price/sticker-price.typings";
import { processPeriodicDatasets, annualizeByAdd } from "../../../../../services/sticker-price/utils/QuarterlyDataUtils";
import AbstractFunction from "./AbstractFunction";


class RoicFunction extends AbstractFunction {

    async calculate(data: StickerPriceData): Promise<PeriodicData[]> {
        const quarterlyTaxExpense = data.quarterlyTaxExpense;
        const quarterlyOperatingIncome = data.quarterlyOperatingIncome;
        const quarterlyNOPAT = this.calculateQuarterlyNOPAT(data.cik, quarterlyOperatingIncome, quarterlyTaxExpense);

        const quarterlyNetDebt = data.quarterlyNetDebt;
        const quarterlyTotalEquity = data.quarterlyTotalEquity;
        const quarterlyIC = this.calculateQuarterlyIC(data.cik, quarterlyNetDebt, quarterlyTotalEquity);

        const quarterlyROIC = processPeriodicDatasets(data.cik, quarterlyNOPAT, quarterlyIC, (a, b) => (a / b) * 100);
        return annualizeByAdd(data.cik, quarterlyROIC);
    }

    annualize(cik: string, PeriodicData: PeriodicData[]): PeriodicData[] {
       return annualizeByAdd(cik, PeriodicData);
    }

    private calculateQuarterlyNOPAT(cik: string, quarterlyOperatingIncome: PeriodicData[], quarterlyTaxExpense: PeriodicData[]): PeriodicData[] {
        return processPeriodicDatasets(cik, quarterlyOperatingIncome, quarterlyTaxExpense, (a, b) => a - b);
    }

    private calculateQuarterlyIC(cik: string, quarterlyNetDebt: PeriodicData[], quarterlyTotalEquity: PeriodicData[]): PeriodicData[] {
        return processPeriodicDatasets(cik, quarterlyNetDebt, quarterlyTotalEquity, (a, b) => a + b);
    }

}

export default RoicFunction;