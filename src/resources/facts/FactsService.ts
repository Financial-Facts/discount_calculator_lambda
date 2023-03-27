import HttpException from "@/utils/exceptions/HttpException";
import CONSTANTS from "../ResourceConstants";
import fetch from 'node-fetch';
import Discount from "../discount/IDiscount";
import { Worker } from 'worker_threads';


class FactsService {

    private financialFactsServiceFactsV1Url: string;

    constructor() {
        this.financialFactsServiceFactsV1Url
            = process.env.FINANCIAL_FACTS_SERVICE_BASE_URL + CONSTANTS.FACTS.V1_ENDPOINT;
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

    public async checkForDiscounts(cikList: string[]): Promise<Discount | void> {
        if (cikList.length === 0) {
            throw new HttpException(400, CONSTANTS.FACTS.INPUT_ERROR);
        }
    }
}

export default FactsService;
