import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/IController';
import HttpException from '@/utils/exceptions/HttpException';
import validationMiddleware from '@/middleware/Validation.middleware';
import validation from '@/resources/InputValidation';
import DiscountService from './DiscountService';
import Discount from './IDiscount';
import CONSTANTS from '../ResourceConstants';


class DiscountController implements Controller {

    public path = CONSTANTS.DISCOUNT.V1_ENDPOINT;
    public router = Router();
    private DiscountService = new DiscountService();

    constructor() {
        this.initializeRoute();
    }

    private initializeRoute(): void {
        console.log("Initializing discount routes...");
        this.router.post(
            `${this.path}`,
            validationMiddleware(validation.create_discount),
            this.create
        )

        this.router.put(
            `${this.path}`,
            validationMiddleware(validation.update_discount),
            this.update
        )

        this.router.get(
            `${this.path}/:cik(${CONSTANTS.GLOBAL.CIK_REGEX})`,
            this.get
        )

        this.router.post(
            `${this.path}/:cik(${CONSTANTS.GLOBAL.CIK_REGEX})`,
            this.checkForDiscount
        )
    }

    private create = async (
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const discount: Discount = request.body;
            const createdCik: string = await this.DiscountService.create(discount);

            response.status(201).json({ createdCik });
        } catch (err: any) {
            next(new HttpException(err.status, err.message));
        }
    }

    private update = async (
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const discount: Discount = request.body;
            const updatedDiscount: Discount = await this.DiscountService.update(discount);

            response.status(200).json({ updatedDiscount });
        } catch (err: any) {
            next(new HttpException(err.status, err.message));
        }
    }

    private get = async (
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        const cik = request.params.cik;
        try {
            const fetchedDiscount: Discount = await this.DiscountService.get(cik);
            response.status(200).json(fetchedDiscount);
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
            const checkedDiscount: Discount | null = await this.DiscountService.checkForDiscount(cik);
            response.status(200).json(checkedDiscount);
        } catch (err: any) {
            next(new HttpException(err.status, err.message));
        }
    }

}

export default DiscountController;
