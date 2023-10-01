import { PeriodicData } from "@/src/types"

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