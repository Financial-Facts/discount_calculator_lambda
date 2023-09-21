import BenchmarkService from "./services/benchmark/benchmark.service";
import DiscountService from "./services/discount/discount.service";
import HistoricalPriceService from "./services/historical-price/historical-price.service";
import StatementService from "./services/financial-modeling-prep/statement/statement.service";
import StickerPriceService from "./services/sticker-price/sticker-price.service";
import EnvInitializationException from "./utils/exceptions/EnvInitializationException";
import ProfileService from "./services/financial-modeling-prep/profile/profile.service";
import CalculatorService from "./services/calculator/calculator.service";

let discountService: DiscountService;
let statementService: StatementService;
let historicalPriceService: HistoricalPriceService;
let stickerPriceService: StickerPriceService;
let benchmarkService: BenchmarkService;
let profileService: ProfileService;
let calculatorService: CalculatorService;

export default function bootstrap() {
    // FFS Services
    discountService = initDiscountService();

    // FMP Services
    const fmpServices = initFinancialModelingPrepServices();
    profileService = fmpServices.profileService;
    statementService = fmpServices.statementService;

    // Business Logic Services
    historicalPriceService = initHistoricalPriceService();
    stickerPriceService = new StickerPriceService();
    calculatorService = new CalculatorService();
    benchmarkService = initBenchmarkService();
}

function initDiscountService(): DiscountService {
    const ffs_base_url = process.env.ffs_base_url ?? 'http://localhost:8080';
    return new DiscountService(ffs_base_url);
}

function initFinancialModelingPrepServices(): { profileService: ProfileService, statementService: StatementService } {
    const fmp_base_url = process.env.fmp_base_url;
    const fmp_api_key = process.env.fmp_api_key;
    if (!fmp_base_url || !fmp_api_key) {
        throw new EnvInitializationException('FMP key or base url not provided');
    }
    return {
        profileService: new ProfileService(fmp_base_url, fmp_api_key),
        statementService: new StatementService(fmp_base_url, fmp_api_key)
    }
}

function initHistoricalPriceService(): HistoricalPriceService {
    const historical_price_url = process.env.historical_data_source_url_v1;
    if (!historical_price_url) {
        throw new EnvInitializationException('Historical price data source url not provided');
    }
    return new HistoricalPriceService(historical_price_url);
}

function initBenchmarkService(): BenchmarkService {
    const benchmark_source_url = process.env.benchmark_source_url;
    if (!benchmark_source_url) {
        throw new EnvInitializationException('Benchmark source url not provided');
    }
    return new BenchmarkService(benchmark_source_url);
}

export { 
    discountService,
    statementService,
    historicalPriceService,
    stickerPriceService,
    profileService,
    benchmarkService,
    calculatorService
}



