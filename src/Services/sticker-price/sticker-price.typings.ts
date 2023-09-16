import { Period } from "services/service.typings"

export interface PeriodicData {
    cik: string
    announcedDate: Date
    period: Period
    value: number
}

export default interface StickerPriceData {
    cik: string
    symbol: string
    name: string
    benchmarkRatioPrice: number
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