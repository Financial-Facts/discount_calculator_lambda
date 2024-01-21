import { PeriodicData, Valuation } from "@/src/types"

export type DiscountedCashFlowPrice = Valuation<DiscountedCashFlowInput>;

export interface DiscountedCashFlowInput {
    cik: string
    freeCashFlowHistorical: PeriodicData[]
    freeCashFlowProjected: PeriodicData[]
    wacc: number
    riskFreeRate: number
    totalCash: number
    totalDebt: number
    dilutedSharesOutstanding: number
    terminalValue: number
    enterpriseValue: number
}

export interface DiscountedCashFlowData {
    year: number
    symbol: string
    revenue: number
    revenuePercentage: number
    ebitda: number
    ebitdaPercentage: number
    ebit: number
    ebitPercentage: number
    depreciation: number
    depreciationPercentage: number
    totalCash: number
    totalCashPercentage: number
    receivables: number
    receivablesPercentage: number
    inventories: number
    inventoriesPercentage: number
    payable: number
    payablePercentage: number
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
    taxRateCash: number
    ebiat: number
    ufcf: number
    sumPvUfcf: number
    longTermGrowthRate: number
    terminalValue: number
    presentTerminalValue: number
    enterpriseValue: number
    netDebt: number
    equityValue: number
    equityValuePerShare: number
    freeCashFlowT1: number
}