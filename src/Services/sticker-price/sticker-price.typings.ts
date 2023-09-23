import { PeriodicData } from "@/resources/consumers/price-check-consumer/discount-manager/discount-manager.typings";

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
    ttmPriceData: TrailingPriceData
    tfyPriceData: TrailingPriceData
    ttyPriceData: TrailingPriceData
    input: StickerPriceInput
}
