import CONSTANTS from "../../../../ServiceConstants";
import { TaxonomyType } from "../../../models/TaxonomyType";
import GaapRetriever from "../GaapRetriever";
import InsufficientDataException from "../../../../../exceptions/InsufficientDataException";

class RetrieverFactory {

    constructor() {}

    public static getRetriever(cik: string, facts: any) {
        if (facts[CONSTANTS.STICKER_PRICE.FACTS][TaxonomyType.GAAP]) {
            return new GaapRetriever(cik, facts[CONSTANTS.STICKER_PRICE.FACTS]);
        }
        if (facts[CONSTANTS.STICKER_PRICE.FACTS][TaxonomyType.IFRS]) {
            // ToDo: return new IFRS Retriever
        }
        throw new InsufficientDataException('Error: Insufficient facts data')
    }
}

export default RetrieverFactory;