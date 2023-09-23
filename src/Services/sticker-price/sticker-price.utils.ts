import { BigFive } from "@/services/calculator/calculator.typings";
import { calculatorService } from "../../bootstrap";
import { PeriodicData, QuarterlyData } from "@/resources/consumers/PriceCheckConsumer/discount-manager/discount-manager.typings";

export function checkBigFiveExceedGrowthRateMinimum(cik: string, bigFive: BigFive): void {
    checkPercentageExceedsMinimum(cik, bigFive.annualROIC, 'ROIC');
    checkAverageGrowthRateExceedsValue(
        calculatorService.calculatePeriodicGrowthRates({
            cik: cik,
            periodicData: bigFive.annualRevenue
        }), `Revenue growth does not meet a minimum of 10% for ${cik}`);
    checkAverageGrowthRateExceedsValue(
        calculatorService.calculatePeriodicGrowthRates({
            cik: cik,
            periodicData: bigFive.annualEPS
        }), `EPS growth does not meet a minimum of 10% for ${cik}`);
    checkAverageGrowthRateExceedsValue(
        calculatorService.calculatePeriodicGrowthRates({
            cik: cik,
            periodicData: bigFive.annualEquity
        }), `Equity growth does not meet a minimum of 10% for ${cik}`);
    checkAverageGrowthRateExceedsValue(
        calculatorService.calculatePeriodicGrowthRates({
            cik: cik,
            periodicData: bigFive.annualOperatingCashFlow
        }), `Operating cash flow growth does not meet a minimum of 10% for ${cik}`); 
}

function checkPercentageExceedsMinimum(cik: string, data: PeriodicData[], type: string): void {
    checkAnnualDataAvgExceedsValue([data], 10, `Annual ${type} does not meet minimum 10% for ${cik}`);
}

function checkAverageGrowthRateExceedsValue(data: PeriodicData[], errorMessage: string) {
    calculatorService.calculateAverageOverPeriod({
        periodicData: data,
        numPeriods: 10,
        minimum: 10,
        errorMessage: errorMessage
    });
}

function checkAnnualDataAvgExceedsValue(
    annualData: PeriodicData[][],
    value: number,
    errorMessage: string
): void {
    annualData.forEach(dataset => {
        [1, 5, 10].forEach(period => {
            calculatorService.calculateAverageOverPeriod({ 
                periodicData: dataset,
                numPeriods: period,
                minimum: value,
                errorMessage: errorMessage
            });
        });
    })
}
