import BvpsFunction from "./functions/BvpsFunction";
import Discount from "@/resources/entities/discount/IDiscount";
import PeFunction from "./functions/PeFunction";
import RoicFunction from "./functions/RoicFunction";
import StickerPriceData from "@/resources/entities/facts/IStickerPriceData";
import StickerPriceOutput from "./outputs/StickerPriceOutput";
import TrailingPriceData from "@/resources/entities/discount/models/TrailingPriceData";
import { checkValuesMeetRequirements } from "../../../../Services/StickerPriceService/utils/DisqualificationUtils";
import { PeriodicData } from "@/resources/entities/models/PeriodicData";
import { annualizeByAdd, annualizeByLastQuarter } from "../../../../Services/StickerPriceService/utils/QuarterlyDataUtils";
import { BigFive, StickerPriceInput } from "./calculator.typings";
import { buildBigFive, buildStickerPriceInput } from "./calculator.utils";

class Calculator {

    private bvpsFunction: BvpsFunction;
    private peFunction: PeFunction;
    private roicFunction: RoicFunction;
    private stickerPriceOutput: StickerPriceOutput;
    
    constructor() {
        this.bvpsFunction = new BvpsFunction();
        this.peFunction = new PeFunction();
        this.roicFunction = new RoicFunction();
        this.stickerPriceOutput = new StickerPriceOutput();
    }

    public async calculateStickerPriceData(data: StickerPriceData): Promise<Discount> {
        console.log("In calculator calculating sticker price for CIK: " + data.cik);
        const annualEPS = annualizeByAdd(data.cik, data.quarterlyEPS);
        return Promise.all([
            this.calculateStickerPriceInput(data, annualEPS),
            this.calculateBigFive(data, annualEPS)]) 
        .then(async inputs => {
            const [input, bigFive] = inputs;
            checkValuesMeetRequirements(input, bigFive);
            return this.calculateTrailingPriceData(input)
                .then(async trailingPriceData => {
                    const [ttmPriceData, tfyPriceData, ttyPriceData ] = trailingPriceData;
                    return {
                        cik: data.cik,
                        symbol: data.symbol,
                        name: data.name,
                        active: false,
                        ratioPrice: data.benchmarkRatioPrice,
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
        return this.calculateAnnualROIC(data).then(async annualROIC => buildBigFive(data, annualROIC, annualEPS));
    }

    private async calculateStickerPriceInput(data: StickerPriceData, annualEPS: PeriodicData[]): Promise<StickerPriceInput> {
        return Promise.all([
            this.calculateAnnualBVPS(data),
            this.calculateAnnualPE(data)
        ]).then(async (periodicData: PeriodicData[][]) => {
            const [ annualBVPS, annualPE ] = periodicData;
            return buildStickerPriceInput(data, annualBVPS, annualPE, annualEPS)
        });
    }

    private async calculateTrailingPriceData(input: StickerPriceInput): Promise<TrailingPriceData[]> {
        const trailingPricePromises: Promise<TrailingPriceData>[] = [];
        Object.keys(input.growthRates)
            .forEach((key: string) => {
                const period: number = +key;
                trailingPricePromises.push(this.stickerPriceOutput.submit(
                    input.data.cik,
                    input.growthRates[period],
                    input.annualPE.slice(0, 10),
                    input.annualEPS[input.annualEPS.length - 1].value,
                    input.analystGrowthEstimate));
                });
        return Promise.all(trailingPricePromises)
            .then(trailingPriceData => {
                console.log("Finished calculating trailing price data for " + input.data.cik);
                return trailingPriceData;
            });
                
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