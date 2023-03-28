import getHistoricalPrices from 'yahoo-stock-api';

export enum frequency {
    DAILY = '1d',
    WEEKLY = '1wk',
    MONTHLY = '1mo'
}

export interface HistoricalPriceInput {
    symbol: string;
    startDate: Date;
    endDate: Date;
    frequency: frequency
}

class HistoricalPriceService {

    private HistoricalPriceDataSource: getHistoricalPrices;

    constructor() {
        this.HistoricalPriceDataSource = new getHistoricalPrices();
    }

    public getHistoricalPrices(input: HistoricalPriceInput): any {
        return this.HistoricalPriceDataSource.getHistoricalPrices(input);
    }
}

export default HistoricalPriceService;