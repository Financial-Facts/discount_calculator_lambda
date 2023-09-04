import BalanceSheet from "@/resources/entities/statements/balance-sheet";
import IncomeStatement from "@/resources/entities/statements/income-statement";
import { Report } from '../Parser.typings';

export function buildBalanceSheets(cik: string, symbol: string, reports: Report[]): BalanceSheet[] {
    return reports
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
                cashAndCashEquivalents: report.assetCurrentCashEquivalents,
                shortTermInvestments: report.assetCurrentInvestments,
                cashAndShortTermInvestments: twoVariableOperation(report.assetCurrentCashEquivalents, report.assetCurrentInvestments, (a, b) => a + b),
                netReceivables: report.assetCurrentAccountsReceivable,
                inventory: report.assetCurrentInventory,
                otherCurrentAssets: null,
                totalCurrentAssets: report.assetCurrent,
                propertyPlantEquipmentNet: report.assetNonCurrentPPENet,
                goodwill: report.goodwill || null,
                intangibleAssets: report.assetNonCurrentIntangibleLessGoodwill,
                goodwillAndIntangibleAssets: twoVariableOperation(report.goodwill, report.assetNonCurrentIntangibleLessGoodwill, (a, b) => a + b),
                longTermInvestments: report.assetNonCurrentInvestments,
                taxAssets: null,
                otherNonCurrentAssets: null,
                totalNonCurrentAssets: report.assetNonCurrent,
                otherAssets: null,
                totalAssets: report.assetTotal,
                accountPayables: report.liabilityCurrentAccountsPayable,
                shortTermDebt: report.liabilityCurrentDebt,
                taxPayables: null,
                deferredRevenue: null,
                otherCurrentLiabilities: null,
                totalCurrentLiabilities: report.liabilityCurrent,
                longTermDebt: report.liabilityNonCurrentDebt || 0,
                deferredRevenueNonCurrent: null,
                deferredTaxLiabilitiesNonCurrent: report.deferredIncomeTaxLiabilitiesNet || null,
                otherNonCurrentLiabilities: null,
                totalNonCurrentLiabilities: report.liabilityNonCurrent,
                otherLiabilities: null,
                capitalLeaseObligations: report.capitalLeaseObligations || null,
                totalLiabilities: report.liabilityTotal,
                preferredStock: report.equityStockPreferred,
                commonStock: report.commonStock || null,
                retainedEarnings: report.equityRetainedEarnings,
                accumulatedOtherComprehensiveIncomeLoss: report.accumulatedOtherComprehensiveIncomeLoss || null,
                othertotalStockholdersEquity: null,
                totalStockholdersEquity: twoVariableOperation(report.assetTotal, report.liabilityTotal, (a, b) => a - b) || 0,
                totalEquity: report.equityTotal || 0,
                totalLiabilitiesAndStockholdersEquity: threeVariableOperation(report.liabilityTotal, report.assetTotal, report.liabilityTotal, (a, b, c) => a + (b - c)),
                minorityInterest: null,
                totalLiabilitiesAndTotalEquity: twoVariableOperation(report.liabilityTotal, report.equityTotal, (a, b) => a + b),
                totalInvestments: report.investmentsTotal || null,
                totalDebt: twoVariableOperation(report.liabilityNonCurrentDebt, report.liabilityCurrentDebt, (a, b) => a + b),
                netDebt: threeVariableOperation(report.assetCurrentCashEquivalents, report.liabilityCurrentDebt, report.liabilityNonCurrentDebt, (a, b, c) => (b + c) - a) || 0,
                link: null,
                finalLink: null
            }
        })
}

export function buildIncomeStatements(cik: string, symbol: string, reports: Report[]): IncomeStatement[] {
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
                revenue: report.revenueTotal || 0,
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
                operatingIncome: report.incomeOperating || 0,
                operatingIncomeRatio: twoVariableOperation(report.incomeOperating, report.revenueTotal, (a, b) => a / b),
                totalOtherIncomeExpensesNet: null,
                incomeBeforeTax: twoVariableOperation(report.ebit, report.expenseInterest, (a, b) => a - b),
                incomeBeforeTaxRatio: threeVariableOperation(report.ebit, report.expenseInterest, report.revenueTotal, (a, b, c) => (a - b) / c),
                incomeTaxExpense: report.expenseTax || 0,
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

function twoVariableOperation(
    a: number | null | undefined,
    b: number | null | undefined,
    equation: ((a: number, input2: number) => number)
): number | null {
    if ((a || a === 0) && (b || b === 0)) {
        return equation(a, b);
    }
    return null;
}

function threeVariableOperation(
    a: number | null | undefined,
    b: number | null | undefined,
    c: number | null | undefined,
    equation: ((a: number, b: number, c: number) => number)
): number | null {
    if ((a || a === 0) && (b || b === 0) && (c || c === 0)) {
        return equation(a, b, c);
    }
    return null;
}