import Discount from "../../entities/discount/IDiscount";
import HttpException from "@/utils/exceptions/HttpException";
import { buildHeadersWithBasicAuth } from "@/utils/serviceUtils";
import fetch, { Response } from "node-fetch";
import SimpleDiscount from "../../entities/discount/ISimpleDiscount";
import DiscountService from "./IDiscountService";
import CONSTANTS from "@/resources/ResourceConstants";
import Service from "@/utils/interfaces/IService";

let financialFactServiceDiscountV1Url = CONSTANTS.GLOBAL.EMPTY;

const discountService: Service & DiscountService = {

    setUrl: (): void => {
        financialFactServiceDiscountV1Url = process.env.ffs_base_url + CONSTANTS.DISCOUNT.V1_ENDPOINT;
    },

    getDiscountWithCik: async (cik: string): Promise<Discount> => {
        try {
            const url = `${financialFactServiceDiscountV1Url}/${cik}`;
            return fetch(url, { headers: buildHeadersWithBasicAuth() })
                .then(async (response: Response) => {
                    if (response.status !== 200) {
                        throw new HttpException(response.status, CONSTANTS.DISCOUNT.FETCH_ERROR + await response.text());
                    }
                    return response.json();
                }).then((body: Discount) => {
                    return body;
                });
        } catch (err: any) {
            throw new HttpException(err.status, CONSTANTS.DISCOUNT.FETCH_ERROR + err.message);
        }
    },

    deleteDiscount: async (cik: string): Promise<string> => {
        try {
            return fetch(`${financialFactServiceDiscountV1Url}/${cik}`, {
                method: CONSTANTS.GLOBAL.DELETE,
                headers: buildHeadersWithBasicAuth()
            }).then(async (response: Response) => {
                if (response.status != 200) {
                    throw new HttpException(response.status, CONSTANTS.DISCOUNT.FETCH_ERROR + await response.text());
                }
                return response.text();
            });
        } catch (err: any) {
            throw new HttpException(err.status, CONSTANTS.DISCOUNT.CREATION_ERROR + err.message);
        }
    },

    getBulkSimpleDiscounts: async (): Promise<SimpleDiscount[]> => {
        console.log("In discount service getting simple discounts");
        try {
            const url = `${financialFactServiceDiscountV1Url}/bulkSimpleDiscounts`;
            return fetch(url, { 
                headers: buildHeadersWithBasicAuth()
            }).then(async (response: Response) => {
                    if (response.status !== 200) {
                        throw new HttpException(response.status,
                            CONSTANTS.DISCOUNT.FETCH_ALL_CIK_ERROR + await response.text());
                    }
                    return response.json();
                }).then((body: SimpleDiscount[]) => {
                    return body;
                });
        } catch (err: any) {
            throw new HttpException(err.status,
                CONSTANTS.DISCOUNT.FETCH_ALL_CIK_ERROR + err.message);
        }
    },

    submitBulkDiscountStatusUpdate: async (discountUpdateMap: Record<string, boolean>): Promise<string[]> => {
        try {
            return fetch(financialFactServiceDiscountV1Url, {
                method: CONSTANTS.GLOBAL.PUT,
                headers: buildHeadersWithBasicAuth(),
                body: JSON.stringify({ discountUpdateMap })
            }).then(async (response: Response) => {
                if (response.status !== 200) {
                    throw new HttpException(response.status, CONSTANTS.DISCOUNT.UPDATE_ERROR + await response.text());   
                }
                return response.json();
            }).then((updates: string[]) => {
                return updates;
            });
        } catch (err: any) {
            throw new HttpException(err.status, CONSTANTS.DISCOUNT.UPDATE_ERROR + err.message);   
        }
    },

    saveDiscount: async (discount: Discount): Promise<string> => {
        try {
            return fetch(financialFactServiceDiscountV1Url, { 
                method: CONSTANTS.GLOBAL.POST,
                headers: buildHeadersWithBasicAuth(),
                body: JSON.stringify(discount)
            }).then(async (response: Response) => {
                if (response.status !== 201 && response.status !== 200) {
                    throw new HttpException(response.status, CONSTANTS.DISCOUNT.CREATION_ERROR + await response.text());   
                }
                return await response.text();
            });
        } catch (err: any) {
            throw new HttpException(err.status, CONSTANTS.DISCOUNT.CREATION_ERROR + err.message);   
        }
    }
}

export default discountService;
