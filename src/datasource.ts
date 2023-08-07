import HistoricalPriceService from "./Services/HistoricalPriceService/HistoricalPriceService";
import StickerPriceService from "./Services/StickerPriceService/StickerPriceService";
import DiscountService from "./resources/services/DiscountService";
import FactsService from "./resources/services/FactsService";
import IdentityService from "./resources/services/IdentityService";

class DataSource {

    discountService: DiscountService;
    factsService: FactsService;
    identityService: IdentityService;
    historicalPriceService: HistoricalPriceService;
    stickerPriceService: StickerPriceService;

    constructor() {
        console.log('Initializing data source...');
        this.factsService = new FactsService();
        this.identityService = new IdentityService();
        this.historicalPriceService = new HistoricalPriceService();
        this.stickerPriceService = new StickerPriceService(this.factsService, this.historicalPriceService);
        this.discountService = new DiscountService(this.historicalPriceService, this.stickerPriceService);
    }
}

export default DataSource;