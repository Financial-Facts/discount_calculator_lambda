import Function from "./Function";


export interface DcfVariables {
    enterpriseValue: number,
    netDebt: number,
    dilutedSharesOutstanding: number
}

class DcfFunction implements Function<DcfVariables, number> {

    calculate(variables: DcfVariables): number {
        const intrinsicValue = variables.enterpriseValue - variables.netDebt;
        return intrinsicValue / variables.dilutedSharesOutstanding;
    }
    
}

export default DcfFunction;