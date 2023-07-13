import Discount from "../entities/discount/IDiscount";
import HttpException from "@/utils/exceptions/HttpException";
import CONSTANTS from "../ResourceConstants";
import StickerPriceService from "../../Services/StickerPriceService/StickerPriceService";
import { buildHeadersWithBasicAuth } from "@/utils/serviceUtils";
import fetch, { Response } from "node-fetch";
import HistoricalPriceService from "../../Services/HistoricalPriceService/HistoricalPriceService";
import SimpleDiscount from "../entities/discount/ISimpleDiscount";

class DiscountService {

    private financialFactServiceDiscountV1Url: string;
    private stickerPriceService: StickerPriceService;
    private historicalPriceService: HistoricalPriceService;

    constructor() {
        this.financialFactServiceDiscountV1Url 
            = process.env.FINANCIAL_FACTS_SERVICE_BASE_URL + CONSTANTS.DISCOUNT.V1_ENDPOINT;
        this.historicalPriceService = new HistoricalPriceService();
        this.stickerPriceService = new StickerPriceService(this.historicalPriceService);
    }

    // Get an existing discount
    public async getDiscountWithCik(cik: string): Promise<Discount> {
        try {
            const url = `${this.financialFactServiceDiscountV1Url}/${cik}`;
            return fetch(url, { headers: buildHeadersWithBasicAuth()})
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
    }

    // Check CIK for active discount
    public async checkForDiscount(cik: string): Promise<boolean> {
        console.log("In discount service checking for a discount on CIK: " + cik);
        return this.stickerPriceService.checkForSale(cik)
            .then((discount: Discount) => {
                this.save(discount)
                    .then(response => {
                        if (response.includes('Success')) {
                            console.log("Sticker price sale saved for cik: " + cik);
                            return discount;
                        }
                        console.log("Sticker price save failed for cik: " + cik + " with response: " + response);
                        return discount;
                    }).catch((err: any) => {
                        console.log("Sticker price save failed for cik: " + cik + " with err: " + err);
                        return discount;
                    });
                return discount.active;
            });
    }

    public async bulkUpdateDiscountStatus(): Promise<string[]> {
        console.log('In discount service updating bulk discount statuses');
        return this.getBulkSimpleDiscounts()
            .then(async (simpleDiscounts: SimpleDiscount[]) => {
                const pricePromises: Promise<number>[] = [];
                simpleDiscounts.forEach(simpleDiscount => {
                    pricePromises.push(this.historicalPriceService.getCurrentPrice(simpleDiscount.symbol));
                });
                return Promise.all(pricePromises)
                    .then(async prices => {
                        const updates: string[] = [];
                        const updatePromises: Promise<string>[] = [];
                        for(let i = 0; i < simpleDiscounts.length; i++) {
                            const simpleDiscount = simpleDiscounts[i];
                            const currentPrice = prices[i];
                            if (currentPrice < simpleDiscount.ttmSalePrice ||
                                currentPrice < simpleDiscount.tfySalePrice ||
                                currentPrice < simpleDiscount.ttySalePrice) {
                                    if (simpleDiscount.active) {
                                        updates.push(`${simpleDiscount.cik} status remains active`);
                                    } else {
                                        updatePromises.push(this.updateStatus(simpleDiscount.cik, true)
                                            .then(response => {
                                                return `${simpleDiscount.cik} status is now active`;
                                            }).catch((err: any) => {
                                                return `Update discount failed while updating ${simpleDiscount.cik} status to active`;
                                            }));
                                    }
                            } else {
                                if (!simpleDiscount.active) {
                                    updates.push(`${simpleDiscount.cik} status remains inactive`);
                                } else {
                                    updatePromises.push(this.updateStatus(simpleDiscount.cik, false)
                                        .then(response => {
                                            return `${simpleDiscount.cik} status is now inactive`;
                                        }).catch((err: any) => {
                                            return `Update discount failed while updating ${simpleDiscount.cik} status to inactive`;
                                        }));
                                }
                            }
                        }
                        return Promise.all(updatePromises).then(resolvedUpdates => {
                            return [...updates, ...resolvedUpdates];
                        });
                    });
            });
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
    private async getBulkSimpleDiscounts(): Promise<SimpleDiscount[]> {
        console.log("In discount service getting cik for all discounts");
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
    private async save(discount: Discount): Promise<string> {
        try {
            return fetch(this.financialFactServiceDiscountV1Url, { 
                method: CONSTANTS.GLOBAL.POST,
                headers: buildHeadersWithBasicAuth(),
                body: JSON.stringify(discount)
            }).then((response: Response) => {
                return response.text();
            });
        } catch (err: any) {
            throw new HttpException(err.status, CONSTANTS.DISCOUNT.CREATION_ERROR + err.message);   
        }
    }

    // Update discount status
    private async updateStatus(cik: string, active: boolean): Promise<string> {
        try {
            return fetch(this.financialFactServiceDiscountV1Url, {
                method: CONSTANTS.GLOBAL.PUT,
                headers: buildHeadersWithBasicAuth(),
                body: JSON.stringify({ cik: cik, active: active })
            }).then((response: Response) => {
                return response.text();
            });
        } catch (err: any) {
            throw new HttpException(err.status, CONSTANTS.DISCOUNT.UPDATE_ERROR + err.message);   
        }
    }
}

export default DiscountService;