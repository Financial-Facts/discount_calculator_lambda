import InsufficientDataException from "@/utils/exceptions/InsufficientDataException";
import { Statement, Statements } from "@/services/financial-modeling-prep/statement/statement.typings";
import { days_between } from "@/utils/date.utils";
import DataNotUpdatedException from "@/utils/exceptions/DataNotUpdatedException";
import { BenchmarkRatioPrice } from "@/services/benchmark/benchmark.typings";
import { Discount } from "@/services/discount/ffs-discount/discount.typings";
import { DiscountedCashFlowPrice } from "@/services/financial-modeling-prep/discounted-cash-flow/discounted-cash-flow.typings";
import { CompanyProfile } from "@/services/financial-modeling-prep/profile/profile.typings";
import { StickerPrice } from "@/services/sticker-price/sticker-price.typings";
import { QuarterlyData } from "./discount-manager.typings";
import { PeriodicData } from "@/src/types";


export function validateStatements(cik: string, data: Statements, checkUpdated: boolean): void {
    checkHasSufficientStatements(cik, data);
    if (checkUpdated) {
        checkStatementsHaveBeenUpdated(cik, data);
    }
}

function checkHasSufficientStatements(cik: string, data: Statements): void {
    if (data.incomeStatements.length !== 44 ||
        data.balanceSheets.length !== 44 ||
        data.cashFlowStatements.length !== 44) {
        throw new InsufficientDataException(`${cik} has insufficent statements available`);
    }
}

function checkStatementsHaveBeenUpdated(cik: string, data: Statements): void {
    if (!isUpToDate(data.balanceSheets) ||
        !isUpToDate(data.incomeStatements) ||
        !isUpToDate(data.cashFlowStatements)) {
        throw new DataNotUpdatedException(`Data for ${cik} has not yet been updated!`);
    }
}

function isUpToDate<T extends Statement>(statements: T[]): boolean {
    const lastReportedData: Date = new Date(statements.slice(-1)[0].fillingDate);
    return days_between(lastReportedData, new Date()) <= 16;
}

function replaceEmptyValuesWithMostRecent(periodicData: PeriodicData[]): PeriodicData[] {
    periodicData.forEach((period, index) => {
        if (period.value === 0) {
            let i = index;
            while (period.value === 0 && i > 0) {
                i--;
                period.value = periodicData[i].value;
            }
        }
    });
    return periodicData;
}


export const buildDiscount = (
    cik: string,
    profile: CompanyProfile,
    stickerPrice: StickerPrice,
    benchmarkRatioPrice: BenchmarkRatioPrice,
    discountedCashFlowPrice: DiscountedCashFlowPrice
): Discount => ({
    cik: cik,
    symbol: profile.symbol,
    name: profile.companyName,
    active: false,
    marketPrice: 0,
    lastUpdated: new Date(),
    stickerPrice,
    benchmarkRatioPrice,
    discountedCashFlowPrice
})

export const buildQuarterlyData = (statements: Statements): QuarterlyData => ({
    quarterlyShareholderEquity: statements.balanceSheets.map(sheets => ({
        cik: sheets.cik,
        announcedDate: sheets.date,
        period: sheets.period,
        value: sheets.totalStockholdersEquity
    })),
    quarterlyOutstandingShares: replaceEmptyValuesWithMostRecent(
        statements.incomeStatements.map(sheets => ({
            cik: sheets.cik,
            announcedDate: sheets.date,
            period: sheets.period,
            value: sheets.weightedAverageShsOut
    }))),
    quarterlyEPS: statements.incomeStatements.map(sheets => ({
        cik: sheets.cik,
        announcedDate: sheets.date,
        period: sheets.period,
        value: sheets.eps
    })),
    quarterlyOperatingIncome: statements.incomeStatements.map(sheets => ({
        cik: sheets.cik,
        announcedDate: sheets.date,
        period: sheets.period,
        value: sheets.operatingIncome
    })),
    quarterlyTaxExpense: statements.incomeStatements.map(sheets => ({
        cik: sheets.cik,
        announcedDate: sheets.date,
        period: sheets.period,
        value: sheets.incomeTaxExpense
    })),
    quarterlyNetDebt: statements.balanceSheets.map(sheets => ({
        cik: sheets.cik,
        announcedDate: sheets.date,
        period: sheets.period,
        value: sheets.netDebt
    })),
    quarterlyTotalEquity: statements.balanceSheets.map(sheets => ({
        cik: sheets.cik,
        announcedDate: sheets.date,
        period: sheets.period,
        value: sheets.totalEquity
    })),
    quarterlyRevenue: statements.incomeStatements.map(sheets => ({
        cik: sheets.cik,
        announcedDate: sheets.date,
        period: sheets.period,
        value: sheets.revenue
    })),
    quarterlyOperatingCashFlow: statements.cashFlowStatements.map(sheets => ({
        cik: sheets.cik,
        announcedDate: sheets.date,
        period: sheets.period,
        value: sheets.operatingCashFlow
    })),
    quarterlyFreeCashFlow: statements.cashFlowStatements.map(sheets => ({
        cik: sheets.cik,
        announcedDate: sheets.date,
        period: sheets.period,
        value: sheets.freeCashFlow
    })),
    quarterlyLongTermDebt: statements.balanceSheets.map(sheets => ({
        cik: sheets.cik,
        announcedDate: sheets.date,
        period: sheets.period,
        value: sheets.longTermDebt
    })),
    quarterlyCapitalExpenditure: statements.cashFlowStatements.map(sheets => ({
        cik: sheets.cik,
        announcedDate: sheets.date,
        period: sheets.period,
        value: sheets.capitalExpenditure
    }))
});

