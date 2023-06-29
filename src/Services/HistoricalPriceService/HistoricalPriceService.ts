import HistoricalPriceInput from "Services/HistoricalPriceService/models/HistoricalPriceInput";
import PriceData from "./models/PriceData";
import fetch from 'node-fetch';
import HttpException from "@/utils/exceptions/HttpException";
import CONSTANTS from "Services/ServiceConstants";
import { mapCSVToPriceData } from "./utils/HistoricalPriceUtils";


class HistoricalPriceService {

    private historicalPriceUrl: string;

    constructor() {
        this.historicalPriceUrl = 'https://query1.finance.yahoo.com/v7/finance/download'
    }

    public getHistoricalPrices(input: HistoricalPriceInput): Promise<PriceData[]> {
        try {
          const url = `${this.historicalPriceUrl}/${input.symbol}` + 
                      `?symbol=${input.symbol}&period1=${input.fromDate}` + 
                      `&period2=${input.toDate}&interval=1d&includeAdjustedClose=true`;
          return fetch(url)
              .then(async (response: Response) => {
                  if (response.status != 200) {
                      throw new HttpException(response.status, await response.text());
                  }
                  return response.text();
              }).then((body: string) => {
                  return mapCSVToPriceData(body);
              });
        } catch (err: any) {
            throw new HttpException(err.status, 'Error occurred while fetching historical prices: ' + err.message);
        }
    }
}

export default HistoricalPriceService;