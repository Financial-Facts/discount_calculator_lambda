import CONSTANTS from "@/resources/resource.contants";
import { CompanyProfile } from "../financial-modeling-prep/profile/profile.typings";
import { Statements } from "../financial-modeling-prep/statement/statement.typings";
import { DiscountInput, StickerPrice } from "../sticker-price/sticker-price.typings";
import { Discount } from "./discount.typings";

export function buildHeadersWithBasicAuth(): { Authorization: string, 'Content-Type': string } {
    return {
        Authorization: process.env.ffs_auth as string,
        'Content-Type': CONSTANTS.GLOBAL.JSON
    }
}

export function buildDiscount(stickerPrice: StickerPrice, benchmarkRatioPrice: number): Discount {
    return {
        cik: stickerPrice.cik,
        symbol: stickerPrice.symbol,
        name: stickerPrice.name,
        active: false,
        lastUpdated: stickerPrice.lastUpdated,
        ttmPriceData: stickerPrice.ttmPriceData,
        tfyPriceData: stickerPrice.tfyPriceData,
        ttyPriceData: stickerPrice.ttyPriceData,
        quarterlyBVPS: stickerPrice.quarterlyBVPS,
        quarterlyPE: stickerPrice.quarterlyPE,
        quarterlyEPS: stickerPrice.quarterlyEPS,
        quarterlyROIC: stickerPrice.quarterlyROIC,
        ratioPrice: benchmarkRatioPrice
    }
}
export function buildDiscountInput(cik: string, statements: Statements, profile: CompanyProfile): DiscountInput {
    return {
        cik: cik,
        symbol: statements.balanceSheets[0].symbol,
        name: profile.companyName,
        industry: profile.industry,
        quarterlyShareholderEquity: statements.balanceSheets.map(sheets => {
            return {
                cik: sheets.cik,
                announcedDate: sheets.date,
                period: sheets.period,
                value: sheets.totalStockholdersEquity
            }
        }),
        quarterlyOutstandingShares: statements.incomeStatements.map(sheets => {
            return {
                cik: sheets.cik,
                announcedDate: sheets.date,
                period: sheets.period,
                value: sheets.weightedAverageShsOut
            }
        }),
        quarterlyEPS: statements.incomeStatements.map(sheets => {
            return {
                cik: sheets.cik,
                announcedDate: sheets.date,
                period: sheets.period,
                value: sheets.eps
            }
        }),
        quarterlyOperatingIncome: statements.incomeStatements.map(sheets => {
            return {
                cik: sheets.cik,
                announcedDate: sheets.date,
                period: sheets.period,
                value: sheets.operatingIncome
            }
        }),
        quarterlyTaxExpense: statements.incomeStatements.map(sheets => {
            return {
                cik: sheets.cik,
                announcedDate: sheets.date,
                period: sheets.period,
                value: sheets.incomeTaxExpense
            }
        }),
        quarterlyNetDebt: statements.balanceSheets.map(sheets => {
            return {
                cik: sheets.cik,
                announcedDate: sheets.date,
                period: sheets.period,
                value: sheets.netDebt
            }
        }),
        quarterlyTotalEquity: statements.balanceSheets.map(sheets => {
            return {
                cik: sheets.cik,
                announcedDate: sheets.date,
                period: sheets.period,
                value: sheets.totalEquity
            }
        }),
        quarterlyRevenue: statements.incomeStatements.map(sheets => {
            return {
                cik: sheets.cik,
                announcedDate: sheets.date,
                period: sheets.period,
                value: sheets.revenue
            }
        }),
        quarterlyOperatingCashFlow: statements.cashFlowStatements.map(sheets => {
            return {
                cik: sheets.cik,
                announcedDate: sheets.date,
                period: sheets.period,
                value: sheets.operatingCashFlow
            }
        }),
        quarterlyFreeCashFlow: statements.cashFlowStatements.map(sheets => {
            return {
                cik: sheets.cik,
                announcedDate: sheets.date,
                period: sheets.period,
                value: sheets.freeCashFlow
            }
        })
    }
}
