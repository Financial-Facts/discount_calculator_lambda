import Controller from "@/utils/interfaces/IController";
import { Router, Request, Response, NextFunction } from 'express';
import CONSTANTS from "../ResourceConstants";
import IdentityService from "../services/IdentityService";
import DataSource from "datasource";
import HttpException from "@/utils/exceptions/HttpException";
import IdentitiesAndDiscounts from "../entities/identity/IdentitiesAndDiscounts";
import BulkIdentitiesRequest from "../entities/identity/BulkIdentitiesRequest";
import InvalidRequestException from "@/utils/exceptions/InvalidRequestException";

class IdentityController implements Controller {

    path = CONSTANTS.IDENTITY.V1_ENDPOINT;
    router = Router();
    identityService: IdentityService;

    constructor(dataSource: DataSource) {
        this.identityService = dataSource.identityService;
        this.initalizeRoutes();
    }

    private initalizeRoutes(): void {
        console.log("Initializing identity routes...");

        this.router.post(
            `${this.path}/bulk`,
            this.getBulkIdentitiesAndOptionalDiscounts
        )
    }

    private getBulkIdentitiesAndOptionalDiscounts = async (
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const identitiesRequest: BulkIdentitiesRequest = request.body;
            this.validateIdentitiesRequest(identitiesRequest);
            let includeDiscounts = false;
            const includeDiscountsParam = request.query.includeDiscounts ?? false;
            if (typeof(includeDiscountsParam) === 'string') {
                includeDiscounts = includeDiscountsParam.toLowerCase() === 'true';
            }
            const data: IdentitiesAndDiscounts =
                await this.identityService.getBulkIdentitiesAndOptionalDiscounts(identitiesRequest, includeDiscounts);
            response.status(200).json(data);
        } catch (err: any) {
            next(new HttpException(err.status, err.message));
        }
    }

    private validateIdentitiesRequest(identitiesRequest: BulkIdentitiesRequest): void {
        if (!identitiesRequest ||
            !identitiesRequest.limit ||
            !identitiesRequest.sortBy ||
            !identitiesRequest.order) {
            throw new InvalidRequestException('Invalid bulk identities request provided');
        }
        if (identitiesRequest.limit > 100) {
            identitiesRequest.limit = 100;
        }
    }
}

export default IdentityController;