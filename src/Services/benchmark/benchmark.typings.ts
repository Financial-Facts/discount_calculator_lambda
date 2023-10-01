export type BenchmarkRatioPrice = {
    cik: string
    ratioPrice: number
    input: BenchmarkPriceInput
}

export interface BenchmarkPriceInput {
    cik: string
    industry: string
    ttmRevenue: number
    sharesOutstanding: number
    psBenchmarkRatio: number
}