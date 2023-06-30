import HistoricalPriceInput from "Services/HistoricalPriceService/models/HistoricalPriceInput";
import PriceData from "./models/PriceData";
import fetch from 'node-fetch';
import HttpException from "@/utils/exceptions/HttpException";
import CONSTANTS from "Services/ServiceConstants";
import { mapCSVToPriceData } from "./utils/HistoricalPriceUtils";
import { FinancialDataListWrapper } from "./models/FinancialData";
import { buildHistoricalPriceHeaders } from "@/utils/serviceUtils";
import { symbol } from "joi";


class HistoricalPriceService {

    private historicalPriceUrlV7: string;
    private stockQuoteUrlV11: string;

    constructor() {
        this.historicalPriceUrlV7 = 'https://query1.finance.yahoo.com/v7/finance/download';
        this.stockQuoteUrlV11 = 'https://query1.finance.yahoo.com/v11/finance/quoteSummary';
    }

    public getHistoricalPrices(input: HistoricalPriceInput): Promise<PriceData[]> {
        console.log("In historical price service getting historical data for symbol: " + input.symbol);
        try {
          const url = `${this.historicalPriceUrlV7}/${input.symbol}` + 
                      `?symbol=${input.symbol}&period1=${input.fromDate}` + 
                      `&period2=${input.toDate}&interval=1d&includeAdjustedClose=true`;
          return fetch(url, { method: 'GET', headers: buildHistoricalPriceHeaders()})
              .then(async (response: Response) => {
                  if (response.status != 200) {
                      throw new HttpException(response.status,
                        "Error occurred getting historical data: " + await response.text());
                  }
                  return response.text();
              }).then((body: string) => {
                  console.log("Historical data successfully retrieved for symbol: " + input.symbol);
                  return mapCSVToPriceData(body);
              });
        } catch (err: any) {
            throw new HttpException(err.status, 'Error occurred while fetching historical prices: ' + err.message);
        }
    }

    public getCurrentPrice(symbol: string): Promise<number> {
        console.log("In historical price service getting current price for symbol: " + symbol);
        try {
            const url = `${this.stockQuoteUrlV11}/${symbol}?modules=financialData`;
            return fetch(url)
                .then(async (response: Response) => {
                    if (response.status != 200) {
                        throw new HttpException(response.status,
                            "Error occurred while getting current price data: " + await response.text());
                    }
                    return response.json();
                }).then((body: FinancialDataListWrapper) => {
                    return body.quoteSummary.result[0].financialData.currentPrice.raw;
                });
        } catch (err: any) {
            throw new HttpException(err.status, 'Error occurred while getting current price data: ' + err.message);
        }
    }
}

export default HistoricalPriceService;