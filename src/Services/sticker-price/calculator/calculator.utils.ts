import { BigFive, StickerPriceInput } from "@/services/calculator/calculator.typings";
import { calculatorService } from "../../../bootstrap";
import { PeriodicData, StickerPriceData } from "../sticker-price.typings";
import { annualizeByLastQuarter, annualizeByAdd } from "../utils/periodic-data.utils";


export function buildBigFive(
    data: StickerPriceData,
    annualROIC: PeriodicData[],
    annualEPS:  PeriodicData[]
): BigFive {
    return {
        annualROIC: annualROIC,
        annualEPS: annualEPS,
        annualEquity: annualizeByLastQuarter(data.cik, data.quarterlyTotalEquity),
        annualRevenue: annualizeByAdd(data.cik, data.quarterlyRevenue),
        annualOperatingCashFlow: annualizeByAdd(data.cik, data.quarterlyOperatingCashFlow)
    }
}

export function buildStickerPriceInput(
    data: StickerPriceData,
    annualPE: PeriodicData[],
    annualBVPS: PeriodicData[],
    annualEPS: PeriodicData[]
): StickerPriceInput {
    return {
        data: data,
        growthRates: calculateGrowthRatesOverPeriods(data.cik, annualBVPS),
        annualPE: annualPE,
        annualBVPS: annualBVPS,
        annualEPS: annualEPS,
        analystGrowthEstimate: 0 //ToDo: Add growth estimate service
    }
}

function calculateGrowthRatesOverPeriods(cik: string, annualData: PeriodicData[]): Record<number, number> {
    const annualGrowthRates = calculatorService.calculatePeriodicGrowthRates({ cik: cik, periodicData: annualData});
    return {
        1: calculatorService.calculateAverageOverPeriod({ periodicData: annualGrowthRates, numPeriods: 1}),
        5: calculatorService.calculateAverageOverPeriod({ periodicData: annualGrowthRates, numPeriods: 5}),
        10: calculatorService.calculateAverageOverPeriod({ periodicData: annualGrowthRates, numPeriods: 10})
    }
}
