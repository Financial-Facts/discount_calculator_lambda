import HistoricalPriceInput from "Services/HistoricalPriceService/models/HistoricalPriceInput";
import PriceData from "./models/PriceData";
import HttpException from "@/utils/exceptions/HttpException";
import CONSTANTS from "@/resources/ResourceConstants";

class HistoricalPriceService {

    constructor() {}

    public getHistoricalPrices(input: HistoricalPriceInput): Promise<PriceData[]> {
        const yf = require('yahoo-finance');
        return yf.historical({
            symbol: input.symbol,
            from: input.fromDate,
            to: input.toDate,
            period: input.frequency
          }).catch((error: any) => {
            throw new HttpException(409, CONSTANTS.FACTS.H_DATA_FETCH_ERROR + error.message);
          })
    }
}

export default HistoricalPriceService;