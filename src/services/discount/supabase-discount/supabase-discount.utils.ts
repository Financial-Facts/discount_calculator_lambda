import { PeriodicData, Period } from "@/src/types";
import { Discount } from "../ffs-discount/discount.typings";
import { DbPeriodicData, DbDiscount, DbSimpleDiscount } from "./supabase-discount.typings";

export const cleanPeriodicData = (unclean: DbPeriodicData[]): PeriodicData[] => unclean.map(data => ({
    cik: data.cik,
    announcedDate: new Date(data.announced_date),
    value: data.value,
    period: data.period ? data.period as Period : undefined
}));

export const mapDbToDiscount = (currentDiscount: DbDiscount): Discount | null => {
    const stickerPrice = currentDiscount.sticker_price;
    const stickerPriceInput = stickerPrice.sticker_price_input;
    const benchmarkRatioPrice = currentDiscount.benchmark_ratio_price;
    const benchmarkRatioPriceInput = benchmarkRatioPrice?.benchmark_ratio_price_input;
    const discountedCashFlowPrice = currentDiscount.discounted_cash_flow_price;
    const discountedCashFlowInput = discountedCashFlowPrice?.discounted_cash_flow_input;

    return {
        cik: currentDiscount.cik,
        symbol: currentDiscount.symbol,
        name: currentDiscount.name,
        lastUpdated: new Date(currentDiscount.last_updated),
        active: currentDiscount.active,
        stickerPrice: {
            cik: stickerPrice.cik,
            price: stickerPrice.price,
            input: {
                cik: stickerPriceInput.cik,
                debtYears: stickerPriceInput.debt_years,
                annualBVPS: cleanPeriodicData(stickerPriceInput.annual_bvps),
                annualPE: cleanPeriodicData(stickerPriceInput.annual_pe),
                annualROIC: cleanPeriodicData(stickerPriceInput.annual_roic),
                annualEPS: cleanPeriodicData(stickerPriceInput.annual_eps),
                annualEquity: cleanPeriodicData(stickerPriceInput.annual_equity),
                annualOperatingCashFlow: cleanPeriodicData(stickerPriceInput.annual_operating_cash_flow),
                annualRevenue: cleanPeriodicData(stickerPriceInput.annual_revenue),
            }
        },
        benchmarkRatioPrice: {
            cik: benchmarkRatioPrice.cik,
            price: benchmarkRatioPrice.price,
            input: {
                cik: benchmarkRatioPriceInput.cik,
                industry: benchmarkRatioPriceInput.industry,
                ttmRevenue: benchmarkRatioPriceInput.ttm_revenue,
                sharesOutstanding: benchmarkRatioPriceInput.shares_outstanding,
                psBenchmarkRatio: benchmarkRatioPriceInput.ps_benchmark_ratio
            }
        },
        discountedCashFlowPrice: {
            cik: discountedCashFlowPrice.cik,
            price: discountedCashFlowPrice.price,
            input: {
                cik: discountedCashFlowInput.cik,
                symbol: discountedCashFlowInput.symbol,
                wacc: discountedCashFlowInput.wacc,
                longTermGrowthRate: discountedCashFlowInput.long_term_growth_rate,
                terminalValue: discountedCashFlowInput.terminal_value,
                freeCashFlowT1: discountedCashFlowInput.free_cash_flowt1,
                enterpriseValue: discountedCashFlowInput.enterprise_value,
                netDebt: discountedCashFlowInput.net_debt,
                dilutedSharesOutstanding: discountedCashFlowInput.diluted_shares_outstanding,
                marketPrice: discountedCashFlowInput.market_price,
                historicalRevenue: cleanPeriodicData(discountedCashFlowInput.historical_revenue),
                projectedRevenue: cleanPeriodicData(discountedCashFlowInput.projected_revenue),
                historicalOperatingCashFlow: cleanPeriodicData(discountedCashFlowInput.historical_operating_cash_flow),
                projectedOperatingCashFlow: cleanPeriodicData(discountedCashFlowInput.projected_operating_cash_flow),
                historicalCapitalExpenditure: cleanPeriodicData(discountedCashFlowInput.historical_capital_expenditure),
                projectedCapitalExpenditure: cleanPeriodicData(discountedCashFlowInput.projected_capital_expenditure),
                historicalFreeCashFlow: cleanPeriodicData(discountedCashFlowInput.historical_free_cash_flow),
                projectedFreeCashFlow: cleanPeriodicData(discountedCashFlowInput.projected_free_cash_flow)
            }
        }
    }
}
