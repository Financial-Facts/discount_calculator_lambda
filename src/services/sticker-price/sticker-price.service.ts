import { StickerPrice, StickerPriceInput } from "./sticker-price.typings";
import { calculatorService } from "../../bootstrap";
import { PeriodicData } from "@/src/types";
import { StickerPriceQuarterlyData } from "@/resources/discount-manager/discount-manager.typings";
import { annualizeByAdd, annualizeByLastQuarter } from "@/utils/annualize.utils";
import { filterToCompleteFiscalYears } from "@/utils/filtering.utils";

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
        symbol: string,
        data: StickerPriceQuarterlyData
    ): Promise<StickerPriceInput> {
        return {
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
            .filter(period => new Date(period.announcedDate).valueOf() > new Date(recentFyEPS.announcedDate).valueOf())
            .reverse();

        if (futurePeriodEstimates.length === 0) {
            return undefined;
        }
        
        const estimatedPeriodicGrowthRates = calculatorService.calculatePeriodicGrowthRates({
            cik: cik,
            periodicData: [recentFyEPS, ...futurePeriodEstimates]
        });

        return calculatorService.calculateAverageOverPeriod({
            periodicData: estimatedPeriodicGrowthRates,
            numPeriods: estimatedPeriodicGrowthRates.length
        });
    }


    private calculateStickerPrice(
        cik: string,
        annualBVPS: PeriodicData[],
        annualPE: PeriodicData[],
        annualEPS: PeriodicData[],
        ffyEstimatedEpsGrowthRate?: number
    ): number {
        const numPeriods = 10;
        return calculatorService.calculateStickerPrice({
            cik: cik,
            numPeriods: numPeriods,
            equityGrowthRate: calculatorService.calculateCAGR({
                periodicData: annualBVPS,
                period: numPeriods,
                minimumGrowth: 10,
                type: 'Annual BVPS'
            }),
            annualEPS: annualEPS,
            annualPE: annualPE,
            analystGrowthEstimate: ffyEstimatedEpsGrowthRate
        });
    }

}

export default StickerPriceService;