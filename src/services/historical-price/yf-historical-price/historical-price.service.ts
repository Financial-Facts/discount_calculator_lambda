import fetch, { Response } from "node-fetch";
import ThirdPartyDataFailureException from "@/utils/exceptions/ThirdPartyDataFailureException";
import { HistoricalPriceInput, PriceData } from "../historical-price.typings";
import { mapCSVToPriceData } from "./historical-price.utils";
import { IHistoricalPriceService } from "../historical-price-service.typings";

class HistoricalPriceService implements IHistoricalPriceService {

    private historicalPriceUrlV1: string;

    constructor(historical_price_url: string) {
        this.historicalPriceUrlV1 = historical_price_url;
    }

    public async getHistoricalPrices(input: HistoricalPriceInput): Promise<PriceData[]> {
        console.log(`In historical price service getting historical data for symbol: ${input.symbol}`);
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
    }
}

export default HistoricalPriceService;