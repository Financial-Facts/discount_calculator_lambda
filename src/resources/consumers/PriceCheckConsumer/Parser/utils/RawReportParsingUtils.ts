import { ReportRaw } from "sec-edgar-api";
import { Report } from "../Parser.typings";

export default function parseDataFromRawReports(reports: Report[], rawReports: ReportRaw[]): Report[] {
    reports.forEach(report => {
        const rawReport = rawReports.find(rawReport => rawReport.dateReport === report.dateReport);
        if (rawReport) {
            report = parseRawForLongTermDebt(report, rawReport);
            report = parseRawForGoodwill(report, rawReport);
            report = parseRawForCommonStock(report, rawReport);
            report = parseRawForLeaseObligations(report, rawReport);
            report = parseRawForTotalInvestments(report, rawReport);
            report = parseRawDeferredIncomeTaxLiabilities(report, rawReport);
            report = parseRawAccumulatedOtherComprehensiveIncomeLoss(report, rawReport);
            report = parseRawForShortTermDebt(report, rawReport);
        }
    })
    return reports;
}

// Missing:
//      Balance Sheet:
//          preferredStock, minorityInterest, othertotalStockholdersEquity, otherLiabilities, otherNonCurrentLiabilities,
//          TaxAssets, deferredRevenueNonCurrent, otherCurrentLiabilities, deferredRevenue, taxPayables,
//          otherAssets, otherNonCurrentAssets, otherCurrentAssets
//      Income Statement:
//          researchAndDevelopmentExpenses, generalAndAdministrativeExpenses, sellingAndMarketingExpenses, otherExpenses,
//          interestIncome, interestExpense, depreciationAndAmortization, ebitda, ebitdaratio, totalOtherIncomeExpensesNet,
//          totalOtherIncomeExpensesNet, incomeBeforeTax, incomeBeforeTaxRatio

function parseRawForShortTermDebt(report: Report, rawReport: ReportRaw): Report {
    if (rawReport.OperatingLeaseLiabilityCurrent && rawReport.DebtCurrent) {
        report.liabilityCurrentDebt = 
            +rawReport.OperatingLeaseLiabilityCurrent + 
            +rawReport.DebtCurrent;
    }
    return report;
}

function parseRawAccumulatedOtherComprehensiveIncomeLoss(report: Report, rawReport: ReportRaw): Report {
    if (rawReport.AccumulatedOtherComprehensiveIncomeLossNetOfTax) {
        report.accumulatedOtherComprehensiveIncomeLoss = +rawReport.AccumulatedOtherComprehensiveIncomeLossNetOfTax;
    }
    return report;
}

function parseRawDeferredIncomeTaxLiabilities(report: Report, rawReport: ReportRaw): Report {
    if (rawReport.DeferredIncomeTaxLiabilitiesNet) {
        report.deferredIncomeTaxLiabilitiesNet = +rawReport.DeferredIncomeTaxLiabilitiesNet;
    }
    return report;
}

function parseRawForLeaseObligations(report: Report, rawReport: ReportRaw): Report {
    if (rawReport.OperatingLeaseLiabilityCurrent && rawReport.OperatingLeaseLiabilityNoncurrent) {
        report.capitalLeaseObligations =
            +rawReport.OperatingLeaseLiabilityCurrent +
            +rawReport.OperatingLeaseLiabilityNoncurrent;
    }
    return report;
}

function parseRawForTotalInvestments(report: Report, rawReport: ReportRaw): Report {
    if (rawReport.EquityMethodInvestments) {
        report.investmentsTotal = +rawReport.EquityMethodInvestments;
    }
    return report;
}
function parseRawForCommonStock(report: Report, rawReport: ReportRaw): Report {
    if (rawReport.CommonStockValue) {
        report.commonStock = +rawReport.CommonStockValue;
    }
    return report;
}

function parseRawForGoodwill(report: Report, rawReport: ReportRaw): Report {
    if (rawReport.Goodwill) {
        report.goodwill = +rawReport.Goodwill;
    }
    return report;
}

function parseRawForLongTermDebt(report: Report, rawReport: ReportRaw): Report {
    if (rawReport.LongTermDebtNoncurrent && rawReport.OperatingLeaseLiabilityNoncurrent) {
        report.liabilityNonCurrentDebt = 
            +(rawReport.LongTermDebtNoncurrent) + 
            +(rawReport.OperatingLeaseLiabilityNoncurrent);
    }
    return report;
}