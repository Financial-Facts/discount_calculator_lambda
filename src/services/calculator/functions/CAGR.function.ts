import AbstractFunction from "./AbstractFunction";
import { PeriodicData } from "@/src/types";
import { getLastPeriodValue, processPeriodicDatasets } from "@/utils/processing.utils";
import DisqualifyingDataException from "@/utils/exceptions/DisqualifyingDataException";


class CagrFunction extends AbstractFunction {

    calculate(data: {
        periodicData: PeriodicData[],
        period: number,
        minimumGrowth: number,
        type: string
    }): number {
        const { periodicData, period, minimumGrowth, type } = data;
        const slicedData = periodicData.slice(-(period + 1));
        const previous = slicedData[0].value;
        const current = getLastPeriodValue(slicedData);

        if (previous <= 0) {
            throw new DisqualifyingDataException(
                `${type} value ${period} periods ago is zero or negative`
            );
        }

        const cagr = (Math.pow((current / previous), (1 / (slicedData.length - 1))) - 1) * 100;

        if (cagr < minimumGrowth) {
            throw new DisqualifyingDataException(
                `${type} growth rate does not exceed ${minimumGrowth}% on average over the passed ${period} periods`
            );
        }

        return cagr;
    }
    
}

export default CagrFunction;