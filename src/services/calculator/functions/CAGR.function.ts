import AbstractFunction from "./AbstractFunction";
import { PeriodicData } from "@/src/types";
import { getLastPeriodValue, processPeriodicDatasets } from "@/utils/processing.utils";


class CagrFunction extends AbstractFunction {

    calculate(data: {
        periodicData: PeriodicData[],
        period: number
    }): number {
        const { periodicData, period } = data;
        const slicedData = periodicData.slice(-(period + 1));
        const previous = slicedData[0].value;
        const current = getLastPeriodValue(slicedData);

        if (previous <= 0) {
            return 0;
        }

        const cagr = (Math.pow((current / previous), (1 / (slicedData.length - 1))) - 1) * 100;
        return cagr;
    }
    
}

export default CagrFunction;