import Function from "./Function";


export interface WaccVariables {
    cik: string,
    price: number,
    dilutedSharesOutstanding: number,
    totalDebt: number, 
    totalEquity: number,
    costOfEquity: number,
    costofDebt: number,
    taxRate: number
}

class WaccFunction implements Function<WaccVariables, number> {

    calculate(variables: WaccVariables): number {
        const totalCapital = variables.dilutedSharesOutstanding * variables.price + variables.totalDebt;
        const equityWeighting = variables.totalEquity / totalCapital;
        const debtWeighting = variables.totalDebt / totalCapital;
        return (equityWeighting * variables.costOfEquity) + (debtWeighting * variables.costofDebt * (1 - (variables.taxRate / 100)));
    }
    
}

export default WaccFunction;