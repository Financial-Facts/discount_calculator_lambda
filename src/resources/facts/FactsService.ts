import HttpException from "@/utils/exceptions/HttpException";
import CONSTANTS from "../ResourceConstants";
import fetch from 'node-fetch';
import Discount from "../discount/IDiscount";
import HistoricalPriceService, { frequency, HistoricalPriceInput } from "Services/HistoricalPriceService";
import CikService from "Services/CikService/CikService";


class FactsService {

    private financialFactsServiceFactsV1Url: string;
    private historicalPriceService: HistoricalPriceService;
    private cikService: CikService

    constructor() {
        this.financialFactsServiceFactsV1Url
            = process.env.FINANCIAL_FACTS_SERVICE_BASE_URL + CONSTANTS.FACTS.V1_ENDPOINT;
        this.historicalPriceService
            = new HistoricalPriceService();
        this.cikService
            = new CikService();
    }

    // Fetch financial facts for a company
    public async get(cik: string): Promise<any> {
        try {
            const url = `${this.financialFactsServiceFactsV1Url}/${cik}`;
            return fetch(url)
                .then(async (response: Response) => {
                    if (response.status != 200) {
                        throw new HttpException(response.status, CONSTANTS.FACTS.FETCH_ERROR + await response.text());
                    }
                    return response.text();
                }).then((body: string) => {
                    return JSON.parse(body);
                })
        } catch (err: any) {
            throw new HttpException(err.status, CONSTANTS.FACTS.FETCH_ERROR + err.message);
        }
    }

    public async checkForDiscount(cik: string, providedFacts?: any): Promise<Discount | void> {
        if (cik.length === 0) {
            throw new HttpException(400, CONSTANTS.FACTS.INPUT_ERROR);
        }
        const facts: any = providedFacts ? providedFacts : await this.get(cik);
        const h_data: any = this.historicalPriceService.getHistoricalPrices(this.buildHistoricalPriceInput(cik));
    }

    private buildHistoricalPriceInput(cik: string): HistoricalPriceInput {
        return {
            symbol: this.cikService.getSymbolWithCik(cik),
            startDate: new Date(), // ToDo: extend to 15 year period
            endDate: new Date(),
            frequency: frequency.DAILY
        }
    }
}

export default FactsService;
