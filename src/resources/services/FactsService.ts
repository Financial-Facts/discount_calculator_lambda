import CONSTANTS from "@/resources/ResourceConstants";
import Facts from "@/resources/entities/facts/IFacts";
import StickerPriceData from "@/resources/entities/facts/IStickerPriceData";
import HttpException from "@/utils/exceptions/HttpException";
import { buildHeadersWithBasicAuth } from "@/utils/serviceUtils";
import fs from 'fs';

class FactsService {

    private financialFactsServiceFactsV1Url: string;
    
    constructor(ffs_base_url: string) {
        this.financialFactsServiceFactsV1Url = ffs_base_url + CONSTANTS.FACTS.V1_ENDPOINT;
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
        console.log("In facts service gettings sticker price data for cik: " + cik);
        try {
            const url = `${this.financialFactsServiceFactsV1Url}/${cik}/stickerPriceData`;
            return fetch(url, { method: 'GET', headers: buildHeadersWithBasicAuth()})
                .then(async (response: Response) => {
                    if (response.status != 200) {
                        const text = await response.text();
                        if (response.status >= 500) {
                            fs.writeFile(`src\\reports\\errors\\${cik}.txt`, text, err => {
                                if (err) {
                                    console.error(err);
                                }
                            });
                        }
                        throw new HttpException(response.status, CONSTANTS.FACTS.FETCH_ERROR + text);
                    }
                    return response.json();
                }).then((body: StickerPriceData) => {
                    return body;
                });
        } catch (err: any) {
            throw new HttpException(err.status, CONSTANTS.FACTS.FETCH_ERROR + err.message);
        }
    }
}

export default FactsService;