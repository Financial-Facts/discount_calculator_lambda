import CONSTANTS from "../ResourceConstants";
import { Router, Request, Response, NextFunction } from 'express';
import HttpException from "@/utils/exceptions/HttpException";
import Controller from "@/utils/interfaces/IController";
import FactsService from "./FactsService";
import validationMiddleware from "@/middleware/Validation.middleware";
import validation from '@/resources/InputValidation';


class FactsController implements Controller {

    public path = CONSTANTS.FACTS.V1_ENDPOINT;
    public router = Router();
    private FactsService = new FactsService();

    constructor() {
        this.initializeRoute();
    }

    private initializeRoute(): void {
        console.log("Initializing facts routes...");
        this.router.get(
            `${this.path}/:cik(${CONSTANTS.GLOBAL.CIK_REGEX})`,
            this.get
        )
        this.router.post(
            `${this.path}/:cik(${CONSTANTS.GLOBAL.CIK_REGEX})`,
            validationMiddleware(validation.check_for_discounts),
            this.checkForDiscount
        )
    }

    private get = async (
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        const cik = request.params.cik;
        try {
            const facts: any = await this.FactsService.get(cik);
            response.status(200).json(facts);
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
        const providedFacts: any = request.body;
        
        try {
            const status = await this.FactsService.checkForDiscount(cik, providedFacts);
            response.status(200).json(status);
        } catch (err: any) {
            next(new HttpException(err.status, err.message));
        }
    }
}

export default FactsController;