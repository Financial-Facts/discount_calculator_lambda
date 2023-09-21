import { QuarterlyData, PeriodicData } from "../sticker-price/sticker-price.typings";
import { TimePeriod } from "./calculator.typings";
import AverageOverPeriodFunction from "./functions/AverageOverPeriod.function";
import BvpsFunction from "./functions/BVPS.function";
import BenchmarkRatioPriceFunction from "./functions/BenchmarkRatioPrice.function";
import IcFunction from "./functions/IC.function";
import NopatFunction from "./functions/NOPAT.function";
import PeFunction from "./functions/PE.function";
import PeriodicGrowthRatesFunction from "./functions/PeriodicGrowthRates.function";
import RoicFunction from "./functions/ROIC.function";
import StickerPriceFunction from "./functions/StickerPrice.function";


class CalculatorService {

    private bvpsFunction = new BvpsFunction();
    private peFunction = new PeFunction();
    private roicFunction = new RoicFunction();
    private nopatFunction = new NopatFunction();
    private icFunction = new IcFunction();
    private benchmarkRatioPriceFunction = new BenchmarkRatioPriceFunction();
    private periodicGrowthRatesFunction = new PeriodicGrowthRatesFunction();
    private averageOverPeriodFunction = new AverageOverPeriodFunction();
    private stickerPriceFunction = new StickerPriceFunction();

    public calculateBVPS(data: {
        cik: string,
        timePeriod: TimePeriod,
        quarterlyData: QuarterlyData
    }): PeriodicData[] {
        return this.bvpsFunction.calculate(data);
    }

    public async calculatePE(data: {
        cik: string,
        timePeriod: TimePeriod,
        symbol: string,
        quarterlyData: QuarterlyData
    }): Promise<PeriodicData[]> {
        return this.peFunction.calculate(data);
    }

    public calculateNOPAT(data: {
        cik: string,
        timePeriod: TimePeriod,
        quarterlyData: QuarterlyData
    }): PeriodicData[] {
        return this.nopatFunction.calculate(data);
    }

    public calculateIC(data: {
        cik: string,
        timePeriod: TimePeriod,
        quarterlyData: QuarterlyData
    }): PeriodicData[] {
        return this.icFunction.calculate(data);
    }

    public calculateROIC(data: {
        cik: string,
        timePeriod: TimePeriod,
        quarterlyData: QuarterlyData
    }): PeriodicData[] {
        return this.roicFunction.calculate(data);
    }

    public async calculateBenchmarkRatioPrice(data: {
        industry: string,
        quarterlyData: QuarterlyData
    }): Promise<number> {
        return this.benchmarkRatioPriceFunction.calculate(data);
    }

    public calculateAverageOverPeriod(data: {
        periodicData: PeriodicData[],
        numPeriods: number,
        minimum?: number,
        errorMessage?: string
    }): number {
        return this.averageOverPeriodFunction.calculate(data);
    }

    public calculatePeriodicGrowthRates(data: {
        cik: string,
        periodicData: PeriodicData[]
    }): PeriodicData[] {
        return this.periodicGrowthRatesFunction.calculate(data);
    }

    public calculateStickerPrice(data: {
        cik: string, 
        equityGrowthRate: number,
        annualPE: PeriodicData[],
        annualEPS: PeriodicData[],
        analystGrowthEstimate?: number
    }): number {
        return this.stickerPriceFunction.calculate(data);
    }
    
}

export default CalculatorService;