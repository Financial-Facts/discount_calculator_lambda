import { Period } from "services/service.typings"

export interface PeriodicData {
    cik: string
    announcedDate: Date
    period: Period
    value: number
}

export type StickerPriceData = CompanyInfo & QuarterlyData;

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
