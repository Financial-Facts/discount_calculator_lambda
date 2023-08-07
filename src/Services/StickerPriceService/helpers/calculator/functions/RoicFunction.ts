import QuarterlyData from "@/resources/entities/models/QuarterlyData";
import AbstractFunction from "./AbstractFunction";
import StickerPriceData from "@/resources/entities/facts/IStickerPriceData";
import { annualizeByAdd, processQuarterlyDatasets } from "../../../utils/QuarterlyDataUtils";

class RoicFunction extends AbstractFunction {

    async calculate(data: StickerPriceData): Promise<QuarterlyData[]> {
        const quarterlyNetIncome = data.quarterlyNetIncome;
        const quarterlyShareholderEquity = data.quarterlyShareholderEquity;
        const quarterlyLongTermDebt = data.quarterlyLongTermDebt;
        const quarterlyIC = this.calculateQuarterlyIC(data.cik, quarterlyShareholderEquity, quarterlyLongTermDebt);
        return processQuarterlyDatasets(data.cik, 365, quarterlyNetIncome, quarterlyIC, (a, b) => (a/b) * 100);
    }

    annualize(cik: string, quarterlyData: QuarterlyData[]): QuarterlyData[] {
       return annualizeByAdd(cik, quarterlyData);
    }

    private calculateQuarterlyIC(cik: string, quarterlyShareholderEquity: QuarterlyData[], quarterlyLongTermDebt: QuarterlyData[]): QuarterlyData[] {
        return processQuarterlyDatasets(cik, 365, quarterlyShareholderEquity, quarterlyLongTermDebt, (a, b) => a + b);
    }

}

export default RoicFunction;