import QuarterlyData from "@/resources/discount/models/QuarterlyData";
import AbstractFunction from "./AbstractFunction";
import AbstractRetriever from "../../retriever/AbstractRetriever";

class RoicFunction extends AbstractFunction {

    private quarterlyNetIncome: QuarterlyData[];
    private quarterlyShareholderEquity: QuarterlyData[];
    private quarterlyLongTermDebt: QuarterlyData[];

    constructor(retriever: AbstractRetriever) {
        super(retriever);
        this.quarterlyNetIncome = [];
        this.quarterlyShareholderEquity = [];
        this.quarterlyLongTermDebt = [];
    }

    calculate(): QuarterlyData[] {
        return [];
    }

    async setVariables(): Promise<void> {
        await Promise.all([
            this.retriever.retrieve_quarterly_net_income()
        ])
        .then(data => {
            this.quarterlyNetIncome = data[0];
        });
        return Promise.resolve();
    }

    annualize(quarterlyData: QuarterlyData[]): QuarterlyData[] {
        throw new Error("Method not implemented.");
    }
    
}

export default RoicFunction;