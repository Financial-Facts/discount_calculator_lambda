import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/IController';
import HttpException from '@/utils/exceptions/HttpException';
import DiscountService from '../services/DiscountService';
import Discount from '../entities/discount/IDiscount';
import CONSTANTS from '../ResourceConstants';

class DiscountController implements Controller {

    public path = CONSTANTS.DISCOUNT.V1_ENDPOINT;
    public router = Router();
    private discountService = new DiscountService();

    constructor() {
        this.initializeRoute();
    }

    private initializeRoute(): void {
        console.log("Initializing discount routes...");

        this.router.get(
            `${this.path}/:cik(${CONSTANTS.GLOBAL.CIK_REGEX})`,
            this.getDiscountWithCik
        )

        this.router.put(
            `${this.path}/listener/updateDiscounts`,
            this.bulkCheckDiscountStatusAndUpdate
        )

    }

    private getDiscountWithCik = async (
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const cik = request.params.cik;
            const fetchedDiscount: Discount = await this.discountService.getDiscountWithCik(cik);
            response.status(200).json(fetchedDiscount);
        } catch (err: any) {
            next(new HttpException(err.status, err.message));
        }
    }

    private bulkCheckDiscountStatusAndUpdate = async (
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const statusList: string[] = await this.discountService.bulkCheckDiscountStatusAndUpdate();
            console.log(`Discount service responded with ${statusList} during bulk discount update`);
            response.status(200).json({ statusList: statusList });
        } catch (err: any) {
            next(new HttpException(err.status, err.message));
        }
    }

}

export default DiscountController;
