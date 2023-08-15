import HttpException from "@/utils/exceptions/HttpException";
import CONSTANTS from "../../ResourceConstants";
import { buildHeadersWithBasicAuth } from "../../../utils/serviceUtils";
import Facts from "../../entities/facts/IFacts";
import StickerPriceData from "../../entities/facts/IStickerPriceData";
import fetch, { Response } from "node-fetch";
import fs from 'fs';
import Service from "@/utils/interfaces/IService";
import FactsService from "./IFactsService";

let financialFactsServiceFactsV1Url = CONSTANTS.GLOBAL.EMPTY;

const factsService: Service & FactsService = {

    setUrl: (): void => {
        financialFactsServiceFactsV1Url = process.env.ffs_base_url + CONSTANTS.FACTS.V1_ENDPOINT;
    },

    getFacts: async (cik: string): Promise<Facts> => {
        try {
            const url = `${financialFactsServiceFactsV1Url}/${cik}`;
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
    },

    getStickerPriceData: async (cik: string): Promise<StickerPriceData> => {
        console.log("In facts service gettings sticker price data for cik: " + cik);
        try {
            const url = `${financialFactsServiceFactsV1Url}/${cik}/stickerPriceData`;
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

export default factsService;