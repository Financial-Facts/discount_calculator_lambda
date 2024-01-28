import { PeriodicData } from "@/src/types"

export type QuarterlyData =
    NopatInput &
    IcInput &
    BenchmarkRatioPriceQuarterlyData &
    StickerPriceQuarterlyData &
    DiscountedCashFlowQuarterlyData;

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

export type RoicInput = NopatInput & IcInput;

export type StickerPriceQuarterlyData =
    DebtYearsInput &
    BvpsInput &
    PeInput &
    RoicInput & {
        quarterlyRevenue: PeriodicData[],
        quarterlyOperatingCashFlow: PeriodicData[]
    }

export interface BenchmarkRatioPriceQuarterlyData {
    quarterlyRevenue: PeriodicData[]
    quarterlyOutstandingShares: PeriodicData[]
}

export interface DiscountedCashFlowQuarterlyData {
    quarterlyRevenue: PeriodicData[]
    quarterlyOperatingCashFlow: PeriodicData[]
    quarterlyCapitalExpenditure: PeriodicData[]
}