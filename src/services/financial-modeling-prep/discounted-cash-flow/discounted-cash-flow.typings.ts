import { Valuation, PeriodicData } from "@/src/types";

export type DiscountedCashFlowPrice = Valuation<DiscountedCashFlowInput>;

export type DiscountedCashFlowInput = DiscountedCashFlowIdentity & DiscountedCashFlowPeriodicData & {
    wacc: number
    longTermGrowthRate: number
    terminalValue: number
    freeCashFlowT1: number
    enterpriseValue: number
    netDebt: number
    dilutedSharesOutstanding: number
    marketPrice: number
};

export interface DiscountedCashFlowIdentity {
    cik: string
    symbol: string
}

export interface DiscountedCashFlowPeriodicData {
    historicalRevenue: PeriodicData[]
    projectedRevenue: PeriodicData[]
    historicalOperatingCashFlow: PeriodicData[]
    projectedOperatingCashFlow: PeriodicData[]
    historicalCapitalExpenditure: PeriodicData[]
    projectedCapitalExpenditure: PeriodicData[]
    historicalFreeCashFlow: PeriodicData[]
    projectedFreeCashFlow: PeriodicData[]
}

export interface DiscountedCashFlowData {
    year: number
    symbol: string
    revenue: number
    revenuePercentage: number
    capitalExpenditure: number
    capitalExpenditurePercentage: number
    price: number
    beta: number
    dilutedSharesOutstanding: number
    costofDebt: number
    taxRate: number
    afterTaxCostOfDebt: number
    riskFreeRate: number
    marketRiskPremium: number
    costOfEquity: number
    totalDebt: number
    totalEquity: number
    totalCapital: number
    debtWeighting: number
    equityWeighting: number
    wacc: number
    operatingCashFlow: number
    pvLfcf: number
    sumPvLfcf: number
    longTermGrowthRate: number
    freeCashFlow: number
    terminalValue: number
    presentTerminalValue: number
    enterpriseValue: number
    netDebt: number
    equityValue: number
    equityValuePerShare: number
    freeCashFlowT1: number
    operatingCashFlowPercentage: number
}