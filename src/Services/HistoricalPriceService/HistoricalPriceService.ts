import HistoricalPriceInput from "Services/HistoricalPriceService/models/HistoricalPriceInput";
import PriceData from "./models/PriceData";
import { mapCSVToPriceData } from "./utils/HistoricalPriceUtils";
import fetch, { Response } from "node-fetch";
import CONSTANTS from "../../Services/ServiceConstants";
import yahooStockAPI from "yahoo-stock-api";
import { getSymbolResponse } from "yahoo-stock-api/dist/types/getSymbol";
import ThirdPartyDataFailureException from "@/utils/exceptions/ThirdPartyDataFailureException";

class HistoricalPriceService {

    private historicalPriceUrlV1: string;
    private yahoo: yahooStockAPI;

    constructor() {
        this.historicalPriceUrlV1 = process.env.historical_data_source_url_v1 ?? CONSTANTS.GLOBAL.EMPTY;
        this.yahoo = new yahooStockAPI();
    }

    public async getHistoricalPrices(input: HistoricalPriceInput): Promise<PriceData[]> {
        console.log(`In historical price service getting historical data for symbol: ${input.symbol}`);
        try {
            const url = `${this.historicalPriceUrlV1}/${input.symbol}` + 
                      `?symbol=${input.symbol}&period1=${input.fromDate}` + 
                      `&period2=${input.toDate}&interval=1d&includeAdjustedClose=true`;
            return fetch(url, { method: 'GET'})
                .catch((err: any) => {
                    console.log(`Error occurred getting historical data for ${input.symbol}: ${err.message}`);
                    throw new ThirdPartyDataFailureException(`Error occurred while fetching historical prices: ${err.message}`);
                }).then(async (response: Response) => {
                    if (response.status != 200) {
                        throw new ThirdPartyDataFailureException(
                            `Error occurred getting historical data: ${await response.text()}`);
                    }
                    return response.text();
                }).then(async (body: string) => {
                    return mapCSVToPriceData(body);
                });
        } catch (err: any) {
            throw new ThirdPartyDataFailureException(`Error occurred while fetching historical prices: ${err.message}`);
        }
    }

    public async getCurrentPrice(symbol: string): Promise<number> {
        console.log("In historical price service getting current price for symbol: " + symbol);
        try {
            return this.yahoo.getSymbol({ symbol: symbol })
                .then(async response => {
                    if (response.error) {
                        throw new ThirdPartyDataFailureException(
                            "Error occurred while getting current price data: " + response.message);
                    }
                    return response.response;
                }).then(async body => {
                    return (body as getSymbolResponse).previousClose;
                });
        } catch (err: any) {
            throw new ThirdPartyDataFailureException('Error occurred while getting current price data: ' + err.message);
        }
    }
}

export default HistoricalPriceService;