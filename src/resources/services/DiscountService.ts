import Discount from "../entities/discount/IDiscount";
import fetch from 'node-fetch';
import HttpException from "@/utils/exceptions/HttpException";
import CONSTANTS from "../ResourceConstants";
import StickerPriceService from "../../Services/StickerPriceService/StickerPriceService";
import { buildHeadersWithBasicAuth } from "@/utils/serviceUtils";


class DiscountService {

    private financialFactServiceDiscountV1Url: string;
    private stickerPriceService: StickerPriceService;

    constructor() {
        this.financialFactServiceDiscountV1Url 
            = process.env.FINANCIAL_FACTS_SERVICE_BASE_URL + CONSTANTS.DISCOUNT.V1_ENDPOINT;
        this.stickerPriceService = new StickerPriceService();
    }

    // Get an existing discount
    public async getBulk(): Promise<Discount[]> {
        try {
            const url = `${this.financialFactServiceDiscountV1Url}/bulk`;
            return fetch(url, { method: 'GET', headers: buildHeadersWithBasicAuth()})
                .then(async (response: Response) => {
                    if (response.status != 200) {
                        throw new HttpException(response.status, CONSTANTS.DISCOUNT.FETCH_ERROR + await response.text());
                    }
                    return response.json();
                }).then((body: Discount[]) => {
                    return body;
                });
        } catch (err: any) {
            throw new HttpException(err.status, CONSTANTS.DISCOUNT.FETCH_ERROR + err.message);
        }
    }

    // Check CIK for active discount
    public async checkForDiscount(cik: string): Promise<Discount | null> {
        console.log("In discount service checking for a discount on CIK: " + cik);
        return this.stickerPriceService.checkForSale(cik)
            .then((sale: Discount | null) => {
                if (sale) {
                    this.save(sale)
                        .then(response => {
                            if (response.includes('Success')) {
                                console.log("Sticker price sale saved for cik: " + cik);
                                return sale;
                            }
                            console.log("Sticker price save failed for cik: " + cik + " with response: " + response);
                            return sale;
                        }).catch((err: any) => {
                            console.log("Sticker price save failed for cik: " + cik + " with err: " + err);
                            return sale;
                        });
                    return sale;
                }
                console.log("CIK " + cik + " is not on sale");
                return null;
            }).finally(() => console.log("Checking " + cik + " for discount is complete"));
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
                })
            } catch (err: any) {
                throw new HttpException(err.status, CONSTANTS.DISCOUNT.CREATION_ERROR + err.message);   
            }
        }
}

export default DiscountService;