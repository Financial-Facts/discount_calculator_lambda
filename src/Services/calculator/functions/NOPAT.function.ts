import { PeriodicData, QuarterlyData } from "../../sticker-price/sticker-price.typings";
import { annualizeByAdd, processPeriodicDatasets } from "../../sticker-price/utils/periodic-data.utils";
import { TimePeriod } from "../calculator.typings";
import AbstractFunction from "./AbstractFunction";


class NopatFunction extends AbstractFunction {

    calculate(data: {
        cik: string,
        timePeriod: TimePeriod,
        quarterlyData: QuarterlyData
    }): PeriodicData[] {
        const quarterlyTaxExpense = data.quarterlyData.quarterlyTaxExpense;
        const quarterlyOperatingIncome = data.quarterlyData.quarterlyOperatingIncome;
        const quarterlyNOPAT = processPeriodicDatasets(data.cik, quarterlyOperatingIncome, quarterlyTaxExpense, (a, b) => a - b);
        return data.timePeriod === 'A' ? annualizeByAdd(data.cik, quarterlyNOPAT) : quarterlyNOPAT;
    }
    
}

export default NopatFunction;