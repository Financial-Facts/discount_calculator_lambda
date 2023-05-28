import CONSTANTS from "../../../ServiceConstants";
import { TaxonomyType } from "../../models/TaxonomyType";
import DataRetrievalException from "../../../../exceptions/DataRetrievalException";
import { days_between } from "../../../../Services/StickerPriceService/utils/StickerPriceUtils";
import QuarterlyData from "@/resources/discount/models/QuarterlyData";
import UnitsData from "./models/UnitsData";

class Parser {

    private facts: any;

    constructor(facts: any) {
        this.facts = facts;
    }

    public retrieve_quarterly_data(
        cik: string,
        factsKeys: string[],
        taxonomyType: TaxonomyType,
        deiFactsKeys: string[] = []
    ): QuarterlyData[] {
        const data = this.parse_facts_for_data(factsKeys, taxonomyType, deiFactsKeys);
        const hasStartDate = this.checkHasStartDate(data);

        return hasStartDate ?
            this.populate_quarterly_data_with_start_date(cik, data) :
            this.populate_quarterly_data_without_start_date(cik, data);
    }

    private parse_facts_for_data(
        factsKeys: string[],
        taxonomyType: TaxonomyType,
        deiFactsKeys: string[]
    ): UnitsData {
        let data: UnitsData | null;
        data = this.parse(factsKeys, taxonomyType);
        if (data === null) {
            data = this.parse(deiFactsKeys);
            if (data === null) {
                throw new DataRetrievalException(`Keys ${factsKeys} invalid`);
            }
        }
        return data;
    }

    private parse(
        keys: string[],
        taxonomyType?: TaxonomyType
    ): UnitsData | null {
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

    private populate_quarterly_data_with_start_date(cik: string, data: any): QuarterlyData[] {
        const quarterly_data: any[] = [];
        const processed_end_dates: string[] = []
        const key: string = data[CONSTANTS.STICKER_PRICE.UNITS].keys()[0];
        data[CONSTANTS.STICKER_PRICE.UNITS][key].array
            .forEach((period: any) => {
                if (period.end && 
                    !processed_end_dates.includes(period.end) &&
                    days_between(new Date(period.start), new Date(period.end)) < 105) {
                        // ToDo: Convert other currencies to USD
                        const val: QuarterlyData = {
                            cik: cik,
                            announcedDate: period.end,
                            value: period.val
                        }
                        quarterly_data.push(val);
                        processed_end_dates.push(period.end);
                    }
            });
        return quarterly_data;
    }

    private populate_quarterly_data_without_start_date(cik: string, data: any): QuarterlyData[] {
        const quarterly_data: any[] = [];
        const key = Object.keys(data.units)[0];
        const processed_end_dates: string[] = []
        data.units[key]
            .forEach((period: any) => {
                if (!processed_end_dates.includes(period.end)) {
                    const val: QuarterlyData = {
                        cik: cik,
                        announcedDate: period.end,
                        value: period.val
                    }
                    quarterly_data.push(val);
                    processed_end_dates.push(period.end);
                }
            });
        return quarterly_data;
    }
}

export default Parser;