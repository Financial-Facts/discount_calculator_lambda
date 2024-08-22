import { BigFive } from "@/services/calculator/calculator.typings";
import { calculatorService } from "../../bootstrap";
import { PeriodicData } from "@/src/types";
import { Qualifier } from "@/services/discount/ffs-discount/discount.typings";



export function buildQualifyingData(cik: string, bigFive: BigFive): Qualifier[] {
    return [
        ...checkAnnualDataAvgExceedsValue(cik, 'annualROIC', bigFive.annualROIC),
        ...checkAverageGrowthRateExceedsValue(cik, 'annualRevenue', bigFive.annualRevenue,  [5, 10]),
        ...checkAverageGrowthRateExceedsValue(cik, 'annualEPS', bigFive.annualEPS, [1, 5, 10]),
        ...checkAverageGrowthRateExceedsValue(cik, 'annualEquity', bigFive.annualEquity, [1, 5, 10]),
        ...checkAverageGrowthRateExceedsValue(cik, 'annualOperatingCashFlow', bigFive.annualOperatingCashFlow, [5, 10])
    ]
}


function checkAnnualDataAvgExceedsValue(
    cik: string,
    type: keyof BigFive,
    annualData: PeriodicData[]
): Qualifier[] {
    return [1, 5, 10].map(period => ({
        cik: cik,
        type: type,
        periods: period,
        value: calculatorService.calculateAverageOverPeriod({ 
            periodicData: annualData,
            numPeriods: period
        })
    }));
}


function checkAverageGrowthRateExceedsValue(
    cik: string,
    type: keyof BigFive,
    data: PeriodicData[],
    periods: number[]
): Qualifier[] {
    return periods.map(period => ({
        cik: cik,
        type: type,
        periods: period,
        value: calculatorService.calculateCAGR({
            periodicData: data,
            period: period
        })
    }));
}
