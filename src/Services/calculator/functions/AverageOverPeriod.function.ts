import { PeriodicData } from "../../sticker-price/sticker-price.typings";
import AbstractFunction from "./AbstractFunction";


class AverageOverPeriodFunction extends AbstractFunction {

    calculate(data: {
        periodicData: PeriodicData[],
        numPeriods: number
    }): number {
        const periodicData = data.periodicData;
        const numPeriods = data.numPeriods;
        return numPeriods <= 0 ? 0 : numPeriods === 1 ? periodicData.slice(-1)[0].value :
        periodicData.slice(0 - numPeriods)
                .map(period => period.value)
                .reduce((a, b) => a + b) / numPeriods;
    }
    
}

export default AverageOverPeriodFunction;