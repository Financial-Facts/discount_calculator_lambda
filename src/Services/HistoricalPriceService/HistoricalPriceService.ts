import HistoricalPriceInput from "Services/HistoricalPriceService/models/HistoricalPriceInput";
import PriceData from "./models/PriceData";
import { buildHistoricalPriceInput, mapCSVToPriceData } from "./utils/HistoricalPriceUtils";
import fetch, { Response } from "node-fetch";
import CONSTANTS from "../../Services/ServiceConstants";
import ThirdPartyDataFailureException from "@/utils/exceptions/ThirdPartyDataFailureException";
import Service from "@/utils/interfaces/IService";
import HistoricalPriceService from "./IHistoricalPriceService";

let historicalPriceUrlV1 = CONSTANTS.GLOBAL.EMPTY;

const historicalPriceService: Service & HistoricalPriceService = {
    
    setUrl: (): void => {
        historicalPriceUrlV1 = process.env.historical_data_source_url_v1 ?? CONSTANTS.GLOBAL.EMPTY;
    },

    getHistoricalPrices: async (input: HistoricalPriceInput): Promise<PriceData[]> => {
        console.log(`In historical price service getting historical data for symbol: ${input.symbol}`);
        const url = `${historicalPriceUrlV1}/${input.symbol}` + 
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
    },

    getCurrentPrice: async (symbol: string): Promise<number> => {
        console.log("In historical price service getting current price for symbol: " + symbol);
        const to = new Date();
        const from = new Date();
        from.setDate(from.getDate() - 4);
        const input: HistoricalPriceInput = buildHistoricalPriceInput(symbol, from, to);
        return historicalPriceService.getHistoricalPrices(input)
            .then(priceData => {
                if (priceData && priceData.length > 0) {
                    const price = priceData[priceData.length - 1].close;
                    console.log(`Historical price data returned with current price: ${price}`);
                    return price;
                }
                throw new ThirdPartyDataFailureException(
                    `Passed three days historical data not found for: ${symbol}`);
            });
    }
}

export default historicalPriceService;