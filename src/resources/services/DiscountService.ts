import CONSTANTS from "@/resources/ResourceConstants";
import Discount from "@/resources/entities/discount/IDiscount";
import SimpleDiscount from "@/resources/entities/discount/ISimpleDiscount";
import HttpException from "@/utils/exceptions/HttpException";
import { buildHeadersWithBasicAuth } from "@/utils/serviceUtils";

class DiscountService {

    private financialFactServiceDiscountV1Url: string;

    constructor(ffs_base_url: string) {
        this.financialFactServiceDiscountV1Url = ffs_base_url + CONSTANTS.DISCOUNT.V1_ENDPOINT;
    }
    
    // Delete a discount
    public async delete(cik: string): Promise<string> {
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
            throw new HttpException(err.status, CONSTANTS.DISCOUNT.CREATION_ERROR + err.message);   
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
    
    // Update discount status
    public async submitBulkDiscountStatusUpdate(discountUpdateMap: Record<string, boolean>): Promise<string[]> {
        try {
            return fetch(this.financialFactServiceDiscountV1Url, {
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