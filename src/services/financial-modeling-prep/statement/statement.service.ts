import HttpException from "@/utils/exceptions/HttpException";
import { BalanceSheet, CashFlowStatement, IncomeStatement, Statements } from "./statement.typings";
import { cleanStatements } from "./statement.utils";

class StatementService {

    private fmp_base_url;
    private apiKey;
    
    constructor(fmp_base_url: string, apiKey: string) {
        this.fmp_base_url = fmp_base_url;
        this.apiKey = apiKey;
    }

    // Fetch financial statements for a company
    public async getCleanStatements(cik: string, symbol: string): Promise<Statements> {
        console.log(`In statement service gettings sticker price data for ${cik}`);
        return Promise.all([
            this.getIncomeStatements(symbol),
            this.getBalanceSheets(symbol),
            this.getCashFlowStatements(symbol)
        ]).then(statements => {
            const [ incomeStatements, balanceSheets, cashFlowStatements ] = statements;
            return {
                incomeStatements: cleanStatements(cik, symbol, incomeStatements),
                balanceSheets: cleanStatements(cik, symbol, balanceSheets),
                cashFlowStatements: cleanStatements(cik, symbol, cashFlowStatements)
            }
        });
    }

    private async getBalanceSheets(symbol: string): Promise<BalanceSheet[]> {
        console.log(`In statement service getting balance sheets for ${symbol}`);
        try {
            const url = this.fmp_base_url +
                `/stable/balance-sheet-statement?symbol=${symbol}&apikey=${this.apiKey}&period=quarter&limit=44`;
            return fetch(url)
                .then(async (response: Response) => {
                    if (response.status !== 200) {
                        const text = await response.text();
                        throw new HttpException(response.status,
                            `Error occurred while getting balance sheets for ${symbol}: ${text}`);
                    }
                    return response.json();
                }).then((body: BalanceSheet[]) => {
                    return body;
                });
        } catch (err: any) {
            throw new HttpException(
                err.status,
                `Error occurred while getting balance sheets for ${symbol}: ${err.message}`
            );
        }
    }

    private async getIncomeStatements(symbol: string): Promise<IncomeStatement[]> {
        console.log(`In statement service getting income statements for ${symbol}`);
        try {
            const url = this.fmp_base_url +
                `/stable/income-statement?symbol=${symbol}&apikey=${this.apiKey}&period=quarter&limit=44`;
            return fetch(url)
                .then(async (response: Response) => {
                    if (response.status !== 200) {
                        const text = await response.text();
                        throw new HttpException(response.status,
                            `Error occurred while getting income statements for ${symbol}: ${text}`);
                    }
                    return response.json();
                }).then((body: IncomeStatement[]) => {
                    return body;
                });
        } catch (err: any) {
            throw new HttpException(
                err.status,
                `Error occurred while getting income statements for ${symbol}: ${err.message}`
            );
        }
    }

    private async getCashFlowStatements(symbol: string): Promise<CashFlowStatement[]> {
        console.log(`In statement service getting cash flow statements for ${symbol}`);
        try {
            const url = this.fmp_base_url +
                `/stable/cash-flow-statement?symbol=${symbol}&apikey=${this.apiKey}&period=quarter&limit=44`;
            return fetch(url)
                .then(async (response: Response) => {
                    if (response.status !== 200) {
                        const text = await response.text();
                        throw new HttpException(response.status,
                            `Error occurred while getting cash flow statements for ${symbol}: ${text}`);
                    }
                    return response.json();
                }).then((body: CashFlowStatement[]) => {
                    return body;
                });
        } catch (err: any) {
            throw new HttpException(
                err.status,
                `Error occurred while getting cash flow statements for ${symbol}: ${err.message}`
            );
        }
    }
}

export default StatementService;
