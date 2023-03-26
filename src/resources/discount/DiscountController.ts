import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/IController';
import HttpException from '@/utils/exceptions/HttpException';
import validationMiddleware from '@/middleware/Validation.middleware';
import validation from '@/resources/discount/DiscountValidation';
import DiscountService from './DiscountService';
import Discount from './IDiscount';


class DiscountController implements Controller {

    public path = '/v1/discount';
    public router = Router();
    private DiscountService = new DiscountService();
    constructor() {
        this.initializeRoute();
    }

    private initializeRoute(): void {
        console.log("Initializing routes");
        this.router.post(
            `${this.path}`,
            validationMiddleware(validation.create),
            this.create
        )

        this.router.put(
            `${this.path}`,
            validationMiddleware(validation.create),
            this.update
        )

        this.router.get(
            `${this.path}/:cik(CIK[0-9]{10})`,
            this.get
        )
    }

    private create = async (
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const discount = request.body;
            const createdCik = await this.DiscountService.create(discount);

            response.status(201).json({ createdCik });
        } catch (err: any) {
            next(new HttpException(400, err.message));
        }
    }

    private update = async (
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const discount = request.body;
            const updatedDiscount = await this.DiscountService.update(discount);

            response.status(200).json({ updatedDiscount });
        } catch (err) {
            next(new HttpException(400, 'Cannot update discount'));
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
            response.status(200).json({ fetchedDiscount });
        } catch (err: any) {
            next(new HttpException(400, `Cannot fetch discount ${cik}: ${err.message}`));
        }
    }

}

export default DiscountController;
