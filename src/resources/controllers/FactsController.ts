import CONSTANTS from "../ResourceConstants";
import { Router, Request, Response, NextFunction } from 'express';
import HttpException from "@/utils/exceptions/HttpException";
import Controller from "@/utils/interfaces/IController";
import FactsService from "../services/FactsService";


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
    }

    private get = async (
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        const cik = request.params.cik;
        try {
            const facts: any = await this.FactsService.getFacts(cik);
            response.status(200).json(facts);
        } catch (err: any) {
            next(new HttpException(err.status, err.message));
        }
    }
}

export default FactsController;