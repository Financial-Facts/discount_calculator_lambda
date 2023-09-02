import Statements from "@/resources/entities/statements/statements";
import { secEdgarApi } from 'sec-edgar-api'
import { Report } from './Parser.typings';
import cleanReports from './utils/ReportCleaningUtils';
import { buildIncomeStatements, buildBalanceSheets } from "./utils/StatementBuildingUtils";


export default async function getLatestStatements(cik: string): Promise<Statements> {
    const params = { symbol: cik };
    return Promise.all([
        secEdgarApi.getReports(params),
        secEdgarApi.getSubmissions(params),
        secEdgarApi.getReportsRaw(params) 
    ]).then(data => {
        
        const [ translatedReports, submissions, rawReports ] = data;
        let reports: Report[] = cleanReports(translatedReports, submissions, rawReports);
        const symbol = submissions.tickers[0];
        return {
            incomeStatements: buildIncomeStatements(cik, symbol, reports),
            balanceSheets: buildBalanceSheets(cik, symbol, reports)
        }
    });
}
