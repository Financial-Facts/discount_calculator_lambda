import { SimpleDiscount } from "@/services/discount/discount.typings";
import { CompanyProfile } from "@/services/financial-modeling-prep/profile/profile.typings";
import { BalanceSheet, CashFlowStatement, IncomeStatement, Statements } from "@/services/financial-modeling-prep/statement/statement.typings";
import { Period } from "@/src/types";
import { TEST_CONSTANTS } from "../../../test.constants";
import words from 'random-words'
import { PriceData } from "@/services/historical-price/historical-price.typings";
import { StickerPrice } from "@/services/sticker-price/sticker-price.typings";
import { BenchmarkRatioPrice } from "@/services/benchmark/benchmark.typings";

export const mockSimpleDiscounts: SimpleDiscount[] = [
    {
        cik: TEST_CONSTANTS.CIK,
        symbol: TEST_CONSTANTS.SYMBOL,
        name: TEST_CONSTANTS.NAME,
        active: true,
        ratio_Price: Math.random() * 100,
        ttmSalePrice: 1,
        tfySalePrice: Math.random() * 100,
        ttySalePrice: 10
    }, {
        cik: TEST_CONSTANTS.CIK2,
        symbol: TEST_CONSTANTS.SYMBOL,
        name: TEST_CONSTANTS.NAME,
        active: true,
        ratio_Price: Math.random() * 100,
        ttmSalePrice: 1,
        tfySalePrice: Math.random() * 100,
        ttySalePrice: 10
    }
]

export const mockCompanyProfile: CompanyProfile = {
    symbol: TEST_CONSTANTS.SYMBOL,
    price: Math.random() * 100,
    beta: Math.random() * 100,
    volAvg: Math.random() * 100,
    mktCap: Math.random() * 100,
    lastDiv: Math.random() * 100,
    range: words(1)[0],
    changes: Math.random() * 100,
    companyName: TEST_CONSTANTS.NAME,
    currency: TEST_CONSTANTS.CURRENCY,
    cik: TEST_CONSTANTS.CIK,
    isin: words(1)[0],
    cusip: words(1)[0],
    exchange: words(1)[0],
    exchangeShortName: words(1)[0],
    industry: TEST_CONSTANTS.INDUSTRY,
    website: words(1)[0],
    description: words(1)[0],
    ceo: words(1)[0],
    sector: words(1)[0],
    country: words(1)[0],
    fullTimeEmployees: words(1)[0],
    phone: words(1)[0],
    address: words(1)[0],
    city: words(1)[0],
    state: words(1)[0],
    zip: words(1)[0],
    dcfDiff: Math.random() * 100,
    dcf: Math.random() * 100,
    image: words(1)[0],
    ipoDate: words(1)[0],
    defaultImage: false,
    isEtf: false,
    isActivelyTrading: true,
    isAdr: false,
    isFund: true
}

export const mockStatements: Statements = buildMockStatements();

export const mockHistoricalPrices = buildMockHistoricalPrices();

export const mockStickerPrice: StickerPrice = {
    cik: TEST_CONSTANTS.CIK,
    ttmPriceData: {
        cik: TEST_CONSTANTS.CIK,
        stickerPrice: 10,
        salePrice: 5
    },
    tfyPriceData: {
        cik: TEST_CONSTANTS.CIK,
        stickerPrice: 10,
        salePrice: 5
    },
    ttyPriceData: {
        cik: TEST_CONSTANTS.CIK,
        stickerPrice: 10,
        salePrice: 5
    },
    input: {
        cik: TEST_CONSTANTS.CIK,
        annualBVPS: [],
        annualPE: [],
        annualROIC: [],
        annualEPS: [],
        annualEquity: [],
        annualRevenue: [],
        annualOperatingCashFlow: []
    }
};

export const mockBenchmarkPrice: BenchmarkRatioPrice = {
    cik: TEST_CONSTANTS.CIK,
    ratioPrice: 10,
    input: {
        cik: TEST_CONSTANTS.CIK,
        industry: TEST_CONSTANTS.INDUSTRY,
        ttmRevenue: 20000000,
        sharesOutstanding: 2000000,
        psBenchmarkRatio: 1.6
    }
}

