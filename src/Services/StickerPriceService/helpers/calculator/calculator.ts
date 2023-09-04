import BvpsFunction from "./functions/BvpsFunction";
import Discount from "@/resources/entities/discount/IDiscount";
import PeFunction from "./functions/PeFunction";
import RoicFunction from "./functions/RoicFunction";
import StickerPriceData from "@/resources/entities/facts/IStickerPriceData";
import StickerPriceOutput from "./outputs/StickerPriceOutput";
import TrailingPriceData from "@/resources/entities/discount/models/TrailingPriceData";
import InsufficientDataException from "@/utils/exceptions/InsufficientDataException";
import { checkValuesMeetRequirements } from "../../../../Services/StickerPriceService/utils/DisqualificationUtils";
import { PeriodicData } from "@/resources/entities/models/PeriodicData";
import { annualizeByAdd, annualizeByLastQuarter } from "../../../../Services/StickerPriceService/utils/QuarterlyDataUtils";
import { BigFive, StickerPriceInput } from "./calculator.typings";

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
        return this.calculatePeriodicData(data)
            .then(async (periodicData: PeriodicData[][]) => {
                const [ quarterlyBVPS, annualPE, quarterlyROIC ] = periodicData;
                const annualEPS = annualizeByAdd(data.cik, data.quarterlyEPS);
                const input: StickerPriceInput = {
                    data: data,
                    growthRates: this.calculateGrowthRates(data.cik, quarterlyBVPS),
                    annualPE: annualPE,
                    annualBVPS: this.bvpsFunction.annualize(data.cik, quarterlyBVPS),
                    annualEPS: annualEPS,
                    analystGrowthEstimate: 0 //ToDo: Add growth estimate service
                }
                const bigFive: BigFive = {
                    annualROIC: this.roicFunction.annualize(data.cik, quarterlyROIC),
                    annualEPS: annualEPS,
                    annualEquity: annualizeByLastQuarter(data.cik, data.quarterlyTotalEquity),
                    annualRevenue: annualizeByAdd(data.cik, data.quarterlyRevenue)
                }
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
                            quarterlyBVPS: quarterlyBVPS,
                            quarterlyPE: annualPE,
                            quarterlyEPS: data.quarterlyEPS,
                            quarterlyROIC: quarterlyROIC,
                            annualROIC: bigFive.annualROIC
                        }
                    });
        });
    }

    private async calculatePeriodicData(data: StickerPriceData): Promise<PeriodicData[][]> {
        return Promise.all([
            this.calculateQuarterlyBVPS(data),
            this.calculateAnnualPE(data),
            this.calculateQuarterlyROIC(data)])
        .then(PeriodicData => {
            console.log("Finished calculating quarterly data for " + data.cik);
            return PeriodicData;
        })
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
    private async calculateQuarterlyBVPS(stickerPriceData: StickerPriceData): Promise<PeriodicData[]> {
        return this.bvpsFunction.calculate(stickerPriceData);
    }

    private async calculateAnnualPE(stickerPriceData: StickerPriceData): Promise<PeriodicData[]> {
        return this.peFunction.calculate(stickerPriceData);
    }

    private async calculateQuarterlyROIC(stickerPriceData: StickerPriceData): Promise<PeriodicData[]> {
        return this.roicFunction.calculate(stickerPriceData);
    }

    private calculateGrowthRates(cik: string, quarterlyBVPS: PeriodicData[]): Record<number, number> {
        try {
            const annualBVPS = this.bvpsFunction.annualize(cik, quarterlyBVPS);
            const annualBVPSGrowthRates = this.calculateAnnualGrowthRates(cik, annualBVPS);
            const tyy_BVPS_growth = annualBVPSGrowthRates[annualBVPSGrowthRates.length - 1].value;
            const tfy_BVPS_growth = annualBVPSGrowthRates.slice(-5).map(period => period.value).reduce((a, b) => a + b) / 5;
            const tty_BVPS_growth = annualBVPSGrowthRates.slice(-10).map(period => period.value).reduce((a, b) => a + b) / 10;
            return { 1: tyy_BVPS_growth, 5: tfy_BVPS_growth, 10: tty_BVPS_growth };
        } catch (error: any) {
            throw new InsufficientDataException(`Insufficient data collected to calcuate growth rates for ${cik}`);
        }
    }

    private calculateAnnualGrowthRates(cik: string, data: PeriodicData[]): PeriodicData[] {
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
    
}

export default Calculator;