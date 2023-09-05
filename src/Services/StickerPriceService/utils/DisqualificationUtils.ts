import DisqualifyingDataException from "@/utils/exceptions/DisqualifyingDataException";
import { PeriodicData } from "@/resources/entities/models/PeriodicData";
import { BigFive, StickerPriceInput } from "../helpers/calculator/calculator.typings";

export function checkValuesMeetRequirements(input: StickerPriceInput, bigFive: BigFive): void {
    checkRatesMeetRequirements(input.data.cik, input.growthRates);
    checkAnnualAvgExceedsZero(input.data.cik, [
        input.annualPE,
        input.annualBVPS,
        input.annualEPS
    ]);
    checkBigFiveExceedGrowthRateMinimum(input.data.cik, bigFive);
}

function checkBigFiveExceedGrowthRateMinimum(cik: string, bigFive: BigFive): void {
    checkPercentageExceedsMinimum(cik, bigFive.annualROIC, 'ROIC');
    checkAverageGrowthRateExceedsValue(
        calculateAnnualGrowthRates(cik, bigFive.annualRevenue),
        `Revenue growth does not meet a minimum of 10% for ${cik}`);
    checkAverageGrowthRateExceedsValue(
        calculateAnnualGrowthRates(cik, bigFive.annualEPS),
        `EPS growth does not meet a minimum of 10% for ${cik}`);
    checkAverageGrowthRateExceedsValue(
        calculateAnnualGrowthRates(cik, bigFive.annualEquity),
        `Equity growth does not meet a minimum of 10% for ${cik}`);
    
}

function checkRatesMeetRequirements(cik: string, growthRates: Record<number, number>): void {
    Object.values(growthRates).forEach(value => {
        if (value < 10) {
            throw new DisqualifyingDataException(`Growth rates do not meet a minimum of 10% for ${cik}`);
        }
    })
}

function checkAnnualAvgExceedsZero(cik: string, annualData: PeriodicData[][]): void {
    checkAnnualDataAvgExceedsValue(annualData, 0, `Annual data is on average negative for ${cik}`);
}

function checkPercentageExceedsMinimum(cik: string, data: PeriodicData[], type: string): void {
    checkAnnualDataAvgExceedsValue([data], 10, `Annual ${type} does not meet minimum 10% for ${cik}`);
}

function checkAverageGrowthRateExceedsValue(data: PeriodicData[], errorMessage: string) {
    const average = data.map(year => year.value).reduce((a, b) => a + b) / data.length;
    if (average < 10) {
        throw new DisqualifyingDataException(errorMessage);
    }
}

function checkAnnualDataAvgExceedsValue(
    annualData: PeriodicData[][],
    value: number,
    errorMessage: string
): void {
    annualData.forEach(dataset => {
        const averageOverPeriod = {
            1: dataset.slice(-1)[0].value,
            5: dataset.slice(-5).map(year => year.value).reduce((a, b) => a + b)/5,
            10: dataset.slice(-10).map(year => year.value).reduce((a, b) => a + b)/10
        }
        if (averageOverPeriod[1] < value ||
            averageOverPeriod[5] < value || 
            averageOverPeriod[10] < value) {
            throw new DisqualifyingDataException(errorMessage);
        }
    })
}

function calculateAnnualGrowthRates(cik: string, data: PeriodicData[]): PeriodicData[] {
    const annualGrowthRates: PeriodicData[] = [];
    let i = 1;
    while (i < data.length) {
        let previous = data[i - 1];
        let current = data[i];
        annualGrowthRates.push({
            cik: cik,
            announcedDate: current.announcedDate,
            period: current.period,
            value: ((current.value - previous.value)/previous.value) * 100
        });
        i++;
    }
    return annualGrowthRates;
}
