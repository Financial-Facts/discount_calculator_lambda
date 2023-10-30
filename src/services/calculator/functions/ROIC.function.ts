import { QuarterlyData } from "@/resources/discount-manager/discount-manager.typings";
import { processPeriodicDatasets, annualizeByAdd } from "@/resources/discount-manager/discount-manager.utils";
import { calculatorService } from "../../../bootstrap";
import { TimePeriod } from "../calculator.typings";
import AbstractFunction from "./AbstractFunction";
import { PeriodicData } from "@/src/types";


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