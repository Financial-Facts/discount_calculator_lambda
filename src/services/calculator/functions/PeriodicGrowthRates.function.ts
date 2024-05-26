import { PeriodicData } from "@/src/types";
import AbstractFunction from "./AbstractFunction";
import DisqualifyingDataException from "@/utils/exceptions/DisqualifyingDataException";
import { getLastPeriodValue } from "@/utils/processing.utils";


class PeriodicGrowthRatesFunction extends AbstractFunction {

    calculate(data: {
        cik: string,
        periodicData: PeriodicData[],
        simplifiedGrowthRateMinimum?: number,
    }): PeriodicData[] {
        const periodicGrowthRates: PeriodicData[] = [];
        const periodicData = data.periodicData;

        if (!!data.simplifiedGrowthRateMinimum) {
            const previous = periodicData.slice(1)[0].value;
            const current = getLastPeriodValue(periodicData);
            const simplifiedGrowthRate = (1 - ((current / previous) * (1 / periodicData.length))) * 100;
            if (simplifiedGrowthRate < data.simplifiedGrowthRateMinimum) {
                throw new DisqualifyingDataException(`Simplified growth rate minimum not achieved`);
            }
        }

        let i = 1;
        while (i < periodicData.length) {
            const previous = periodicData[i - 1];
            const current = periodicData[i];
            const growthRate = ((current.value - previous.value) / Math.abs(previous.value)) * 100;
            periodicGrowthRates.push({
                cik: data.cik,
                announcedDate: current.announcedDate,
                period: current.period,
                value: growthRate
            });
            i++;
        }
        return periodicGrowthRates;
    }
    
}

export default PeriodicGrowthRatesFunction;