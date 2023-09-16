export interface FinancialDataListWrapper {
    quoteSummary: {
        result: FinancialDataWrapper[];
    },
    error: string
}

export interface FinancialDataWrapper {
    financialData: FinancialData;
}

export interface FinancialData {
    currentPrice: {
        raw: number,
        fmt: string
    }
}