import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/IController';
import HttpException from '@/utils/exceptions/HttpException';
import DiscountService from '../services/DiscountService';
import Discount from '../entities/discount/IDiscount';
import CONSTANTS from '../ResourceConstants';
import DisqualifyingDataException from '../../exceptions/DisqualifyingDataException';

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
            `${this.path}`,
            this.bulkUpdateDiscountStatus
        )

        this.router.post(
            `${this.path}/:cik(${CONSTANTS.GLOBAL.CIK_REGEX})`,
            this.checkForDiscount
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

    private bulkUpdateDiscountStatus = async (
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const statusList: string[] = await this.discountService.bulkUpdateDiscountStatus();
            console.log(`Discount service responded with ${statusList} during bulk discount update`);
            response.status(200).json({ statusList: statusList });
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
            const hasActiveDiscount: boolean = await this.discountService.checkForDiscount(cik);
            if (hasActiveDiscount) {
                response.status(200).json({ active: hasActiveDiscount, message: `${cik} is on sale`});
            } else {
                response.status(200).json({ active: hasActiveDiscount, message: `${cik} is not on sale`});
            }
        } catch (err: any) {
            if (err instanceof DisqualifyingDataException) {
                this.discountService.delete(cik)
                    .then(() => {
                        console.log(`Discount for ${cik} has been deleted due to: ${err.message}`);
                    }).catch((deleteEx: HttpException) => {
                        if (deleteEx.status !== 404) {
                            console.log(`Deleting discount for ${cik} failed due to: ${deleteEx.message}`);
                        } else {
                            console.log(`Discount for ${cik} does not exist`);
                        }
                    });
            }
            next(new HttpException(err.status, err.message));
        }
    }

}

export default DiscountController;
