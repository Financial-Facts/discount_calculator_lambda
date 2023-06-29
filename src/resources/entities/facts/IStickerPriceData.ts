import QuarterlyData from "../models/QuarterlyData"

export default interface StickerPriceData {

    cik: string
    symbol: string
    name: string
    benchmarkRatioPrice: number
    quarterlyShareholderEquity: QuarterlyData[]
    quarterlyOutstandingShares: QuarterlyData[]
    quarterlyEPS: QuarterlyData[]
    quarterlyLongTermDebt: QuarterlyData[]
    quarterlyNetIncome: QuarterlyData[]
    
}