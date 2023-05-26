import CONSTANTS from "Services/ServiceConstants";
import { TaxonomyType } from "Services/StickerPriceService/models/TaxonomyType";
import DataRetrievalException from "exceptions/DataRetrievalException";

class Parser {

    private facts: any;

    constructor(facts: any) {
        this.facts = facts;
    }

    public retrieve_quarterly_data(
        factsKeys: string[],
        taxonomyType: TaxonomyType,
        deiFactsKeys: string[]
    ): any[] {
        const data = this.parse_facts_for_data(factsKeys, taxonomyType, deiFactsKeys);
        const hasStartDate = this.checkHasStartDate(data);
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
            keys.forEach(key => {
                if (this.facts[taxonomyType][key]) {
                    return this.facts[taxonomyType][key];
                }
            });
        } else {
            keys.forEach(key => {
                if (this.facts[CONSTANTS.STICKER_PRICE.DEI][key]) {
                    return this.facts[CONSTANTS.STICKER_PRICE.DEI][key];
                }
            });
        }
        return null;
    }

    private checkHasStartDate(data: any): boolean {
        const units = data[CONSTANTS.STICKER_PRICE.UNITS];
        const quarter = units[Object.keys(units)[0]][0];
        return quarter.start !== undefined && quarter.start !== null;
    }

}

export default Parser;