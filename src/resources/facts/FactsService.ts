import HttpException from "@/utils/exceptions/HttpException";
import CONSTANTS from "../ResourceConstants";
import fetch from 'node-fetch';
import { buildHeadersWithBasicAuth } from "../../utils/serviceUtils";
import StickerPriceService from "../../Services/StickerPriceService/StickerPriceService";

class FactsService {

    private financialFactsServiceFactsV1Url: string;
    
    constructor() {
        this.financialFactsServiceFactsV1Url
            = process.env.FINANCIAL_FACTS_SERVICE_BASE_URL + CONSTANTS.FACTS.V1_ENDPOINT;
    }

    // Fetch financial facts for a company
    public async getFacts(cik: string): Promise<any> {
        try {
            const url = `${this.financialFactsServiceFactsV1Url}/${cik}`;
            return fetch(url, { method: 'GET', headers: buildHeadersWithBasicAuth()})
                .then(async (response: Response) => {
                    if (response.status != 200) {
                        throw new HttpException(response.status, CONSTANTS.FACTS.FETCH_ERROR + await response.text());
                    }
                    return response.text();
                }).then((body: string) => {
                    let data = JSON.parse(body);
                    return data;
                })
        } catch (err: any) {
            throw new HttpException(err.status, CONSTANTS.FACTS.FETCH_ERROR + err.message);
        }
    }
}

export default FactsService;
