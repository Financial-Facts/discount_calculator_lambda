import BvpsFunction from "./functions/BvpsFunction";
import Discount from "@/resources/entities/discount/IDiscount";
import PeFunction from "./functions/PeFunction";
import RoicFunction from "./functions/RoicFunction";
import StickerPriceData from "@/resources/entities/facts/IStickerPriceData";
import StickerPriceOutput from "./outputs/StickerPriceOutput";
import TrailingPriceData from "@/resources/entities/discount/models/TrailingPriceData";
import { checkValuesMeetRequirements } from "../../../../Services/StickerPriceService/utils/DisqualificationUtils";
import { PeriodicData } from "@/resources/entities/models/PeriodicData";
import { annualizeByAdd } from "../../../../Services/StickerPriceService/utils/QuarterlyDataUtils";
import { BigFive, StickerPriceInput } from "./calculator.typings";
import { buildBigFive, buildStickerPriceInput } from "./calculator.utils";
import BenchmarkRatioPriceOutput from "./outputs/BenchmarkRatioPriceOutput";

class Calculator {

    // Functions
    private bvpsFunction: BvpsFunction;
    private peFunction: PeFunction;
    private roicFunction: RoicFunction;

    // Outputs
    private stickerPriceOutput: StickerPriceOutput;
    private benchmarkRatioPriceOutput: BenchmarkRatioPriceOutput;

    constructor() {
        this.bvpsFunction = new BvpsFunction();
        this.peFunction = new PeFunction();
        this.roicFunction = new RoicFunction();
        this.stickerPriceOutput = new StickerPriceOutput();
        this.benchmarkRatioPriceOutput = new BenchmarkRatioPriceOutput();
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
            const ttmRevenue = bigFive.annualRevenue.slice(-1)[0].value;
            const sharesOutstanding = data.quarterlyOutstandingShares.slice(-1)[0].value;
            return Promise.all([
                this.calculateTrailingPriceData(input),
                this.calculateBenchmarkRatioPrice(ttmRevenue, sharesOutstanding)])
            .then(async outputs => {
                const [ trailingPriceData, benchmarkRatioPrice] = outputs;
                console.log(trailingPriceData);
                console.log(benchmarkRatioPrice);
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
        return this.calculateAnnualROIC(data).then(annualROIC => buildBigFive(data, annualROIC, annualEPS));
    }

    private async calculateStickerPriceInput(data: StickerPriceData, annualEPS: PeriodicData[]): Promise<StickerPriceInput> {
        return Promise.all([
            this.calculateAnnualPE(data),
            this.calculateAnnualBVPS(data)
        ]).then(async (periodicData: PeriodicData[][]) => {
            const [ annualPE, annualBVPS ] = periodicData;
            return buildStickerPriceInput(data, annualPE, annualBVPS, annualEPS)
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
                    annualPE: input.annualPE.slice(0, 10),
                    currentQuarterlyEPS: input.annualEPS[input.annualEPS.length - 1].value,
                    analystGrowthEstimate: input.analystGrowthEstimate}));
                });
        return Promise.all(trailingPricePromises)
            .then(trailingPriceData => {
                console.log("Finished calculating trailing price data for " + input.data.cik);
                return trailingPriceData;
            });     
    }

    private async calculateBenchmarkRatioPrice(ttmRevenue: number, sharesOutstanding: number): Promise<number> {
        return this.benchmarkRatioPriceOutput.submit({
            ttmRevenue: ttmRevenue,
            sharesOutstanding: sharesOutstanding
        })
    }

    private async calculateAnnualBVPS(stickerPriceData: StickerPriceData): Promise<PeriodicData[]> {
        return this.bvpsFunction.calculate(stickerPriceData);
    }

    private async calculateAnnualPE(stickerPriceData: StickerPriceData): Promise<PeriodicData[]> {
        return this.peFunction.calculate(stickerPriceData);
    }

    private async calculateAnnualROIC(stickerPriceData: StickerPriceData): Promise<PeriodicData[]> {
        return this.roicFunction.calculate(stickerPriceData);
    }
    
}

export default Calculator;