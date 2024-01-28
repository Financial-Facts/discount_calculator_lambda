import { DebtYearsInput} from "@/resources/discount-manager/discount-manager.typings";
import AbstractFunction from "./AbstractFunction";
import { getLastPeriodValue, reduceTTM } from "@/utils/processing.utils";

class DebtYearsFunction extends AbstractFunction {

    calculate(data: {
        cik: string,
        quarterlyData: DebtYearsInput
    }): number {
        const quarterlyData = data.quarterlyData;
        const current_long_term_debt = getLastPeriodValue(quarterlyData.quarterlyLongTermDebt);
        const current_free_cash_flow = reduceTTM(quarterlyData.quarterlyFreeCashFlow, (a, b) => a + b);
        return current_long_term_debt / current_free_cash_flow;
    }
    
}

export default DebtYearsFunction;