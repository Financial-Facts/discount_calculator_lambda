import HistoricalPriceInput from "./models/HistoricalPriceInput";
import PriceData from "./models/PriceData";

export default interface HistoricalPriceService {

    getHistoricalPrices(input: HistoricalPriceInput): Promise<PriceData[]>;
    getCurrentPrice(symbol: string): Promise<number>;

}