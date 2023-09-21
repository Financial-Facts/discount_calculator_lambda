import { calculatorService } from "../../../bootstrap";
import { PeriodicData, QuarterlyData } from "../../sticker-price/sticker-price.typings";
import { processPeriodicDatasets, annualizeByAdd } from "../../sticker-price/utils/periodic-data.utils";
import { TimePeriod } from "../calculator.typings";
import AbstractFunction from "./AbstractFunction";


class RoicFunction extends AbstractFunction {

    calculate(data: {
        cik: string,
        timePeriod: TimePeriod,
        quarterlyData: QuarterlyData
    }): PeriodicData[] {
        const quarterlyNOPAT = calculatorService.calculateNOPAT({
            cik: data.cik,
            timePeriod: 'Q',
            quarterlyData: data.quarterlyData
        });
        const quarterlyIC = calculatorService.calculateIC({
            cik: data.cik,
            timePeriod: 'Q',
            quarterlyData: data.quarterlyData
        });
        const quarterlyROIC = processPeriodicDatasets(data.cik, quarterlyNOPAT, quarterlyIC, (a, b) => (a / b) * 100);
        return data.timePeriod === 'A' ? annualizeByAdd(data.cik, quarterlyROIC) : quarterlyROIC;
    }

}

export default RoicFunction;