function buildMockHistoricalPrices(): PriceData[] {
    const today = new Date();
    let before = new Date();
    before.setFullYear(today.getFullYear() - 11);
    const result: PriceData[] = [];

    while(before.valueOf() < today.valueOf()) {
        result.push({ date: before, close: Math.random() * 100 });
        before.setDate(before.getDate() + 1);
    }
    
    return result;
}

function buildMockStatements(): Statements {
    const incomeStatements: IncomeStatement[] = [];
    const balanceSheets: BalanceSheet[] = [];
    const cashFlowStatements: CashFlowStatement[] = [];

    let periodIndex = 0;
    const periods: Period[] = ['Q1', 'Q2', 'Q3', 'Q4'];

    let multiplier = 1;

    const today = new Date();
    let before = new Date();
    before.setFullYear(today.getFullYear() - 11);
    while (before.valueOf() < today.valueOf()) {
        const period = periods[periodIndex];

        incomeStatements.push(buildMockIncomeStatement(before, period, multiplier));
        balanceSheets.push(buildMockBalanceSheet(before, period, multiplier));
        cashFlowStatements.push(buildMockCashFlowStatement(before, period, multiplier));

        before.setMonth(before.getMonth() + 3);
        periodIndex++;
        if (periodIndex === 4) {
            periodIndex = 0;
        }

        multiplier += 2;
    }

    return {
        incomeStatements,
        balanceSheets,
        cashFlowStatements
    }
}

function buildMockIncomeStatement(date: Date, period: Period, multiplier: number): IncomeStatement {
    return {
        cik: TEST_CONSTANTS.CIK,
        date: date,
        symbol: TEST_CONSTANTS.SYMBOL,
        reportedCurrency: TEST_CONSTANTS.CURRENCY,
        fillingDate: date,
        acceptedDate: date.toDateString(),
        calendarYear: '' + date.getFullYear(),
        period: period,
        revenue: Math.random() * multiplier,
        costOfRevenue: Math.random() * multiplier,
        grossProfit: Math.random() * multiplier,
        grossProfitRatio: Math.random() * multiplier,
        researchAndDevelopmentExpenses: Math.random() * multiplier,
        generalAndAdministrativeExpenses: Math.random() * multiplier,
        sellingAndMarketingExpenses: Math.random() * multiplier,
        sellingGeneralAndAdministrativeExpenses: Math.random() * multiplier,
        otherExpenses: Math.random() * multiplier,
        operatingExpenses: Math.random() * multiplier,
        costAndExpenses: Math.random() * multiplier,
        interestIncome: Math.random() * multiplier,
        interestExpense: Math.random() * multiplier,
        depreciationAndAmortization: Math.random() * multiplier,
        ebitda: Math.random() * multiplier,
        ebitdaratio: Math.random() * multiplier,
        operatingIncome: Math.random() * multiplier,
        operatingIncomeRatio: Math.random() * multiplier,
        totalOtherIncomeExpensesNet: Math.random() * multiplier,
        incomeBeforeTax: Math.random() * multiplier,
        incomeBeforeTaxRatio: Math.random() * multiplier,
        incomeTaxExpense: Math.random() * multiplier,
        netIncome: Math.random() * multiplier,
        netIncomeRatio: Math.random() * multiplier,
        eps: Math.random() * multiplier,
        epsdiluted: Math.random() * multiplier,
        weightedAverageShsOut: Math.random() * multiplier,
        weightedAverageShsOutDil: Math.random() * multiplier,
        link: 'link.com',
        finalLink: 'final_link.com' 
    }
}

