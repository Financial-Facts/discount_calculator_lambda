import HistoricalPriceService from "./Services/HistoricalPriceService/HistoricalPriceService";
import DiscountService from "./resources/services/discount/discount.service";
import CONSTANTS from "./Services/ServiceConstants";
import StickerPriceService from "./Services/StickerPriceService/StickerPriceService";
import StatementService from "./resources/services/StatementService";

let discountService: DiscountService;
let statementService: StatementService;
let historicalPriceService: HistoricalPriceService;
let stickerPriceService: StickerPriceService;

export default function bootstrap() {
    // Financial Facts Services
    const ffs_base_url = process.env.ffs_base_url ?? 'http://localhost:8080';
    discountService = new DiscountService(ffs_base_url);
    statementService = new StatementService(ffs_base_url);

    // Business Logic Services
    const historical_price_url = process.env.historical_data_source_url_v1 ?? CONSTANTS.GLOBAL.EMPTY;
    historicalPriceService = new HistoricalPriceService(historical_price_url);
    stickerPriceService = new StickerPriceService();
}

export { 
    discountService,
    statementService,
    historicalPriceService,
    stickerPriceService
}



