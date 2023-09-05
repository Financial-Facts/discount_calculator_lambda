import HttpException from "@/utils/exceptions/HttpException";
import CONSTANTS from "../ResourceConstants";
import { buildHeadersWithBasicAuth } from "../../utils/serviceUtils";
import IdentitiesAndDiscounts from "../entities/identity/IdentitiesAndDiscounts";
import BulkIdentitiesRequest from "../entities/identity/BulkIdentitiesRequest";


class IdentityService {

    private financialFactsServiceIdentityV1Url: string;

    constructor(ffs_base_url: string) {
        this.financialFactsServiceIdentityV1Url = ffs_base_url + CONSTANTS.IDENTITY.V1_ENDPOINT;
    }

    public async getBulkIdentitiesAndOptionalDiscounts(
        request: BulkIdentitiesRequest,
        includeDiscounts: boolean
    ): Promise<IdentitiesAndDiscounts> {
        const url = `${this.financialFactsServiceIdentityV1Url}/bulk?includeDiscounts=${includeDiscounts}`;
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
