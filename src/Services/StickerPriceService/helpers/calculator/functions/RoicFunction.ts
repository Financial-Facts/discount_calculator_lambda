import { PeriodicData } from "@/resources/entities/models/PeriodicData";
import { processPeriodicDatasets, annualizeByAdd } from "../../../../../Services/StickerPriceService/utils/QuarterlyDataUtils";
import AbstractFunction from "./AbstractFunction";
import StickerPriceData from "@/resources/entities/facts/IStickerPriceData";

class RoicFunction extends AbstractFunction {

    async calculate(data: StickerPriceData): Promise<PeriodicData[]> {
        const quarterlyTaxExpense = data.quarterlyTaxExpense;
        const quarterlyOperatingIncome = data.quarterlyOperatingIncome;
        const quarterlyNOPAT = this.calculateQuarterlyNOPAT(data.cik, quarterlyOperatingIncome, quarterlyTaxExpense);

        const quarterlyNetDebt = data.quarterlyNetDebt;
        const quarterlyTotalEquity = data.quarterlyTotalEquity;
        const quarterlyIC = this.calculateQuarterlyIC(data.cik, quarterlyNetDebt, quarterlyTotalEquity);

        return processPeriodicDatasets(data.cik, quarterlyNOPAT, quarterlyIC, (a, b) => (a / b) * 100);
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