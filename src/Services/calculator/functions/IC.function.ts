import { PeriodicData, QuarterlyData } from "../../sticker-price/sticker-price.typings";
import { annualizeByLastQuarter, processPeriodicDatasets } from "../../sticker-price/utils/periodic-data.utils";
import { TimePeriod } from "../calculator.typings";
import AbstractFunction from "./AbstractFunction";


class IcFunction extends AbstractFunction {

    calculate(data: {
        cik: string,
        timePeriod: TimePeriod,
        quarterlyData: QuarterlyData
    }): PeriodicData[] {
        const quarterlyNetDebt = data.quarterlyData.quarterlyNetDebt;
        const quarterlyTotalEquity = data.quarterlyData.quarterlyTotalEquity;
        const quarterlyIC = processPeriodicDatasets(data.cik, quarterlyNetDebt, quarterlyTotalEquity, (a, b) => a + b);
        return data.timePeriod === 'A' ? annualizeByLastQuarter(data.cik, quarterlyIC) : quarterlyIC;
    }
    
}

export default IcFunction;