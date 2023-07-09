import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/IController';
import HttpException from '@/utils/exceptions/HttpException';
import validationMiddleware from '@/middleware/Validation.middleware';
import validation from '@/resources/InputValidation';
import DiscountService from '../services/DiscountService';
import Discount from '../entities/discount/IDiscount';
import CONSTANTS from '../ResourceConstants';
import fetch from 'node-fetch';

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
            `${this.path}/bulk`,
            this.getBulk
        )

        this.router.post(
            `${this.path}/:cik(${CONSTANTS.GLOBAL.CIK_REGEX})`,
            this.checkForDiscount
        )
    }

    private getBulk = async (
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const fetchedDiscounts: Discount[] = await this.discountService.getBulk();
            response.status(200).json(fetchedDiscounts);
        } catch (err: any) {
            next(new HttpException(err.status, err.message));
        }
    }

    private checkForDiscount = async (
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        const cik = request.params.cik;
        try {
            const checkedDiscount: Discount | null = await this.discountService.checkForDiscount(cik);
            if (checkedDiscount) {
                response.status(200).json(checkedDiscount);
            } else {
                response.status(200).json({ message: `${cik} is not on sale`});
            }
        } catch (err: any) {
            next(new HttpException(err.status, err.message));
        }
    }

}

export default DiscountController;
