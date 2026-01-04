import { StickerPrice, StickerPriceInput } from "./sticker-price.typings";
import { calculatorService } from "../../bootstrap";
import { PeriodicData } from "@/src/types";
import { StickerPriceQuarterlyData } from "@/resources/discount-manager/discount-manager.typings";
import { annualizeByAdd, annualizeByLastQuarter } from "@/utils/annualize.utils";
import { filterToCompleteFiscalYears } from "@/utils/filtering.utils";
import { averageOverPeriodFunction, bvpsFunction, cagrFunction, debtYearsFunction, peFunction, periodicGrowthRatesFunction, roicFunction, stickerPriceFunction } from "../calculator/calculator.service";
import { TimePeriod } from "../calculator/calculator.typings";

class StickerPriceService {

    public getStickerPrice(data: StickerPriceInput): StickerPrice {
        console.log("In sticker price service calculating sticker price for CIK: " + data.cik);
        return {
            cik: data.cik,
            price: this.calculateStickerPrice(data.cik, data.annualBVPS, data.annualPE, data.annualEPS, data.ffyEstimatedEpsGrowthRate),
            input: data
        }
    }

    public async buildStickerPriceInput(
        cik: string,
        symbols: string[],
        data: StickerPriceQuarterlyData
    ): Promise<StickerPriceInput> {
        return {
            cik: cik,
            debtYears: calculatorService.calculate(
                {
                    cik: cik,
                    quarterlyData: data
                },
                debtYearsFunction
            ),
            annualBVPS: calculatorService.calculate(
                {
                    cik: cik,
                    timePeriod: 'A' as TimePeriod,
                    quarterlyData: data
                },
                bvpsFunction
            ),
            annualPE: await calculatorService.calculate(
                {
                    cik: cik,
                    timePeriod: 'A' as TimePeriod,
                    symbols: symbols,
                    quarterlyData: data
                },
                peFunction
            ),
            annualROIC: calculatorService.calculate(
                {
                   cik: cik,
                    timePeriod: 'A' as TimePeriod,
                    quarterlyData: data
                },
                roicFunction
            ),
            annualEPS: annualizeByAdd(cik, data.quarterlyEPS),
            annualEquity: annualizeByLastQuarter(cik, data.quarterlyTotalEquity),
            annualRevenue: annualizeByAdd(cik, data.quarterlyRevenue),
            annualOperatingCashFlow: annualizeByAdd(cik, data.quarterlyOperatingCashFlow),
            ffyEstimatedEpsGrowthRate: this.calculateAnalystEstimatedGrowthRate(cik, data.quarterlyEPS, data.annualEstimatedEPS)
        }
    }


    private calculateAnalystEstimatedGrowthRate(
        cik: string,
        quarterlyEps: PeriodicData[],
        annualEstimatedEPS: PeriodicData[]
    ): number | undefined {
        if (annualEstimatedEPS.length === 0) {
            return undefined;
        }
        
        const recentFyEPS = annualizeByAdd(cik, filterToCompleteFiscalYears(quarterlyEps)).slice(-1)[0];
        const futurePeriodEstimates = annualEstimatedEPS
            .filter(period => new Date(period.announcedDate).valueOf() > new Date(recentFyEPS.announcedDate).valueOf());

        if (futurePeriodEstimates.length === 0) {
            return undefined;
        }
        
        const estimatedPeriodicGrowthRates = calculatorService.calculate(
            {
                cik: cik,
                periodicData: [recentFyEPS, ...futurePeriodEstimates]
            },
            periodicGrowthRatesFunction
        );

        return calculatorService.calculate(
            {
                periodicData: estimatedPeriodicGrowthRates,
                numPeriods: estimatedPeriodicGrowthRates.length
            },
            averageOverPeriodFunction
        );
    }


    private calculateStickerPrice(
        cik: string,
        annualBVPS: PeriodicData[],
        annualPE: PeriodicData[],
        annualEPS: PeriodicData[],
        ffyEstimatedEpsGrowthRate?: number
    ): number {
        const numPeriods = 10;
        return calculatorService.calculate(
            {
                cik: cik,
                numPeriods: numPeriods,
                equityGrowthRate: calculatorService.calculate(
                    {
                        periodicData: annualBVPS,
                        period: numPeriods
                    },
                    cagrFunction
                ),
                annualEPS: annualEPS,
                annualPE: annualPE,
                analystGrowthEstimate: ffyEstimatedEpsGrowthRate
            },
            stickerPriceFunction
        );
    }

}

export default StickerPriceService;