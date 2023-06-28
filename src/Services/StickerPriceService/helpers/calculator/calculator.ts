import PriceData from "../../../HistoricalPriceService/models/PriceData";
import AbstractFunction from "./functions/AbstractFunction";
import BvpsFunction from "./functions/BvpsFunction";
import QuarterlyData from "@/resources/entities/models/QuarterlyData";
import Discount from "@/resources/entities/discount/IDiscount";
import Identity from "@/resources/entities/Identity";
import PeFunction from "./functions/PeFunction";
import InsufficientDataException from "../../../../exceptions/InsufficientDataException";
import RoicFunction from "./functions/RoicFunction";
import CONSTANTS from "Services/ServiceConstants";
import StickerPriceData from "@/resources/entities/facts/IStickerPriceData";

export type Variable = 'SHAREHOLDER_EQUITY' | 'OUTSTANDING_SHARES' | 'EPS' | 'LONG_TERM_DEBT';
export type Variables = Record<Variable, QuarterlyData[]>;

class Calculator {

    private identity: Identity;
    private functions: Record<string, AbstractFunction>;
    private variables: Variables;

    constructor(stickerPriceData: StickerPriceData) {
        this.identity = stickerPriceData.identity;
        this.variables = {
            SHAREHOLDER_EQUITY: stickerPriceData.quarterlyShareholderEquity,
            OUTSTANDING_SHARES: stickerPriceData.quarterlyOutstandingShares,
            EPS: stickerPriceData.quarterlyEPS,
            LONG_TERM_DEBT: stickerPriceData.quarterlyLongTermDebt
        }
        this.functions = {
            'bvps': new BvpsFunction(this.identity.cik, this.variables),
            'pe': new PeFunction(this.identity, this.variables),
            'roic': new RoicFunction(this.variables)
        }
    }

    public async calculateStickerPriceData(): Promise<Discount | null> {
        return Promise.all([
            this.calculateQuarterlyBVPS()])
        .then((data: QuarterlyData[][]) => {
            const [ quarterlyBVPS ] = data;
            const { tyy_BVPS_growth, tfy_BVPS_growth, tty_BVPS_growth } = this.calculateGrowthRates(data[0]);
            return Promise.all([
                this.calculateQuarterlyPE(),
                this.calculateQuarterlyROIC()])
            .then((data: QuarterlyData[][]) => {
                const [ quarterlyPE, quarterlyROIC ] = data;
                return {
                    cik: this.identity.cik,
                    symbol: this.identity.symbol,
                    name: this.identity.name,
                    ratioPrice: 0,
                    lastUpdated: new Date(),
                    ttmPriceData: [],
                    tfyPriceData: [],
                    ttyPriceData: [],
                    quarterlyBVPS: quarterlyBVPS,
                    quarterlyPE: quarterlyPE,
                    quarterlyEPS: this.variables.EPS,
                    quarterlyROIC: quarterlyROIC,
                }
            });
        });
    }

    private async calculateQuarterlyBVPS(): Promise<QuarterlyData[]> {
        return (this.functions['bvps'] as BvpsFunction).calculate();
    }

    private async calculateQuarterlyPE(): Promise<QuarterlyData[]> {
        return (this.functions['pe'] as PeFunction).calculate();
    }

    private async calculateQuarterlyROIC(): Promise<QuarterlyData[]> {
        return (this.functions['roic'] as RoicFunction).calculate();
    }

    private calculateGrowthRates(quarterlyBVPS: QuarterlyData[]): { tyy_BVPS_growth: number, tfy_BVPS_growth: number, tty_BVPS_growth: number } {
        try {
            const bvpsFunction: BvpsFunction = this.functions['bvps'] as BvpsFunction;
            const { lastQuarters, annualBVPS } = bvpsFunction.getLastQuarterAndAnnualizedData(quarterlyBVPS);
            const tyy_BVPS_growth = (Math.pow(lastQuarters[lastQuarters.length - 1] / lastQuarters[0], (1/1)) - 1) * 100;
            const tfy_BVPS_growth = (Math.pow(annualBVPS[annualBVPS.length - 1].value / annualBVPS[annualBVPS.length - 5].value, (1/5)) - 1) * 100;
            const tty_BVPS_growth = (Math.pow(annualBVPS[annualBVPS.length - 1].value / annualBVPS[annualBVPS.length - 10].value, (1/10)) - 1) * 100;
            return { tyy_BVPS_growth, tfy_BVPS_growth, tty_BVPS_growth }
        } catch (error: any) {
            throw new InsufficientDataException(`Insufficient data collected to calcuate growth rates for ${this.identity.name}`);
        }
    }

}

export default Calculator;