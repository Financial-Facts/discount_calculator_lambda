import BenchmarkService from "@/services/benchmark/benchmark.service";
import DiscountService from "@/services/discount/discount.service";
import ProfileService from "@/services/financial-modeling-prep/profile/profile.service";
import StatementService from "@/services/financial-modeling-prep/statement/statement.service";
import HistoricalPriceService from "@/services/historical-price/historical-price.service";
import StickerPriceService from "@/services/sticker-price/sticker-price.service";
import { stub } from "sinon";
import { mockCompanyProfile, mockSimpleDiscounts, mockStatements } from "./resources/price-check-consumer/discount-manager/discount-manager.mocks";
import bootstrap from "@/src/bootstrap";

const statementServiceStub = stub(StatementService.prototype);
const profileServiceStub = stub(ProfileService.prototype);
const discountServiceStub = stub(DiscountService.prototype);
const stickerPriceServiceStub = stub(StickerPriceService.prototype);
const benchmarkServiceStub = stub(BenchmarkService.prototype);
const historicalPriceServiceStub = stub(HistoricalPriceService.prototype);
    
before(() => {
    console.log('Setting up test environment...');
    resetServiceStubs();
    bootstapTestServices();
    console.log('Environment initialized!');
});

export function resetServiceStubs(): void {
    statementServiceStub.getStatements.resolves(mockStatements);
    profileServiceStub.getCompanyProfile.resolves(mockCompanyProfile);
    discountServiceStub.getBulkSimpleDiscounts.resolves(mockSimpleDiscounts);
}

function bootstapTestServices(): void {
    process.env.ffs_base_url = 'ffs.com';
    process.env.fmp_base_url = 'fmp.com';
    process.env.fmp_api_key = 'key';
    process.env.historical_data_source_url_v1 = 'historical.com';
    process.env.benchmark_source_url = 'benchmark.com';
    bootstrap();
}

export {
    stickerPriceServiceStub,
    profileServiceStub,
    statementServiceStub,
    discountServiceStub,
    benchmarkServiceStub,
    historicalPriceServiceStub
}