import { PeriodicData } from "../models/PeriodicData"

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

    
}