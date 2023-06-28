import QuarterlyData from "@/resources/entities/models/QuarterlyData";
import AbstractFunction from "./AbstractFunction";
import { Variables } from "../calculator";

class RoicFunction extends AbstractFunction {

    private quarterlyNetIncome: QuarterlyData[];
    private quarterlyShareholderEquity: QuarterlyData[];
    private quarterlyLongTermDebt: QuarterlyData[];

    constructor(variables: Variables) {
        super();
        this.quarterlyNetIncome = [];
        this.quarterlyShareholderEquity = [];
        this.quarterlyLongTermDebt = variables.LONG_TERM_DEBT;
    }

    calculate(): QuarterlyData[] {
        return [];
    }

    async setVariables(variables: Variables): Promise<void> {
        // await Promise.all([
        //     this.retriever.retrieve_quarterly_net_income(),
        //     this.retriever.retrieve_quarterly_shareholder_equity(),
        //     this.retriever.retrieve_quarterly_long_term_debt()])
        // .then(data => {
        //     this.quarterlyNetIncome = data[0];
        //     this.quarterlyShareholderEquity = data[1];
        //     this.quarterlyLongTermDebt = data[2];
        //     console.log(this.quarterlyLongTermDebt);
        // });
        return Promise.resolve();
    }

    annualize(quarterlyData: QuarterlyData[]): QuarterlyData[] {
        throw new Error("Method not implemented.");
    }
    
}

export default RoicFunction;