import HttpException from "@/utils/exceptions/HttpException";
import CONSTANTS from "../ResourceConstants";
import Identity from "../entities/Identity";
import { buildHeadersWithBasicAuth } from "../../utils/serviceUtils";


class IdentityService {

    private ffsIdentityUrl: string;

    constructor() {
        this.ffsIdentityUrl = 
            process.env.FINANCIAL_FACTS_SERVICE_BASE_URL +
            CONSTANTS.IDENTITY.V1_ENDPOINT
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
}

export default IdentityService;