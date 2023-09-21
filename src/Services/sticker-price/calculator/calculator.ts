import { BigFive, StickerPriceInput } from "@/services/calculator/calculator.typings";
import { Discount, TrailingPriceData } from "@/services/discount/discount.typings";
import { calculatorService } from "../../../bootstrap";
import { StickerPriceData, PeriodicData } from "../sticker-price.typings";
import { checkValuesMeetRequirements } from "../utils/disqualification.utils";
import { annualizeByAdd } from "../utils/periodic-data.utils";
import { buildBigFive, buildStickerPriceInput } from "./calculator.utils";
import StickerPriceOutput from "./outputs/StickerPriceOutput";

class Calculator {


    // Outputs
    private stickerPriceOutput: StickerPriceOutput;

    constructor() {
        this.stickerPriceOutput = new StickerPriceOutput();
    }

    public async calculateDiscount(data: StickerPriceData): Promise<Discount> {
        console.log("In calculator calculating sticker price for CIK: " + data.cik);
        const annualEPS = annualizeByAdd(data.cik, data.quarterlyEPS);
        return Promise.all([
            this.calculateStickerPriceInput(data, annualEPS),
            this.calculateBigFive(data, annualEPS)]) 
        .then(async inputs => {
            const [input, bigFive] = inputs;
            checkValuesMeetRequirements(input, bigFive);
            const benchmarkRatioPricePromise = calculatorService.calculateBenchmarkRatioPrice({
                industry: data.industry,
                quarterlyData: data
            });
            return Promise.all([
                this.calculateTrailingPriceData(input),
                benchmarkRatioPricePromise
            ]).then(async outputs => {
                const [ trailingPriceData, benchmarkRatioPrice ] = outputs;
                const [ ttmPriceData, tfyPriceData, ttyPriceData ] = trailingPriceData;
                return {
                    cik: data.cik,
                    symbol: data.symbol,
                    name: data.name,
                    active: false,
                    ratioPrice: benchmarkRatioPrice,
                    lastUpdated: new Date(),
                    ttmPriceData: ttmPriceData,
                    tfyPriceData: tfyPriceData,
                    ttyPriceData: ttyPriceData,
                    quarterlyBVPS: input.annualBVPS,
                    quarterlyPE: input.annualPE,
                    quarterlyEPS: bigFive.annualEPS,
                    quarterlyROIC: bigFive.annualROIC,
                    annualROIC: bigFive.annualROIC
                }
            });
        });
    }

    private async calculateBigFive(data: StickerPriceData, annualEPS: PeriodicData[]): Promise<BigFive> {
        const annualROIC = calculatorService.calculateROIC({
            cik: data.cik,
            timePeriod: 'A',
            quarterlyData: data
        });
        return buildBigFive(data, annualROIC, annualEPS);
    }

    private async calculateStickerPriceInput(data: StickerPriceData, annualEPS: PeriodicData[]): Promise<StickerPriceInput> {
        return calculatorService.calculatePE({
            cik: data.cik,
            timePeriod: 'A',
            symbol: data.symbol,
            quarterlyData: data
        }).then(annualPE => {
            const annualBVPS = calculatorService.calculateBVPS({
                cik: data.cik,
                timePeriod: 'A',
                quarterlyData: data
            });
            return buildStickerPriceInput(data, annualPE, annualBVPS, annualEPS);
        });
    }

    private async calculateTrailingPriceData(input: StickerPriceInput): Promise<TrailingPriceData[]> {
        const trailingPricePromises: Promise<TrailingPriceData>[] = [];
        Object.keys(input.growthRates)
            .forEach((key: string) => {
                const period: number = +key;
                trailingPricePromises.push(this.stickerPriceOutput.submit({
                    cik: input.data.cik,
                    equityGrowthRate: input.growthRates[period],
                    annualPE: input.annualPE.slice(-10),
                    currentQuarterlyEPS: input.annualEPS[input.annualEPS.length - 1].value,
                    analystGrowthEstimate: input.analystGrowthEstimate}));
                });
        return Promise.all(trailingPricePromises)
            .then(trailingPriceData => {
                console.log("Finished calculating trailing price data for " + input.data.cik);
                return trailingPriceData;
            });     
    }
    
}

export default Calculator;