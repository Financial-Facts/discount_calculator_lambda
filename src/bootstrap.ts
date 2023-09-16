import CONSTANTS from "./resources/resource.contants";
import DiscountService from "./services/discount/discount.service";
import HistoricalPriceService from "./services/historical-price/HistoricalPriceService";
import StatementService from "./services/statement/StatementService";
import StickerPriceService from "./services/sticker-price/sticker-price.service";

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



