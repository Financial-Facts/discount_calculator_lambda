import CONSTANTS from "./resources/resource.contants";
import DiscountService from "./services/discount/discount.service";
import HistoricalPriceService from "./services/historical-price/historical-price.service";
import StatementService from "./services/statement/statement.service";
import StickerPriceService from "./services/sticker-price/sticker-price.service";
import EnvInitializationException from "./utils/exceptions/EnvInitializationException";

let discountService: DiscountService;
let statementService: StatementService;
let historicalPriceService: HistoricalPriceService;
let stickerPriceService: StickerPriceService;

export default function bootstrap() {
    // Financial Facts Services
    const ffs_base_url = process.env.ffs_base_url ?? 'http://localhost:8080';
    discountService = new DiscountService(ffs_base_url);

    const fmp_base_url = process.env.fmp_base_url;
    const fmp_api_key = process.env.fmp_api_key;
    if (!fmp_base_url || !fmp_api_key) {
        throw new EnvInitializationException('FMP key or base url not provided');
    }
    statementService = new StatementService(fmp_base_url, fmp_api_key);

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



