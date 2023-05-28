import CONSTANTS from "../../../ServiceConstants";
import { TaxonomyType } from "../../models/TaxonomyType";
import DataRetrievalException from "../../../../exceptions/DataRetrievalException";
import { days_between } from "../../../../Services/StickerPriceService/utils/StickerPriceUtils";

class Parser {

    private facts: any;

    constructor(facts: any) {
        this.facts = facts;
    }

    public retrieve_quarterly_data(
        factsKeys: string[],
        taxonomyType: TaxonomyType,
        deiFactsKeys: string[] = []
    ): any[] {
        const data = this.parse_facts_for_data(factsKeys, taxonomyType, deiFactsKeys);
        const hasStartDate = this.checkHasStartDate(data);
        let quarterly_data: any;

        quarterly_data = hasStartDate ?
            this.populate_quarterly_data_with_start_date(data) :
            this.populate_quarterly_data_without_start_date(data);

        console.log(quarterly_data);
        return [data];
    }

    private parse_facts_for_data(
        factsKeys: string[],
        taxonomyType: TaxonomyType,
        deiFactsKeys: string[]
    ): any {
        let data: any;
        data = this.parse(factsKeys, taxonomyType);
        if (data === null) {
            data = this.parse(deiFactsKeys);
            if (data === null) {
                throw new DataRetrievalException('type not provided');
            }
        }
        return data;
    }

    private parse(
        keys: string[],
        taxonomyType?: TaxonomyType
    ): any {
        if (taxonomyType) {
            const key: string | undefined = keys.find(key => {
                if (this.facts[taxonomyType][key]) {
                    return true;
                }
            });
            if (key) {
                return this.facts[taxonomyType][key];
            }
        } else {
            const key: string | undefined = keys.find(key => {
                if (this.facts[CONSTANTS.STICKER_PRICE.DEI][key]) {
                    return true;
                }
            });
            if (key) {
                return this.facts[CONSTANTS.STICKER_PRICE.DEI][key];
            }
        }
        return null;
    }

    private checkHasStartDate(data: any): boolean {
        const units = data[CONSTANTS.STICKER_PRICE.UNITS];
        const quarter = units[Object.keys(units)[0]][0];
        return quarter.start !== undefined && quarter.start !== null;
    }

    private populate_quarterly_data_with_start_date(data: any): any[] {
        const quarterly_data: any[] = [];
        const processed_end_dates: string[] = []
        const key: string = data[CONSTANTS.STICKER_PRICE.UNITS].keys()[0];
        data[CONSTANTS.STICKER_PRICE.UNITS][key].array
            .forEach((period: any) => {
                if (period.end && 
                    !processed_end_dates.includes(period.end) &&
                    days_between(new Date(period.start), new Date(period.end)) < 105) {
                        // ToDo: Convert other currencies to USD
                        const val = {
                            [period.end as string]: period.val
                        }
                        quarterly_data.push(val);
                        processed_end_dates.push(period.end);
                    }
            });
        return quarterly_data;
    }

    private populate_quarterly_data_without_start_date(data: any): any[] {
        const quarterly_data: any[] = [];
        let isShares = false;
        const key = Object.keys(data.units)[0];
        console.log(data.units[key])
        data.units[key]
            .forEach((period: any) => {
                let amount: number = period.val;
                const val = {
                    [period.end]: amount
                }
                quarterly_data.push(val);
            });
        return quarterly_data;
    }
}

export default Parser;