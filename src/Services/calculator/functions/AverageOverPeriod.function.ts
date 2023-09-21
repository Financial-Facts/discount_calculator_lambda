import DisqualifyingDataException from "@/utils/exceptions/DisqualifyingDataException";
import { PeriodicData } from "../../sticker-price/sticker-price.typings";
import AbstractFunction from "./AbstractFunction";


class AverageOverPeriodFunction extends AbstractFunction {

    calculate(data: {
        periodicData: PeriodicData[],
        numPeriods: number,
        minimum?: number,
        errorMessage?: string
    }): number {
        const periodicData = data.periodicData;
        const numPeriods = data.numPeriods;
        const average = numPeriods <= 0 ? 0 : numPeriods === 1 ? periodicData.slice(-1)[0].value :
        periodicData.slice(0 - numPeriods)
                .map(period => period.value)
                .reduce((a, b) => a + b) / numPeriods;
        if (data.minimum && average < data.minimum) {
            if (data.errorMessage) {
                throw new DisqualifyingDataException(data.errorMessage);
            }
            throw new DisqualifyingDataException(`Average does not meet a minimum of ${data.minimum}`);
        }
        return average;
    }
    
}

export default AverageOverPeriodFunction;