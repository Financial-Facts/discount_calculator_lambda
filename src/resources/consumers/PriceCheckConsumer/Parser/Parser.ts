import BalanceSheet from "@/resources/entities/statements/balance-sheet";
import IncomeStatement from "@/resources/entities/statements/income-statement";
import Statements from "@/resources/entities/statements/statements";
import { ReportTranslated, SubmissionList, secEdgarApi } from 'sec-edgar-api'
import { Report } from "./models/Report";

const quarterlyPeriods = ['Q1', 'Q2', 'Q3', 'Q4'];

checkForNewFiling('0000001750').then(val => {
    console.log(val);
})

async function checkForNewFiling(cik: string): Promise<Statements> {
    return secEdgarApi.getReports({
        symbol: cik
    }).then(async translatedReports => 
        secEdgarApi.getSubmissions({
            symbol: cik
        })
    .then(submissions => {
        let reports: Report[] = cleanReports(translatedReports, submissions);
        const symbol = submissions.tickers[0];
        return {
            incomeStatements: buildIncomeStatements(cik, symbol, reports),
            balanceSheets: buildBalanceSheets(cik, symbol, reports)
        }
    }));
}

function buildQuarterlyFilings(submissions: SubmissionList): any[] {
    const recentFilings = submissions.filings.recent;
    return recentFilings.acceptanceDateTime.map((val, index) => {
        return {
            acceptanceDateTime: recentFilings.acceptanceDateTime[index],
            form: recentFilings.form[index],
            reportDate: recentFilings.reportDate[index]
        }
    }).filter(filing => filing.form === '10-Q' || filing.form === '10-K')
    .reverse();
}

function buildBalanceSheets(cik: string, symbol: string, reports: Report[]): BalanceSheet[] {
    reports
        .map(report => {
            return {

            }
        })
    return [];
}

function buildIncomeStatements(cik: string, symbol: string, reports: Report[]): IncomeStatement[] {
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
                acceptedDate: report.acceptedDate || null,
                calendarYear: report.dateReport.slice(0, 4),
                period: report.fiscalPeriod,
                revenue: report.revenueTotal,
                costOfRevenue: report.revenueCost,
                grossProfit: report.profitGross,
                grossProfitRatio: twoVariableOperation(report.profitGross, report.revenueTotal, (a, b) => a / b),
                researchAndDevelopmentExpenses: report.expenseResearchDevelopment,
                generalAndAdministrativeExpenses: null,
                sellingAndMarketingExpenses: null,
                sellingGeneralAndAdministrativeExpenses: twoVariableOperation(report.profitGross, report.incomeOperating, (a, b) => Math.abs(a - Math.abs(b))),
                otherExpenses: report.expenseNonCashOther,
                operatingExpenses: report.expenseOperating,
                costAndExpenses: report.expenseTotal,
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

function cleanReports(reports: Report[], submissions: SubmissionList): ReportTranslated[] {
    reports = cleanEbitda(reports);
    reports = cleanSharesOutstanding(reports);
    reports = cleanReportDates(reports, submissions);
    return reports
}

function cleanReportDates(reports: Report[], submissions: SubmissionList): ReportTranslated[] {
    const filings = buildQuarterlyFilings(submissions);
    reports = reports.filter(report => quarterlyPeriods.includes(report.fiscalPeriod));
    let i1 = filings.length - 1;
    let i2 = reports.length - 1;
    while (i1 >= 0 && i2 >= 0) {
        reports[i2].dateReport = filings[i1].reportDate;
        reports[i2].acceptedDate = filings[i1].acceptanceDateTime ? new Date(filings[i1].acceptanceDateTime) : null;
        i1--;
        i2--;
    }
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

function cleanEbitda(reports: ReportTranslated[]): ReportTranslated[] {
    reports.forEach(report => {
        if (report.ebit && report.expenseDepreciation) {
            report.ebitda = report.ebit + report.expenseDepreciation;
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