import { BigFive } from "@/services/calculator/calculator.typings";
import { calculatorService } from "../../bootstrap";
import { PeriodicData } from "@/src/types";
import DisqualifyingDataException from "@/utils/exceptions/DisqualifyingDataException";

export function checkDebtYearsExceedsMinimum(cik: string, debtYears: number, maximum: number = 3): void {
    if (debtYears > maximum) {
        throw new DisqualifyingDataException(`${cik} has greater debt years than the maximum ${maximum}`)
    }
}

export function checkBigFiveExceedGrowthRateMinimum(cik: string, bigFive: BigFive): void {
    checkPercentageExceedsMinimum(cik, bigFive.annualROIC, 'ROIC');
    checkAverageGrowthRateExceedsValue(
        calculatorService.calculatePeriodicGrowthRates({
            cik: cik,
            periodicData: bigFive.annualRevenue,
            simplifiedGrowthRateMinimum: 10
        }), `Revenue growth does not meet a minimum of 10% for ${cik}`);
    checkAverageGrowthRateExceedsValue(
        calculatorService.calculatePeriodicGrowthRates({
            cik: cik,
            periodicData: bigFive.annualEPS,
            simplifiedGrowthRateMinimum: 10
        }), `EPS growth does not meet a minimum of 10% for ${cik}`);
    checkAverageGrowthRateExceedsValue(
        calculatorService.calculatePeriodicGrowthRates({
            cik: cik,
            periodicData: bigFive.annualEquity,
            simplifiedGrowthRateMinimum: 10
        }), `Equity growth does not meet a minimum of 10% for ${cik}`);
    checkAverageGrowthRateExceedsValue(
        calculatorService.calculatePeriodicGrowthRates({
            cik: cik,
            periodicData: bigFive.annualOperatingCashFlow,
            simplifiedGrowthRateMinimum: 10
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
