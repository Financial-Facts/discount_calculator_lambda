import { HistoricalPriceInput, PriceData } from "./historical-price.typings"

export interface IHistoricalPriceService {
    getHistoricalPrices(input: HistoricalPriceInput): Promise<PriceData[]>
}