import AbstractFunction from "./AbstractFunction";


class WaccFunction extends AbstractFunction {

    calculate(data: {
        cik: string,
        price: number,
        dilutedSharesOutstanding: number,
        totalDebt: number, 
        totalEquity: number,
        costOfEquity: number,
        costofDebt: number,
        taxRate: number
    }): number {
        const totalCapital = data.dilutedSharesOutstanding * data.price + data.totalDebt;
        const equityWeighting = data.totalEquity / totalCapital;
        const debtWeighting = data.totalDebt / totalCapital;
        return (equityWeighting * data.costOfEquity) + (debtWeighting * data.costofDebt * (1 - (data.taxRate / 100)));
    }
    
}

export default WaccFunction;