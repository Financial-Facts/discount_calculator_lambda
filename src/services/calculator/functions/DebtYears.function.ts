import { DebtYearsInput} from "@/resources/discount-manager/discount-manager.typings";
import Function from "./Function";
import { getLastPeriodValue, reduceTTM } from "@/utils/processing.utils";


export interface DebtYearsVariables {
    cik: string,
    quarterlyData: DebtYearsInput
}

class DebtYearsFunction implements Function<DebtYearsVariables, number> {

    calculate(variables: DebtYearsVariables): number {
        const quarterlyData = variables.quarterlyData;
        const current_long_term_debt = getLastPeriodValue(quarterlyData.quarterlyLongTermDebt);
        const current_free_cash_flow = reduceTTM(quarterlyData.quarterlyFreeCashFlow, (a, b) => a + b);
        return current_long_term_debt / current_free_cash_flow;
    }
    
}

export default DebtYearsFunction;