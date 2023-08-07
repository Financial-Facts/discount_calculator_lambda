import BvpsFunction from "./functions/BvpsFunction";
import QuarterlyData from "@/resources/entities/models/QuarterlyData";
import Discount from "@/resources/entities/discount/IDiscount";
import PeFunction from "./functions/PeFunction";
import RoicFunction from "./functions/RoicFunction";
import StickerPriceData from "@/resources/entities/facts/IStickerPriceData";
import StickerPriceOutput from "./outputs/StickerPriceOutput";
import TrailingPriceData from "@/resources/entities/discount/models/TrailingPriceData";
import HistoricalPriceService from "../../../../Services/HistoricalPriceService/HistoricalPriceService";
import { annualizeByAdd } from "../../utils/QuarterlyDataUtils";
import InsufficientDataException from "@/utils/exceptions/InsufficientDataException";
import { checkValuesMeetRequirements } from "../../../../Services/StickerPriceService/utils/DisqualificationUtils";
import StickerPriceInput from "./models/StickerPriceInput";

class Calculator {

    private bvpsFunction: BvpsFunction;
    private peFunction: PeFunction;
    private roicFunction: RoicFunction;
    private stickerPriceOutput: StickerPriceOutput;
    
    constructor(historicalPriceService: HistoricalPriceService) {
        this.bvpsFunction = new BvpsFunction();
        this.peFunction = new PeFunction(historicalPriceService);
        this.roicFunction = new RoicFunction();
        this.stickerPriceOutput = new StickerPriceOutput();
    }

    public async calculateStickerPriceData(data: StickerPriceData): Promise<Discount> {
        console.log("In calculator calculating sticker price for CIK: " + data.cik);
        return this.calculateQuarterlyData(data)
            .then(async (quarterlyData: QuarterlyData[][]) => {
                const [ quarterlyBVPS, quarterlyPE, quarterlyROIC ] = quarterlyData;
                const input: StickerPriceInput = {
                    data: data,
                    growthRates: this.calculateGrowthRates(data.cik, quarterlyBVPS),
                    annualPE: this.peFunction.annualize(data.cik, quarterlyPE),
                    annualBVPS: this.bvpsFunction.annualize(data.cik, quarterlyBVPS),
                    annualROIC: this.roicFunction.annualize(data.cik, quarterlyROIC),
                    annualEPS: annualizeByAdd(data.cik, data.quarterlyEPS),
                    analystGrowthEstimate: 0 //ToDo: Add growth estimate service
                }
                checkValuesMeetRequirements(input);
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
                            quarterlyPE: quarterlyPE,
                            quarterlyEPS: data.quarterlyEPS,
                            quarterlyROIC: quarterlyROIC,
                            annualROIC: this.roicFunction.annualize(data.cik, quarterlyROIC)
                        }
                    });
        });
    }

    private async calculateQuarterlyData(data: StickerPriceData): Promise<QuarterlyData[][]> {
        return Promise.all([
            this.calculateQuarterlyBVPS(data),
            this.calculateQuarterlyPE(data),
            this.calculateQuarterlyROIC(data)])
        .then(quarterlyData => {
            console.log("Finished calculating quarterly data for " + data.cik);
            return quarterlyData;
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
                    input.annualPE,
                    input.data.quarterlyEPS[input.data.quarterlyEPS.length - 1].value,
                    input.analystGrowthEstimate));
                });
        return Promise.all(trailingPricePromises)
            .then(trailingPriceData => {
                console.log("Finished calculating trailing price data for " + input.data.cik);
                return trailingPriceData;
            });
                
    }
    private async calculateQuarterlyBVPS(stickerPriceData: StickerPriceData): Promise<QuarterlyData[]> {
        return this.bvpsFunction.calculate(stickerPriceData);
    }

    private async calculateQuarterlyPE(stickerPriceData: StickerPriceData): Promise<QuarterlyData[]> {
        return this.peFunction.calculate(stickerPriceData);
    }

    private async calculateQuarterlyROIC(stickerPriceData: StickerPriceData): Promise<QuarterlyData[]> {
        return this.roicFunction.calculate(stickerPriceData);
    }

    private calculateGrowthRates(cik: string, quarterlyBVPS: QuarterlyData[]): Record<number, number> {
        try {
            const { lastQuarters, annualBVPS } = this.bvpsFunction.getLastQuarterAndAnnualizedData(cik, quarterlyBVPS);
            const tyy_BVPS_growth = (Math.pow(lastQuarters[lastQuarters.length - 1] / lastQuarters[0], (1/1)) - 1) * 100;
            const tfy_BVPS_growth = (Math.pow(annualBVPS[annualBVPS.length - 1].value / annualBVPS[annualBVPS.length - 5].value, (1/5)) - 1) * 100;
            const tty_BVPS_growth = (Math.pow(annualBVPS[annualBVPS.length - 1].value / annualBVPS[annualBVPS.length - 10].value, (1/10)) - 1) * 100;
            return { 1: tyy_BVPS_growth, 5: tfy_BVPS_growth, 10: tty_BVPS_growth };
        } catch (error: any) {
            throw new InsufficientDataException(`Insufficient data collected to calcuate growth rates for ${cik}`);
        }
    }
}

export default Calculator;