import { PeriodicData, Valuation } from "@/src/types";

export type StickerPrice = Valuation<StickerPriceInput>;

export interface StickerPriceInput {
    cik: string
    debtYears: number,
    annualBVPS: PeriodicData[]
    annualPE: PeriodicData[]
    annualROIC: PeriodicData[]
    annualEPS: PeriodicData[]
    annualEquity: PeriodicData[]
    annualRevenue: PeriodicData[]
    annualOperatingCashFlow: PeriodicData[]
}
