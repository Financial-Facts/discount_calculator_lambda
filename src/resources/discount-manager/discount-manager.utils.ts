import InsufficientDataException from "@/utils/exceptions/InsufficientDataException";
import { Statement, Statements } from "@/services/financial-modeling-prep/statement/statement.typings";
import { days_between } from "@/utils/date.utils";
import DataNotUpdatedException from "@/utils/exceptions/DataNotUpdatedException";
import { BenchmarkRatioPrice } from "@/services/benchmark/benchmark.typings";
import { Discount, Qualifier } from "@/services/discount/ffs-discount/discount.typings";
import { DiscountedCashFlowPrice } from "@/services/financial-modeling-prep/discounted-cash-flow/discounted-cash-flow.typings";
import { CompanyProfile } from "@/services/financial-modeling-prep/company-information/company-information.typings";
import { StickerPrice } from "@/services/sticker-price/sticker-price.typings";
import { QuarterlyData } from "./discount-manager.typings";
import { PeriodicData } from "@/src/types";
import { companyInformationService } from "@/src/bootstrap";
import { buildQualifyingData } from "./qualification.utils";


export function validateStatements(cik: string, data: Statements): void {
    checkHasSufficientStatements(cik, data);
    checkStatementsHaveBeenUpdated(cik, data);
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

export const buildDiscount = async (
    cik: string,
    profile: CompanyProfile,
    stickerPrice: StickerPrice,
    benchmarkRatioPrice: BenchmarkRatioPrice,
    discountedCashFlowPrice: DiscountedCashFlowPrice
): Promise<Discount> => {
    const qualifiers = buildQualifyingData(cik, stickerPrice.input);
    return {
        ...{
            cik: cik,
            symbol: profile.symbol,
            name: profile.companyName,
            active: getIsActive(profile.price, stickerPrice, benchmarkRatioPrice, discountedCashFlowPrice),
            marketPrice: profile.price,
            annualDividend: profile.lastDiv,
            averageVolume: profile.volAvg,
            description: profile.description,
            ceo: profile.ceo,
            exchange: profile.exchange,
            industry: profile.industry,
            location: buildLocationString(profile),
            website: profile.website,
            ttmInsiderPurchases: await getTtmInsiderPurchases(profile.symbol),
            lastUpdated: new Date(),
            qualifiers: qualifiers,
            stickerPrice,
            benchmarkRatioPrice,
            discountedCashFlowPrice
        },
        ...buildDiscountValidationData(stickerPrice, benchmarkRatioPrice, discountedCashFlowPrice, qualifiers)
    }
}

const buildDiscountValidationData = (
    stickerPrice: StickerPrice,
    benchmarkRatioPrice: BenchmarkRatioPrice,
    discountedCashFlowPrice: DiscountedCashFlowPrice,
    qualifiers: Qualifier[]
): { isDeleted: 'Y' | 'N', deletedReasons: string[] } => {

    const deletedReasons: string[] = [];

    if (!stickerPrice.price || Number.isNaN(stickerPrice.price)) {
        deletedReasons.push('Invalid sticker price was calculated');
    }

    if (stickerPrice.price < 0 ||
        benchmarkRatioPrice.price < 0 ||
        discountedCashFlowPrice.price <= 0) {
            deletedReasons.push('Valuation cannot be negative');
        }
    
    const maximumDebtYears = 3;
    if (stickerPrice.input.debtYears > maximumDebtYears) {
        deletedReasons.push(`Debt years are greater than the allowed maximum (${maximumDebtYears})`);
    }

    const minimumGrowthRate = 10;
    const annualDataKeys: Record<string, string> = {
        annualROIC: 'Annual ROIC',
        annualRevenue: 'Annual revenue',
        annualEPS: 'Annual EPS',
        annualEquity: 'Annual equity',
        annualOperatingCashFlow: 'Annual operating cash flow'
    };
    for (let qualifier of qualifiers) {
        const { value, type, periods } = qualifier;
        if (value < minimumGrowthRate) {
            deletedReasons.push(type === 'annualROIC' ?
                `Average annual ROIC does not meet minimum ${minimumGrowthRate}% over the past ${periods} years` :
                `${annualDataKeys[type]} growth rate does not exceed ${minimumGrowthRate}% on average over the past ${periods} years`);
        }
    }
    
    return {
        isDeleted: deletedReasons.length > 0 ? 'Y' : 'N',
        deletedReasons: deletedReasons
    }
}

const getIsActive = (
    marketPrice: number,
    stickerPrice: StickerPrice,
    benchmarkRatioPrice: BenchmarkRatioPrice,
    discountedCashFlowPrice: DiscountedCashFlowPrice
): boolean => 
    marketPrice <  stickerPrice.price &&
    marketPrice < benchmarkRatioPrice.price && 
    marketPrice < discountedCashFlowPrice.price;

const buildLocationString = (profile: CompanyProfile): string => {
    const { city, state, country } = profile;
    let result = '';

    if (city) {
        result += city;

        if (state || country) {
            result += ', '
        }
    }

    if (state) {
        result += state;

        if (country) {
            result += ', ';
        }
    }

    if (country) {
        result += country;
    }

    return result;
}

const getTtmInsiderPurchases = async (symbol: string): Promise<number> => {
    return companyInformationService
        .getInsiderTrades(symbol)
        .then(insiderTrades => insiderTrades
        .reduce<number>((netBuysSells, trade) => {
            if (days_between(new Date(trade.transactionDate), new Date()) < 365) {
                netBuysSells = netBuysSells + (
                    trade.transactionType === 'P-Purchase' ?
                        trade.securitiesTransacted :
                        -trade.securitiesTransacted);
            }
            return netBuysSells;
        }, 0));
}

export const buildQuarterlyData = async (
    cik: string,
    symbol: string,
    statements: Statements
): Promise<QuarterlyData> => ({
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
    })),
    annualEstimatedEPS: (await companyInformationService.getAnalystEstimates(symbol)).map(estimate => ({
        cik: cik,
        announcedDate: estimate.date,
        value: estimate.estimatedEpsAvg
    }))
});

