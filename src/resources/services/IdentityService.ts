import HttpException from "@/utils/exceptions/HttpException";
import CONSTANTS from "../ResourceConstants";
import Identity from "../entities/identity/Identity";
import { buildHeadersWithBasicAuth } from "../../utils/serviceUtils";
import IdentitiesAndDiscounts from "../entities/identity/IdentitiesAndDiscounts";
import BulkIdentitiesRequest from "../entities/identity/BulkIdentitiesRequest";


class IdentityService {

    private ffsIdentityUrl: string;

    constructor() {
        this.ffsIdentityUrl = process.env.ffs_base_url + CONSTANTS.IDENTITY.V1_ENDPOINT
    }

    public async getIdentityWithCik(cik: string): Promise<Identity> {
        const url =  `${this.ffsIdentityUrl}/${cik}`;
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
    }

    public async getBulkIdentitiesAndOptionalDiscounts(
        request: BulkIdentitiesRequest,
        includeDiscounts: boolean
    ): Promise<IdentitiesAndDiscounts> {
        const url = `${this.ffsIdentityUrl}/bulk?includeDiscounts=${includeDiscounts}`;
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
    }
}

export default IdentityService;