export type BenchmarkRatioPrice = {
    ratioPrice: number
    input: BenchmarkPriceInput
}

export interface BenchmarkPriceInput {
    industry: string
    ttmRevenue: number
    sharesOutstanding: number
    psBenchmarkRatio: number
}