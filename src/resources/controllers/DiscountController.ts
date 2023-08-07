import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/IController';
import HttpException from '@/utils/exceptions/HttpException';
import DiscountService from '../services/DiscountService';
import Discount from '../entities/discount/IDiscount';
import CONSTANTS from '../ResourceConstants';
import DataSource from 'datasource';

class DiscountController implements Controller {

    path = CONSTANTS.LISTENER.V1_ENDPOINT;
    router = Router();
    discountService: DiscountService;

    constructor(dataSource: DataSource) {
        this.discountService = dataSource.discountService;
        this.initializeRoute();
    }

    private initializeRoute(): void {
        console.log("Initializing discount routes...");

        this.router.get(
            `${this.path}/:cik(${CONSTANTS.GLOBAL.CIK_REGEX})`,
            this.getDiscountWithCik
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
}

export default DiscountController;
