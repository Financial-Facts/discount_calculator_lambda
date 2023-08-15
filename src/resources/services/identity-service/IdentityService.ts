import HttpException from "@/utils/exceptions/HttpException";
import CONSTANTS from "../../ResourceConstants";
import Identity from "../../entities/identity/Identity";
import { buildHeadersWithBasicAuth } from "../../../utils/serviceUtils";
import IdentitiesAndDiscounts from "../../entities/identity/IdentitiesAndDiscounts";
import BulkIdentitiesRequest from "../../entities/identity/BulkIdentitiesRequest";
import Service from "@/utils/interfaces/IService";
import IdentityService from "./IIdentityService";

let financialFactsServiceFactsV1Url = CONSTANTS.GLOBAL.EMPTY;

const identityService: Service & IdentityService = {

    setUrl: (): void => {
        financialFactsServiceFactsV1Url = process.env.ffs_base_url + CONSTANTS.IDENTITY.V1_ENDPOINT;
    },

    getIdentityWithCik: async (cik: string): Promise<Identity> => {
        const url =  `${financialFactsServiceFactsV1Url}/${cik}`;
        try {
            return fetch(url, { method: 'GET', headers: buildHeadersWithBasicAuth()})
                .then(async (response: Response) => {
                    if (response.status !== 200) {
                        throw new HttpException(response.status,
                            CONSTANTS.IDENTITY.FETCH_ERROR + await response.text())
                    }
                    return response.text();
                }).then((body: string) => {
                    return JSON.parse(body) as Identity;
                });
        } catch (err: any) {
            throw new HttpException(err.status,
                CONSTANTS.IDENTITY.FETCH_ERROR + err.message);
        }
    },

    getBulkIdentitiesAndOptionalDiscounts: async (
        request: BulkIdentitiesRequest,
        includeDiscounts: boolean
    ): Promise<IdentitiesAndDiscounts> => {
        const url = `${financialFactsServiceFactsV1Url}/bulk?includeDiscounts=${includeDiscounts}`;
        try {
            return fetch(url,
                { 
                    method: 'POST',
                    headers: buildHeadersWithBasicAuth(),
                    body: JSON.stringify(request)
                }).then(async (response: Response) => {
                    if (response.status !== 200) {
                        throw new HttpException(response.status,
                            CONSTANTS.IDENTITY.BULK_FETCH_ERROR + await response.text())
                    }
                    return response.json();
                }).then((body: IdentitiesAndDiscounts) => {
                    return body;
                });
        } catch (err: any) {
            throw new HttpException(err.status,
                CONSTANTS.IDENTITY.BULK_FETCH_ERROR);
        }
    },
}

export default identityService;
