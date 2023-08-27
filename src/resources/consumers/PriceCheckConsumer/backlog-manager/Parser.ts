import BalanceSheet from "@/resources/entities/statements/balance-sheet";
import IncomeStatement from "@/resources/entities/statements/income-statement";
import Statements from "@/resources/entities/statements/statements";
import { ReportTranslated, secEdgarApi } from 'sec-edgar-api'

const periods = ['Q1', 'Q2', 'Q3', 'Q4'];

checkForNewFiling('0000001750').then(val => {
    // console.log(val);
})

async function checkForNewFiling(cik: string): Promise<Statements> {
    return secEdgarApi.getReports({
        symbol: cik
    }).then(reports => {
        return secEdgarApi.getSubmissions({
            symbol: cik
        }).then(submissions => {
            const cleanedReports = cleanReports(reports);
            const quarterlyReports = cleanedReports.filter(report => periods.includes(report.fiscalPeriod));
            const symbol = submissions.tickers[0];
            // console.log(quarterlyReports);
            return {
                incomeStatements: buildIncomeStatements(cik, symbol, quarterlyReports),
                balanceSheets: buildBalanceSheets(cik, symbol, quarterlyReports)
            }
        })
    });
}

function buildBalanceSheets(cik: string, symbol: string, reports: ReportTranslated[]): BalanceSheet[] {
    return [];
}

function buildIncomeStatements(cik: string, symbol: string, reports: ReportTranslated[]): IncomeStatement[] {
    return reports
        .filter(report => 
            report.dateReport && report.eps && report.incomeNet && report.sharesOutstanding)
        .map(report => {
            return {
                cik: 'CIK' + cik,
                date: new Date(report.dateReport),
                symbol: symbol,
                reportedCurrency: null,
                fillingDate: new Date(report.dateFiled),
                acceptedDate: null,
                calendarYear: report.dateReport.slice(0, 4),
                period: report.fiscalPeriod,
                revenue: report.revenueTotal,
                costOfRevenue: report.revenueCost,
                grossProfit: report.profitGross,
                grossProfitRatio: twoVariableOperation(report.profitGross, report.revenueTotal, (a, b) => a / b),
                researchAndDevelopmentExpenses: report.expenseResearchDevelopment,
                generalAndAdministrativeExpenses: null,
                sellingAndMarketingExpenses: null,
                sellingGeneralAndAdministrativeExpenses: null,
                otherExpenses: report.expenseNonCashOther,
                operatingExpenses: report.expenseOperating,
                costAndExpenses: null,
                interestIncome: null,
                interestExpense: report.expenseInterest,
                depreciationAndAmortization: report.expenseDepreciation,
                ebitda: report.ebitda,
                ebitdaratio: twoVariableOperation(report.ebitda, report.revenueTotal, (a, b) => a / b),
                operatingIncome: report.incomeOperating,
                operatingIncomeRatio: twoVariableOperation(report.incomeOperating, report.revenueTotal, (a, b) => a / b),
                totalOtherIncomeExpensesNet: null,
                incomeBeforeTax: twoVariableOperation(report.ebit, report.expenseInterest, (a, b) => a - b),
                incomeBeforeTaxRatio: threeVariableOperation(report.ebit, report.expenseInterest, report.revenueTotal, (a, b, c) => (a - b) / c),
                incomeTaxExpense: report.expenseTax,
                netIncome: report.incomeNet || 0,
                netIncomeRatio: twoVariableOperation(report.incomeNet, report.revenueTotal, (a,b ) => a / b),
                eps: report.eps || 0,
                epsdiluted: report.epsDiluted,
                weightedAverageShsOut: report.sharesOutstanding || 0,
                weightedAverageShsOutDil: report.sharesOutstandingDiluted,
                link: null,
                finalLink: null
            }
    });
}

function cleanReports(reports: ReportTranslated[]): ReportTranslated[] {
    reports = cleanRevenueOperating(reports);
    reports = cleanSharesOutstanding(reports);
    return reports;
}

function cleanSharesOutstanding(reports: ReportTranslated[]): ReportTranslated[] {
    reports.forEach((report, index) => {
        if (report.fiscalPeriod === 'Q4' && !report.sharesOutstanding && index + 1 < reports.length) {
            const hasAlt = reports[index + 1].fiscalPeriod === 'FY' && reports[index + 1].sharesOutstanding;
            const hasAltDiluted = reports[index + 1].fiscalPeriod === 'FY' && reports[index + 1].sharesOutstandingDiluted;
            if (hasAlt) {
                report.sharesOutstanding = reports[index + 1].sharesOutstanding;
            }
            if (hasAltDiluted) {
                report.sharesOutstandingDiluted= reports[index + 1].sharesOutstandingDiluted;
            }
        }
    });
    return reports;
}

function cleanRevenueOperating(reports: ReportTranslated[]): ReportTranslated[] {
    reports.forEach(report => {
        if (report.incomeNet && report.expenseInterest && report.expenseTax) {
            console.log(report.incomeNet + report.expenseInterest + report.expenseTax);
        }
        if (report.profitGross && report.expenseOperating && report.expenseDepreciation) {
            console.log(report.profitGross - report.expenseOperating - report.expenseDepreciation);
        }
    })
    return reports;
}

function twoVariableOperation(
    a: number | null,
    b: number | null,
    equation: ((a: number, input2: number) => number)
): number | null {
    if (a && b) {
        return equation(a, b);
    }
    return null;
}

function threeVariableOperation(
    a: number | null,
    b: number | null,
    c: number | null,
    equation: ((a: number, b: number, c: number) => number)
): number | null {
    if (a && b && c) {
        return equation(a, b, c);
    }
    return null;
}