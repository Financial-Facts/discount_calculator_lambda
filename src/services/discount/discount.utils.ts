import CONSTANTS from "@/resources/resource.contants";
import { CompanyProfile } from "../financial-modeling-prep/profile/profile.typings";
import { Statements } from "../financial-modeling-prep/statement/statement.typings";
import { StickerPrice, StickerPriceInput } from "../sticker-price/sticker-price.typings";
import { Discount } from "./discount.typings";
import { calculatorService } from "../../bootstrap";
import { BenchmarkRatioPrice } from "../benchmark/benchmark.typings";
import { QuarterlyData } from "@/resources/discount-manager/discount-manager.typings";
import { annualizeByAdd, annualizeByLastQuarter } from "@/resources/discount-manager/discount-manager.utils";
import { DiscountedCashFlowPrice } from "../financial-modeling-prep/discounted-cash-flow/discounted-cash-flow.typings";


export function buildHeadersWithBasicAuth(): { Authorization: string, 'Content-Type': string } {
    return {
        Authorization: process.env.ffs_auth as string,
        'Content-Type': CONSTANTS.GLOBAL.JSON
    }
}

export const buildDiscount = (
    cik: string,
    profile: CompanyProfile,
    stickerPrice: StickerPrice,
    benchmarkRatioPrice: BenchmarkRatioPrice,
    discountCashFlowPrice: DiscountedCashFlowPrice
): Discount => ({
    cik: cik,
    symbol: profile.symbol,
    name: profile.companyName,
    active: false,
    lastUpdated: new Date(),
    stickerPrice,
    benchmarkRatioPrice,
    discountCashFlowPrice
})

export const buildQuarterlyData = (statements: Statements): QuarterlyData => ({
    quarterlyShareholderEquity: statements.balanceSheets.map(sheets => ({
        cik: sheets.cik,
        announcedDate: sheets.date,
        period: sheets.period,
        value: sheets.totalStockholdersEquity
    })),
    quarterlyOutstandingShares: statements.incomeStatements.map(sheets => ({
        cik: sheets.cik,
        announcedDate: sheets.date,
        period: sheets.period,
        value: sheets.weightedAverageShsOut
    })),
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
    }))
});

export const buildStickerPriceInput = async (cik: string, symbol: string, data: QuarterlyData): Promise<StickerPriceInput> => ({
    cik: cik,
    debtYears: calculatorService.calculateDebtYears({
        cik: cik,
        quarterlyData: data
    }),
    annualBVPS: calculatorService.calculateBVPS({
        cik: cik,
        timePeriod: 'A',
        quarterlyData: data
    }),
    annualPE: await calculatorService.calculatePE({
        cik: cik,
        timePeriod: 'A',
        symbol: symbol,
        quarterlyData: data
    }),
    annualROIC: calculatorService.calculateROIC({
        cik: cik,
        timePeriod: 'A',
        quarterlyData: data
    }),
    annualEPS: annualizeByAdd(cik, data.quarterlyEPS),
    annualEquity: annualizeByLastQuarter(cik, data.quarterlyTotalEquity),
    annualRevenue: annualizeByAdd(cik, data.quarterlyRevenue),
    annualOperatingCashFlow: annualizeByAdd(cik, data.quarterlyOperatingCashFlow)
});