function buildMockBalanceSheet(date: Date, period: Period, multiplier: number): BalanceSheet {
    return {
        cik: TEST_CONSTANTS.CIK,
        date: date,
        symbol: TEST_CONSTANTS.SYMBOL,
        reportedCurrency: TEST_CONSTANTS.CURRENCY,
        fillingDate: date,
        acceptedDate: date.toDateString(),
        calendarYear: ''+date.getFullYear(),
        period: period,
        cashAndCashEquivalents: Math.random() * multiplier,
        shortTermInvestments: Math.random() * multiplier,
        cashAndShortTermInvestments: Math.random() * multiplier,
        netReceivables: Math.random() * multiplier,
        inventory: Math.random() * multiplier,
        otherCurrentAssets: Math.random() * multiplier,
        totalCurrentAssets: Math.random() * multiplier,
        propertyPlantEquipmentNet: Math.random() * multiplier,
        goodwill: Math.random() * multiplier,
        intangibleAssets: Math.random() * multiplier,
        goodwillAndIntangibleAssets: Math.random() * multiplier,
        longTermInvestments: Math.random() * multiplier,
        taxAssets: Math.random() * multiplier,
        otherNonCurrentAssets: Math.random() * multiplier,
        totalNonCurrentAssets: Math.random() * multiplier,
        otherAssets: Math.random() * multiplier,
        totalAssets: Math.random() * multiplier,
        accountPayables: Math.random() * multiplier,
        shortTermDebt: Math.random() * multiplier,
        taxPayables: Math.random() * multiplier,
        deferredRevenue: Math.random() * multiplier,
        otherCurrentLiabilities: Math.random() * multiplier,
        totalCurrentLiabilities: Math.random() * multiplier,
        longTermDebt: Math.random() * multiplier,
        deferredRevenueNonCurrent: Math.random() * multiplier,
        deferredTaxLiabilitiesNonCurrent: Math.random() * multiplier,
        otherNonCurrentLiabilities: Math.random() * multiplier,
        totalNonCurrentLiabilities: Math.random() * multiplier,
        otherLiabilities: Math.random() * multiplier,
        capitalLeaseObligations: Math.random() * multiplier,
        totalLiabilities: Math.random() * multiplier,
        preferredStock: Math.random() * multiplier,
        commonStock: Math.random() * multiplier,
        retainedEarnings: Math.random() * multiplier,
        accumulatedOtherComprehensiveIncomeLoss: Math.random() * multiplier,
        othertotalStockholdersEquity: Math.random() * multiplier,
        totalStockholdersEquity: Math.random() * multiplier,
        totalEquity: Math.random() * multiplier,
        totalLiabilitiesAndStockholdersEquity: Math.random() * multiplier,
        minorityInterest: Math.random() * multiplier,
        totalLiabilitiesAndTotalEquity: Math.random() * multiplier,
        totalInvestments: Math.random() * multiplier,
        totalDebt: Math.random() * multiplier,
        netDebt: Math.random() * multiplier,
        link: 'link.com',
        finalLink: 'final_link.com'
    }
}

function buildMockCashFlowStatement(date: Date, period: Period, multiplier: number): CashFlowStatement {
    return {
        cik: TEST_CONSTANTS.CIK,
        date: date,
        symbol: TEST_CONSTANTS.SYMBOL,
        reportedCurrency: TEST_CONSTANTS.CURRENCY,
        fillingDate: date,
        acceptedDate: date.toDateString(),
        calendarYear: ''+date.getFullYear(),
        period: period,
        netIncome: Math.random() * multiplier,
        depreciationAndAmortization: Math.random() * multiplier,
        deferredIncomeTax: Math.random() * multiplier,
        stockBasedCompensation: Math.random() * multiplier,
        changeInWorkingCapital: Math.random() * multiplier,
        accountsReceivables: Math.random() * multiplier,
        inventory: Math.random() * multiplier,
        accountsPayables: Math.random() * multiplier,
        otherWorkingCapital: Math.random() * multiplier,
        otherNonCashItems: Math.random() * multiplier,
        netCashProvidedByOperatingActivities: Math.random() * multiplier,
        investmentsInPropertyPlantAndEquipment: Math.random() * multiplier,
        acquisitionsNet: Math.random() * multiplier,
        purchasesOfInvestments: Math.random() * multiplier,
        salesMaturitiesOfInvestments: Math.random() * multiplier,
        otherInvestingActivites: Math.random() * multiplier,
        netCashUsedForInvestingActivites: Math.random() * multiplier,
        debtRepayment: Math.random() * multiplier,
        commonStockIssued: Math.random() * multiplier,
        commonStockRepurchased: Math.random() * multiplier,
        dividendsPaid: Math.random() * multiplier,
        otherFinancingActivites: Math.random() * multiplier,
        netCashUsedProvidedByFinancingActivities: Math.random() * multiplier,
        effectOfForexChangesOnCash: Math.random() * multiplier,
        netChangeInCash: Math.random() * multiplier,
        cashAtEndOfPeriod: Math.random() * multiplier,
        cashAtBeginningOfPeriod: Math.random() * multiplier,
        operatingCashFlow: Math.random() * multiplier,
        capitalExpenditure: Math.random() * multiplier,
        freeCashFlow: Math.random() * multiplier,
        link: 'link.com',
        finalLink: 'final_link.com' 
    }
}