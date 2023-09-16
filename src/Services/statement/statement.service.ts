import CONSTANTS from "@/resources/resource.contants";
import HttpException from "@/utils/exceptions/HttpException";
import { Statements } from "./statement.typings";
import { buildHeadersWithBasicAuth } from "../discount/discount.utils";

class StatementService {

    private financialFactsServiceStatementV1Url: string;
    
    constructor(ffs_base_url: string) {
        this.financialFactsServiceStatementV1Url = ffs_base_url + CONSTANTS.STATEMENTS.V1_ENDPOINT;
    }

    // Fetch sticker price data for a company
    public async getStatements(cik: string): Promise<Statements> {
        console.log("In statement service gettings sticker price data for cik: " + cik);
        try {
            const url = `${this.financialFactsServiceStatementV1Url}/${cik}`;
            return fetch(url, { method: 'GET', headers: buildHeadersWithBasicAuth()})
                .then(async (response: Response) => {
                    if (response.status !== 200) {
                        const text = await response.text();
                        throw new HttpException(response.status, CONSTANTS.STATEMENTS.FETCH_ERROR + text);
                    }
                    return response.json();
                }).then((body: Statements) => {
                    return body;
                });
        } catch (err: any) {
            throw new HttpException(err.status, CONSTANTS.STATEMENTS.FETCH_ERROR + err.message);
        }
    }
}

export default StatementService;