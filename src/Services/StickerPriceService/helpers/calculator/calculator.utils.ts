import StickerPriceData from "@/resources/entities/facts/IStickerPriceData";
import { PeriodicData } from "@/resources/entities/models/PeriodicData";
import { BigFive, StickerPriceInput } from "./calculator.typings";
import { annualizeByLastQuarter, annualizeByAdd } from "../../../../Services/StickerPriceService/utils/QuarterlyDataUtils";

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
    const annualGrowthRates = convertToAnnualGrowthRates(cik, annualData);
    const tyy_BVPS_growth = annualGrowthRates[annualGrowthRates.length - 1].value;
    const tfy_BVPS_growth = annualGrowthRates.slice(-5).map(period => period.value).reduce((a, b) => a + b) / 5;
    const tty_BVPS_growth = annualGrowthRates.slice(-10).map(period => period.value).reduce((a, b) => a + b) / 10;
    return { 1: tyy_BVPS_growth, 5: tfy_BVPS_growth, 10: tty_BVPS_growth };
}

function convertToAnnualGrowthRates(cik: string, data: PeriodicData[]): PeriodicData[] {
    const annualGrowthRates: PeriodicData[] = [];
    let i = 1;
    while (i < data.length) {
        let previous = data[i - 1];
        let current = data[i];
        annualGrowthRates.push({
            cik: cik,
            announcedDate: current.announcedDate,
            period: current.period,
            value: ((current.value - previous.value) / Math.abs(previous.value)) * 100
        });
        i++;
    }
    return annualGrowthRates;
}