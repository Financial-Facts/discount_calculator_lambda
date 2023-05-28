import PriceData from "../../../HistoricalPriceService/models/PriceData";
import CalculatedData from "./models/CalculatedData";
import AbstractFunction from "./functions/AbstractFunction";
import BvpsFunction from "./functions/BvpsFunction";

class Calculator {

    private cik: string;
    private h_data: PriceData[];
    private facts: any;
    private function: AbstractFunction | undefined;

    constructor(cik: string, h_data: PriceData[], facts: any) {
        this.cik = cik;
        this.h_data = h_data;
        this.facts = facts;
    }

    public calculateStickerPriceData(): CalculatedData {
        this.function = new BvpsFunction(this.cik, this.facts);
        this.function.setVariables();
        return {
            trailing_years: [],
            sticker_price: [],
            sale_price: [],
            ratio_price: []
        }
    }

}

export default Calculator;