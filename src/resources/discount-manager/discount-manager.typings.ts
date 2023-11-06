import { PeriodicData } from "@/src/types"

export type QuarterlyData =
    BvpsInput &
    PeInput &
    NopatInput &
    IcInput &
    RoicInput & 
    DebtYearsInput &
    BenchmarkRatioPriceInput &
    BigFiveInput;

export interface BigFiveInput {
    quarterlyOperatingCashFlow: PeriodicData[]
}

export interface BvpsInput {
    quarterlyShareholderEquity: PeriodicData[]
    quarterlyOutstandingShares: PeriodicData[]
}

export interface PeInput {
    quarterlyEPS: PeriodicData[]
}   

export interface NopatInput {
    quarterlyTaxExpense: PeriodicData[]
    quarterlyOperatingIncome: PeriodicData[]
}

export interface IcInput {
    quarterlyNetDebt: PeriodicData[]
    quarterlyTotalEquity: PeriodicData[]
}

export interface DebtYearsInput {
    quarterlyFreeCashFlow: PeriodicData[]
    quarterlyLongTermDebt: PeriodicData[]
}

export interface BenchmarkRatioPriceInput {
    quarterlyRevenue: PeriodicData[]
    quarterlyOutstandingShares: PeriodicData[]
}

export type RoicInput = NopatInput & IcInput;