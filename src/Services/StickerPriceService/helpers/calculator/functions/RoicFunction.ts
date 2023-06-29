import QuarterlyData from "@/resources/entities/models/QuarterlyData";
import AbstractFunction from "./AbstractFunction";
import StickerPriceData from "@/resources/entities/facts/IStickerPriceData";
import { annualizeByAdd, processQuarterlyDatasets } from "../../../../../Services/StickerPriceService/utils/StickerPriceUtils";

class RoicFunction extends AbstractFunction {

    async calculate(data: StickerPriceData): Promise<QuarterlyData[]> {
        const quarterlyNetIncome = data.quarterlyNetIncome;
        const quarterlyShareholderEquity = data.quarterlyShareholderEquity;
        const quarterlyLongTermDebt = data.quarterlyLongTermDebt;
        return this.calculateQuarterlyIC(data.cik, quarterlyShareholderEquity, quarterlyLongTermDebt)
            .then((quarterlyIC: QuarterlyData[]) => {
                return processQuarterlyDatasets(data.cik, 365, quarterlyNetIncome, quarterlyIC, (a, b) => (a/b) * 100);
            });
    }

    annualize(cik: string, quarterlyData: QuarterlyData[]): QuarterlyData[] {
       return annualizeByAdd(cik, quarterlyData);
    }

    private async calculateQuarterlyIC(cik: string, quarterlyShareholderEquity: QuarterlyData[], quarterlyLongTermDebt: QuarterlyData[]): Promise<QuarterlyData[]> {
        return processQuarterlyDatasets(cik, 365, quarterlyShareholderEquity, quarterlyLongTermDebt, (a, b) => a + b);
    }

}

export default RoicFunction;