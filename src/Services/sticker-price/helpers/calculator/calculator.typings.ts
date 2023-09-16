import StickerPriceData, { PeriodicData } from "@/services/sticker-price/sticker-price.typings";


export interface StickerPriceInput {
    data: StickerPriceData
    growthRates: Record<number, number>,
    annualPE: PeriodicData[],
    annualBVPS: PeriodicData[],
    annualEPS: PeriodicData[],
    analystGrowthEstimate: number
}

export interface BigFive {
    annualROIC: PeriodicData[],
    annualRevenue: PeriodicData[],
    annualEPS: PeriodicData[],
    annualEquity: PeriodicData[],
    annualOperatingCashFlow: PeriodicData[]
}