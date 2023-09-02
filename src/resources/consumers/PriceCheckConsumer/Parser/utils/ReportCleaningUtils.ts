import { SubmissionList, ReportTranslated, ReportRaw } from "sec-edgar-api";
import { Report } from '../Parser.typings';
import parseDataFromRawReports from "./RawReportParsingUtils";

const quarterlyPeriods = ['Q1', 'Q2', 'Q3', 'Q4'];

export default function cleanReports(
    translatedReports: ReportTranslated[],
    submissions: SubmissionList,
    rawReports: ReportRaw[]
): Report[] {

    // Clean data that requires annual reports
    translatedReports = cleanEbitda(translatedReports);
    translatedReports = cleanSharesOutstanding(translatedReports);

    // Filter out non-quarterly reports and correct dates
    let reports: Report[] = cleanReportDates(translatedReports, submissions);
    rawReports = cleanRawReportDates(rawReports, submissions);

    // Clean data using only quarterly reports and translated reports
    reports.forEach(report => {
        report = cleanLiabilityTotal(report);
        report = cleanLiabilityNonCurrent(report);
    });

    // Parse data from raw reports and clean data with translated and raw report values
    reports = parseDataFromRawReports(reports, rawReports);
    reports = cleanShortTermInvestments(reports);
    
    return reports
}

function cleanShortTermInvestments(reports: Report[]): Report[] {
    reports.forEach(report => {
        if (report.investmentsTotal && report.assetNonCurrentInvestments) {
            report.assetCurrentInvestments = report.investmentsTotal - report.assetNonCurrentInvestments;
        }
    })
    return reports;
}

function cleanLiabilityNonCurrent(report: Report): Report {
    if (report.liabilityTotal && report.liabilityCurrent) {
        report.liabilityNonCurrent = report.liabilityTotal - report.liabilityCurrent;
    }
    return report;
}

function cleanLiabilityTotal(report: Report): Report {
    if (report.equityTotal && report.assetTotal) {
        report.liabilityTotal = report.assetTotal - report.equityTotal;
    }
    return report;
}

function cleanReportDates(reports: Report[], submissions: SubmissionList): Report[] {
    const filings = buildQuarterlyFilings(submissions);
    reports = reports.filter(report => quarterlyPeriods.includes(report.fiscalPeriod));
    let i1 = filings.length - 1;
    let i2 = reports.length - 1;
    while (i1 >= 0 && i2 >= 0) {
        reports[i2].dateReport = filings[i1].reportDate;
        reports[i2].acceptedDate = filings[i1].acceptanceDateTime ? filings[i1].acceptanceDateTime : null;
        i1--;
        i2--;
    }
    return reports;
}

function cleanRawReportDates(reports: ReportRaw[], submissions: SubmissionList): ReportRaw[] {
    const filings = buildQuarterlyFilings(submissions);
    reports = reports.filter(report => report.reportType === 'QUARTERLY');
    let i1 = filings.length - 1;
    let i2 = reports.length - 1;
    while (i1 >= 0 && i2 >= 0) {
        reports[i2].dateReport = filings[i1].reportDate;
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