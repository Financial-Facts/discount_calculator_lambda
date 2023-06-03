import Discount from "./IDiscount";
import fetch from 'node-fetch';
import HttpException from "@/utils/exceptions/HttpException";
import CONSTANTS from "../ResourceConstants";
import StickerPriceService from "../../Services/StickerPriceService/StickerPriceService";


class DiscountService {

    private financialFactServiceDiscountV1Url: string;
    private stickerPriceService: StickerPriceService;

    constructor() {
        this.financialFactServiceDiscountV1Url 
            = process.env.FINANCIAL_FACTS_SERVICE_BASE_URL + CONSTANTS.DISCOUNT.V1_ENDPOINT;
        this.stickerPriceService = new StickerPriceService();
    }

    // Create a new discount 
    public async create(discount: Discount): Promise<string> {
        try {
            return fetch(this.financialFactServiceDiscountV1Url, { 
                method: CONSTANTS.GLOBAL.POST,
                headers: { 
                    "Content-Type": CONSTANTS.GLOBAL.JSON
                },
                body: JSON.stringify(discount)
            }).then((response: Response) => {
                return response.text();
            })
        } catch (err: any) {
            throw new HttpException(err.status, CONSTANTS.DISCOUNT.CREATION_ERROR + err.message);   
        }
    }

    // Update an existing discount 
    public async update(discount: Discount): Promise<Discount> {
        try {
            return fetch(this.financialFactServiceDiscountV1Url, {
                method: CONSTANTS.GLOBAL.PUT,
                headers: { 
                    "Content-Type": CONSTANTS.GLOBAL.JSON,
                },
                body: JSON.stringify(discount)
            }).then((response: Response) => {
                return response.text();
            }).then((body: string) => {
                return JSON.parse(body);
            });
        } catch (err: any) {
            throw new HttpException(err.status, CONSTANTS.DISCOUNT.UPDATE_ERROR + err.message);   
        }
    }

    // Get an existing discount
    public async get(cik: string): Promise<Discount> {
        try {
            const url = `${this.financialFactServiceDiscountV1Url}/${cik}`;
            return fetch(url)
                .then(async (response: Response) => {
                    if (response.status != 200) {
                        throw new HttpException(response.status, CONSTANTS.DISCOUNT.FETCH_ERROR + await response.text());
                    }
                    return response.text();
                }).then((body: string) => {
                    return JSON.parse(body);
                });
        } catch (err: any) {
            throw new HttpException(err.status, CONSTANTS.DISCOUNT.FETCH_ERROR + err.message);
        }
    }

    public async checkForDiscount(cik: string): Promise<Discount | null> {
        return this.stickerPriceService.getStickerPriceDiscount(cik);
    }
}

export default DiscountService;