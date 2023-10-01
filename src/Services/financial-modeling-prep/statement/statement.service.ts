import HttpException from "@/utils/exceptions/HttpException";
import { BalanceSheet, CashFlowStatement, IncomeStatement, Statements } from "./statement.typings";
import { cleanStatements } from "./statement.utils";
import { buildURI } from "../fmp-service.utils";

class StatementService {

    private fmp_base_url;
    private apiKey;
    
    constructor(fmp_base_url: string, apiKey: string) {
        this.fmp_base_url = fmp_base_url;
        this.apiKey = apiKey;
    }

    // Fetch financial statements for a company
    public async getStatements(cik: string): Promise<Statements> {
        console.log(`In statement service gettings sticker price data for ${cik}`);
        return Promise.all([
            this.getIncomeStatements(cik),
            this.getBalanceSheets(cik),
            this.getCashFlowStatements(cik)
        ]).then(statements => {
            const [ incomeStatements, balanceSheets, cashFlowStatements ] = statements;
            return {
                incomeStatements: incomeStatements,
                balanceSheets: balanceSheets,
                cashFlowStatements: cashFlowStatements
            }
        });
    }

    private async getBalanceSheets(cik: string): Promise<BalanceSheet[]> {
        console.log(`In statement service getting balance sheets for ${cik}`);
        try {
            const url = this.fmp_base_url + buildURI(cik, 'balance-sheet-statement', this.apiKey);
            return fetch(url)
                .then(async (response: Response) => {
                    if (response.status !== 200) {
                        const text = await response.text();
                        throw new HttpException(response.status,
                            `Error occurred while getting balance sheets for ${cik}: ${text}`);
                    }
                    return response.json();
                }).then((body: BalanceSheet[]) => {
                    return cleanStatements(cik, body);
                });
        } catch (err: any) {
            throw new HttpException(err.status,
                `Error occurred while getting balance sheets for ${cik}: ${err.message}`)
        }
    }

    private async getIncomeStatements(cik: string): Promise<IncomeStatement[]> {
        console.log(`In statement service getting income statements for ${cik}`);
        try {
            const url = this.fmp_base_url + buildURI(cik, 'income-statement', this.apiKey);
            return fetch(url)
                .then(async (response: Response) => {
                    if (response.status !== 200) {
                        const text = await response.text();
                        throw new HttpException(response.status,
                            `Error occurred while getting income statements for ${cik}: ${text}`);
                    }
                    return response.json();
                }).then((body: IncomeStatement[]) => {
                    return cleanStatements(cik, body);
                });
        } catch (err: any) {
            throw new HttpException(err.status,
                `Error occurred while getting income statements for ${cik}: ${err.message}`)
        }
    }

    private async getCashFlowStatements(cik: string): Promise<CashFlowStatement[]> {
        console.log(`In statement service getting cash flow statements for ${cik}`);
        try {
            const url = this.fmp_base_url + buildURI(cik, 'cash-flow-statement', this.apiKey);
            return fetch(url)
                .then(async (response: Response) => {
                    if (response.status !== 200) {
                        const text = await response.text();
                        throw new HttpException(response.status,
                            `Error occurred while getting cash flow statements for ${cik}: ${text}`);
                    }
                    return response.json();
                }).then((body: CashFlowStatement[]) => {
                    return cleanStatements(cik, body);
                });
        } catch (err: any) {
            throw new HttpException(err.status,
                `Error occurred while getting cash flow statements for ${cik}: ${err.message}`)
        }
    }
}

export default StatementService;
