import BenchmarkService from "@/services/benchmark/benchmark.service";
import HistoricalPriceService from "@/services/historical-price/historical-price.service";
import StatementService from "@/services/financial-modeling-prep/statement/statement.service";
import StickerPriceService from "@/services/sticker-price/sticker-price.service";
import EnvInitializationException from "@/utils/exceptions/EnvInitializationException";
import ProfileService from "@/services/financial-modeling-prep/profile/profile.service";
import CalculatorService from "@/services/calculator/calculator.service";
import DiscountManager from "./resources/discount-manager/discount-manager";
import DiscountedCashFlowService from "./services/financial-modeling-prep/discounted-cash-flow/discounted-cash-flow.service";
import SupabaseDiscountService from "./services/discount/supabase-discount/supabase-discount.service";
import { IDiscountService } from "./services/discount/discount-service.typings";
import DiscountService from "./services/discount/ffs-discount/discount.service";

let discountManager: DiscountManager;
let discountService: IDiscountService;
let statementService: StatementService;
let discountedCashFlowService: DiscountedCashFlowService;
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
    discountedCashFlowService = fmpServices.discountedCashFlowService;

    // Business Logic Services
    historicalPriceService = initHistoricalPriceService();
    stickerPriceService = new StickerPriceService();
    calculatorService = new CalculatorService();
    benchmarkService = initBenchmarkService();
    
    // Discount Manager
    discountManager = initDiscountManager();
    
    console.log('BOOTSTRAPPED SERVICES WITH:')
    console.log(`revisit machine arn: ${process.env.revisit_machine_arn}`);
    console.log(`ffs url: ${process.env.ffs_base_url}`);
    console.log(`fmp url: ${process.env.fmp_base_url}`);
    console.log(`fmp key: ${process.env.fmp_api_key}`);
    console.log(`supabase url: ${process.env.supabase_base_url}`);
    console.log(`historical source url: ${process.env.historical_data_source_url_v1}`);
    console.log(`Benchmark source url: ${process.env.benchmark_source_url}`);
}

function initDiscountManager(): DiscountManager {
    const revisitMachineArn = process.env.revisit_machine_arn;
    return new DiscountManager(revisitMachineArn);
}

function initDiscountService(): IDiscountService {
    if (process.env.ffs_base_url) {
        const ffs_base_url = process.env.ffs_base_url ?? 'http://localhost:8080';
        return new DiscountService(ffs_base_url);
    } 

    return initSupabaseService();
}

function initSupabaseService(): SupabaseDiscountService {
    const supabase_url = process.env.supabase_base_url;
    const supabase_key = process.env.supabase_key;
    if (!supabase_url || !supabase_key) {
        throw new EnvInitializationException('Supabase key or base url not provided');
    }
    return new SupabaseDiscountService(supabase_url, supabase_key);
}

function initFinancialModelingPrepServices(): {
    profileService: ProfileService,
    statementService: StatementService,
    discountedCashFlowService: DiscountedCashFlowService
} {
    const fmp_base_url = process.env.fmp_base_url;
    const fmp_api_key = process.env.fmp_api_key;
    if (!fmp_base_url || !fmp_api_key) {
        throw new EnvInitializationException('FMP key or base url not provided');
    }
    return {
        profileService: new ProfileService(fmp_base_url, fmp_api_key),
        statementService: new StatementService(fmp_base_url, fmp_api_key),
        discountedCashFlowService: new DiscountedCashFlowService(fmp_base_url, fmp_api_key)
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
    discountManager,
    discountService,
    statementService,
    historicalPriceService,
    stickerPriceService,
    profileService,
    benchmarkService,
    calculatorService,
    discountedCashFlowService
}



