import HttpException from "@/utils/exceptions/HttpException";
import CONSTANTS from "../ResourceConstants";
import fetch from 'node-fetch';
import { buildHeadersWithBasicAuth } from "../../utils/serviceUtils";
import StickerPriceService from "../../Services/StickerPriceService/StickerPriceService";
import Facts from "../entities/facts/IFacts";
import StickerPriceData from "../entities/facts/IStickerPriceData";

class FactsService {

    private financialFactsServiceFactsV1Url: string;
    
    constructor() {
        this.financialFactsServiceFactsV1Url
            = process.env.FINANCIAL_FACTS_SERVICE_BASE_URL + CONSTANTS.FACTS.V1_ENDPOINT;
    }

    // Fetch financial facts for a company
    public async getFacts(cik: string): Promise<Facts> {
        try {
            const url = `${this.financialFactsServiceFactsV1Url}/${cik}`;
            return fetch(url, { method: 'GET', headers: buildHeadersWithBasicAuth()})
                .then(async (response: Response) => {
                    if (response.status != 200) {
                        throw new HttpException(response.status, CONSTANTS.FACTS.FETCH_ERROR + await response.text());
                    }
                    return response.json();
                }).then((body: Facts) => {
                    return body;
                })
        } catch (err: any) {
            throw new HttpException(err.status, CONSTANTS.FACTS.FETCH_ERROR + err.message);
        }
    }

    // Fetch sticker price data for a company
    public async getStickerPriceData(cik: string): Promise<StickerPriceData> {
        try {
            const url = `${this.financialFactsServiceFactsV1Url}/${cik}/stickerPriceData`;
            return fetch(url, { method: 'GET', headers: buildHeadersWithBasicAuth()})
                .then(async (response: Response) => {
                    if (response.status != 200) {
                        throw new HttpException(response.status, CONSTANTS.FACTS.FETCH_ERROR + await response.text());
                    }
                    return response.json();
                }).then((body: StickerPriceData) => {
                    return body;
                })
        } catch (err: any) {
            throw new HttpException(err.status, CONSTANTS.FACTS.FETCH_ERROR + err.message);
        }
    }
}

export default FactsService;
