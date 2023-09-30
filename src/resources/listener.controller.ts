import { Router, Request, Response, NextFunction } from "express";
import HttpException from "@/utils/exceptions/HttpException";
import { SimpleDiscount } from "@/services/discount/discount.typings";
import { Controller } from "@/src/types";
import { discountService, historicalPriceService } from "../bootstrap";
import CONSTANTS from "./resource.contants";
import { checkSimpleDiscountIsOnSale } from "./resource.utils";

class ListenerController implements Controller {

    path = CONSTANTS.LISTENER.V1_ENDPOINT;
    router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        console.log('Initializing listener routes...');
        
        this.router.put(
            `${this.path}/checkDiscountStatus`,
            this.checkAndUpdateDiscountStatus
        )
    }

    private checkAndUpdateDiscountStatus = async (
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const discountStatusChecks = await this.bulkCheckDiscountStatusAndUpdate();
            response.status(200).json(discountStatusChecks);
        } catch (err: any) {
            next(new HttpException(err.status, err.message));
        }
    }
    
    // Check if all discounts currently saved or active/inactive and updates them
    private async bulkCheckDiscountStatusAndUpdate(): Promise<string[]> {
        console.log('In discount service updating bulk discount statuses');
        return discountService.getBulkSimpleDiscounts()
            .then(async (simpleDiscounts: SimpleDiscount[]) => {
                const pricePromises: Promise<number>[] = [];
                simpleDiscounts.forEach(simpleDiscount => {
                    pricePromises.push(historicalPriceService.getCurrentPrice(simpleDiscount.symbol));
                });
                return Promise.all(pricePromises)
                    .then(async prices => {
                        const unchanged: string[] = [];
                        const discountUpdateMap: Record<string, boolean> = {};
                        for(let i = 0; i < simpleDiscounts.length; i++) {
                            const simpleDiscount = simpleDiscounts[i];
                            const currentPrice = prices[i];
                            if (checkSimpleDiscountIsOnSale(currentPrice, simpleDiscount)) {
                                if (simpleDiscount.active) {
                                    unchanged.push(`${simpleDiscount.cik} status remains active`);
                                } else {
                                    discountUpdateMap[simpleDiscount.cik] = true;
                                }
                            } else {
                                if (!simpleDiscount.active) {
                                    unchanged.push(`${simpleDiscount.cik} status remains inactive`);
                                } else {
                                    discountUpdateMap[simpleDiscount.cik] = false;
                                }
                            }
                        }
                        return discountService.submitBulkDiscountStatusUpdate(discountUpdateMap)
                            .then(updates => {
                                return [...unchanged, ...updates];
                            });
                    });
            });
    }

}

export default ListenerController;