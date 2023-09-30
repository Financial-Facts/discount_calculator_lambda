import { QuarterlyData } from "@/resources/price-check-consumer/discount-manager/discount-manager.typings";
import { processPeriodicDatasets, annualizeByLastQuarter } from "@/resources/price-check-consumer/discount-manager/discount-manager.utils";
import { TimePeriod } from "../calculator.typings";
import AbstractFunction from "./AbstractFunction";
import { PeriodicData } from "@/src/types";


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