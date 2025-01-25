import BenchmarkService from "@/services/benchmark/benchmark.service";
import StatementService from "@/services/financial-modeling-prep/statement/statement.service";
import StickerPriceService from "@/services/sticker-price/sticker-price.service";
import EnvInitializationException from "@/utils/exceptions/EnvInitializationException";
import CompanyInformationService from "@/services/financial-modeling-prep/company-information/company-information.service";
import CalculatorService from "@/services/calculator/calculator.service";
import DiscountManager from "./resources/discount-manager/discount-manager";
import DiscountedCashFlowService from "./services/financial-modeling-prep/discounted-cash-flow/discounted-cash-flow.service";
import SupabaseDiscountService from "./services/discount/supabase-discount/supabase-discount.service";
import { IDiscountService } from "./services/discount/discount-service.typings";
import DiscountService from "./services/discount/ffs-discount/discount.service";
import { IHistoricalPriceService } from "./services/historical-price/historical-price-service.typings";
import FmpHistoricalPriceService from "./services/historical-price/fmp-historical-price/fmp-historical-price.service";

let discountManager: DiscountManager;
let discountService: IDiscountService;
let statementService: StatementService;
let discountedCashFlowService: DiscountedCashFlowService;
let historicalPriceService: IHistoricalPriceService;
let stickerPriceService: StickerPriceService;
let benchmarkService: BenchmarkService;
let companyInformationService: CompanyInformationService;
let calculatorService: CalculatorService;

export default function bootstrap() {

    // FFS Services
    discountService = initDiscountService();

    // FMP Services
    const fmpServices = initFinancialModelingPrepServices();
    companyInformationService = fmpServices.companyInformationService;
    statementService = fmpServices.statementService;
    discountedCashFlowService = fmpServices.discountedCashFlowService;
    historicalPriceService = fmpServices.fmpHistoricalPriceService;

    // Business Logic Services
    stickerPriceService = new StickerPriceService();
    calculatorService = new CalculatorService();
    benchmarkService = initBenchmarkService();
    
    // Discount Manager
    discountManager = initDiscountManager();
    
    console.log('BOOTSTRAPPED SERVICES WITH:')
    console.log(`ffs url: ${process.env.ffs_base_url}`);
    console.log(`fmp url: ${process.env.fmp_base_url}`);
    console.log(`fmp key: ${process.env.fmp_api_key}`);
    console.log(`supabase url: ${process.env.supabase_base_url}`);
    console.log(`Benchmark source url: ${process.env.benchmark_source_url}`);
}

function initDiscountManager(): DiscountManager {
    return new DiscountManager();
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
    companyInformationService: CompanyInformationService,
    statementService: StatementService,
    discountedCashFlowService: DiscountedCashFlowService,
    fmpHistoricalPriceService: FmpHistoricalPriceService
} {
    const fmp_base_url = process.env.fmp_base_url;
    const fmp_api_key = process.env.fmp_api_key;
    if (!fmp_base_url || !fmp_api_key) {
        throw new EnvInitializationException('FMP key or base url not provided');
    }
    return {
        companyInformationService: new CompanyInformationService(fmp_base_url, fmp_api_key),
        statementService: new StatementService(fmp_base_url, fmp_api_key),
        discountedCashFlowService: new DiscountedCashFlowService(fmp_base_url, fmp_api_key),
        fmpHistoricalPriceService: new FmpHistoricalPriceService(fmp_base_url, fmp_api_key)
    }
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
    companyInformationService,
    benchmarkService,
    calculatorService,
    discountedCashFlowService
}



