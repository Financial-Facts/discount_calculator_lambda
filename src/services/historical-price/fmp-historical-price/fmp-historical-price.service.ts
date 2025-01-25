import ThirdPartyDataFailureException from "@/utils/exceptions/ThirdPartyDataFailureException";
import { IHistoricalPriceService } from "../historical-price-service.typings";
import { HistoricalPriceInput, PriceData } from "../historical-price.typings";
import { HistoricalData } from "./fmp-historical-price.typings";
import InsufficientDataException from "@/utils/exceptions/InsufficientDataException";

class FmpHistoricalPriceService implements IHistoricalPriceService {
    
    private fmp_base_url;
    private apiKey;
    
    constructor(fmp_base_url: string, apiKey: string) {
        this.fmp_base_url = fmp_base_url;
        this.apiKey = apiKey;
    }

    public async getHistoricalPrices(input: HistoricalPriceInput): Promise<PriceData[]> {
        console.log(`In fmp historical price service getting historical data with symbols: ${input.symbols}`);
        const formattedFromDate = input.fromDate.toISOString().split('T')[0];
        const formattedToDate = input.toDate.toISOString().split('T')[0]

        let allHistoricalData: PriceData[] = [];
        const dateSet = new Set<Date>();
        for (const symbol of input.symbols) {
            const url = `${this.fmp_base_url}/api/v3/historical-price-full/` + 
                `${symbol}?apikey=${this.apiKey}&from=${formattedFromDate}&to=${formattedToDate}`;
            await fetch(url, { method: 'GET'})
                .catch((err: any) => {
                    console.log(`Error occurred getting historical data for ${input}: ${err.message}`);
                    throw new ThirdPartyDataFailureException(`Error occurred while fetching historical prices: ${err.message}`);
                }).then(async (response: Response) => {
                    if (response.status != 200) {
                        throw new ThirdPartyDataFailureException(
                            `Error occurred getting historical data: ${await response.text()}`);
                    }
                    return response.json();
                }).then(async (body: HistoricalData) => {
                    if (!!body && !!body.historical) {
                        const periodicData = this.mapHistoricalDataToPeriodicData(body);
                        periodicData.forEach(period => {
                            if (!dateSet.has(period.date)) {
                                allHistoricalData.push(period);
                                dateSet.add(period.date);
                            }
                        })
                    }
                });
        }

        if (!!allHistoricalData.length) {
            return allHistoricalData;
        }

        throw new InsufficientDataException(`Insufficient historical data available for ${input.symbols}`);
    }

    private mapHistoricalDataToPeriodicData(historical: HistoricalData): PriceData[] {
        return historical.historical.map(data => ({
            date: data.date,
            close: data.adjClose
        }));
    }

    

}

export default FmpHistoricalPriceService;