import { Period } from "services/service.typings"

export interface PeriodicData {
    cik: string
    announcedDate: Date
    period: Period
    value: number
}

export interface TrailingPriceData {
    cik: string;
    stickerPrice: number;
    salePrice: number;
}

export interface StickerPrice {
    cik: string;
    symbol: string;
    name: string;
    active: boolean;
    lastUpdated?: Date
    ttmPriceData: TrailingPriceData
    tfyPriceData: TrailingPriceData
    ttyPriceData: TrailingPriceData
    quarterlyBVPS: PeriodicData[]
    quarterlyPE: PeriodicData[]
    quarterlyEPS: PeriodicData[]
    quarterlyROIC: PeriodicData[]
}

export type DiscountInput = CompanyInfo & QuarterlyData;

export interface CompanyInfo {
    cik: string
    symbol: string
    name: string
    industry: string
}

export interface QuarterlyData {
    quarterlyShareholderEquity: PeriodicData[]
    quarterlyOutstandingShares: PeriodicData[]
    quarterlyEPS: PeriodicData[]
    quarterlyOperatingIncome: PeriodicData[]
    quarterlyTaxExpense: PeriodicData[]
    quarterlyNetDebt: PeriodicData[]
    quarterlyTotalEquity: PeriodicData[]
    quarterlyRevenue: PeriodicData[]
    quarterlyOperatingCashFlow: PeriodicData[]
    quarterlyFreeCashFlow: PeriodicData[]
}
