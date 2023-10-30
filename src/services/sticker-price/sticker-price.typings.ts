import { PeriodicData } from "@/src/types";

export interface TrailingPriceData {
    cik: string;
    stickerPrice: number;
    salePrice: number;
}

export interface StickerPriceInput {
    cik: string
    annualBVPS: PeriodicData[]
    annualPE: PeriodicData[]
    annualROIC: PeriodicData[]
    annualEPS: PeriodicData[]
    annualEquity: PeriodicData[]
    annualRevenue: PeriodicData[]
    annualOperatingCashFlow: PeriodicData[]
}

export interface StickerPrice {
    cik: string
    ttmPriceData: TrailingPriceData
    tfyPriceData: TrailingPriceData
    ttyPriceData: TrailingPriceData
    input: StickerPriceInput
}
