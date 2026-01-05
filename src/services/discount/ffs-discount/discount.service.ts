import CONSTANTS from "@/resources/resource.contants";
import HttpException from "@/utils/exceptions/HttpException";
import { SimpleDiscount, Discount, IndustryPSBenchmarkRatio } from "./discount.typings";
import { buildHeadersWithBasicAuth } from "./discount.utils";
import { IDiscountService } from "../discount-service.typings";

class DiscountService implements IDiscountService {

    private financialFactServiceDiscountV1Url: string;

    constructor(ffs_base_url: string) {
        this.financialFactServiceDiscountV1Url = ffs_base_url + CONSTANTS.DISCOUNT.V1_ENDPOINT;
    }
    
    getIndustryPSBenchmarkRatio(industry: string): Promise<IndustryPSBenchmarkRatio | null> {
        throw new Error("Method not implemented.");
    }
    upsertIndustryPSBenchmarkRatio(industry: string, ps_ratio: number): Promise<string> {
        throw new Error("Method not implemented.");
    }
    
    // Delete a discount
    async delete(cik: string): Promise<string> {
        try {
            return fetch(`${this.financialFactServiceDiscountV1Url}/${cik}`, { 
                method: CONSTANTS.GLOBAL.DELETE,
                headers: buildHeadersWithBasicAuth()
            }).then(async (response: Response) => {
                if (response.status != 200) {
                    throw new HttpException(response.status, CONSTANTS.DISCOUNT.FETCH_ERROR + await response.text());
                }
                return response.text();
            })
        } catch (err: any) {
            throw new HttpException(err.status, CONSTANTS.DISCOUNT.DELETE_ERROR + err.message);   
        }
    }

    // Get bulk simple discounts
    public async getBulkSimpleDiscounts(): Promise<SimpleDiscount[]> {
        console.log("In discount service getting simple discounts");
        try {
            const url = `${this.financialFactServiceDiscountV1Url}/bulkSimpleDiscounts`;
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
    }

    // Create a new discount 
    public async save(discount: Discount): Promise<string> {
        try {
            return fetch(this.financialFactServiceDiscountV1Url, { 
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

export default DiscountService;