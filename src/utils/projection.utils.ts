import { averageOverPeriodFunction, periodicGrowthRatesFunction } from "@/services/calculator/calculator.service";
import { calculatorService } from "../bootstrap";
import { PeriodicData } from "../types";
import { addYears } from "./date.utils";
import { processPeriodicDatasets } from "./processing.utils";
import AverageOverPeriodFunction, { AverageOverPeriodVariables } from "@/services/calculator/functions/AverageOverPeriod.function";
import PeriodicGrowthRatesFunction, { PeriodicGrowthRatesVariables } from "@/services/calculator/functions/PeriodicGrowthRates.function";


// Project periodic data using growth rate
export function projectByAverageGrowth(cik: string, numYears: number, data: PeriodicData[]): PeriodicData[] {
    const result: PeriodicData[] = [];
    const averageGrowthRate = calculatorService.calculate(
        {
            periodicData: calculatorService.calculate(
                {
                    cik: cik,
                    periodicData: data
                },
                periodicGrowthRatesFunction
            ).slice(numYears - 1),
            numPeriods: numYears - 1
        },
        averageOverPeriodFunction
    ) / 100;

    const lastPeriod = data.slice(-1)[0];
    let value = lastPeriod.value;
    for (let i = 0; i < numYears; i++) {
        result.push({
            cik: cik,
            announcedDate: addYears(lastPeriod.announcedDate, i + 1),
            period: lastPeriod.period,
            value: value + (value * averageGrowthRate)
        });
        if (result[i]) {
            value = result[i].value;
        }
    }
    return result;
}

// Project periodic data by average percentage of other value
export function projectByAveragePercentOfValue(
    cik: string,
    data: PeriodicData[],
    historicalReferenceData: PeriodicData[],
    projectedReferenceData: PeriodicData[]
): PeriodicData[] {
    const averagePercent = calculatorService.calculate(
        {
            periodicData: processPeriodicDatasets(cik,
                data,
                historicalReferenceData, (a, b) => (a / b)),
            numPeriods: data.length
        },
        averageOverPeriodFunction
    );
    return projectedReferenceData.map((projectedReferenceData) => ({
        cik: cik,
        announcedDate: projectedReferenceData.announcedDate,
        period: projectedReferenceData.period,
        value: projectedReferenceData.value * averagePercent
    }));
}