import HttpException from "@/utils/exceptions/HttpException";
import InsufficientDataException from "@/utils/exceptions/InsufficientDataException";
import { Discount } from "@/services/discount/ffs-discount/discount.typings";
import { benchmarkService, discountService, discountedCashFlowService, statementService, stickerPriceService, companyInformationService } from "@/src/bootstrap";
import { buildDiscount, buildQuarterlyData, validateStatements } from "./discount-manager.utils";
import { StickerPriceInput } from "@/services/sticker-price/sticker-price.typings";
import { BenchmarkRatioPriceInput } from "@/services/benchmark/benchmark.typings";
import { DiscountedCashFlowInput } from "@/services/financial-modeling-prep/discounted-cash-flow/discounted-cash-flow.typings";
import { Statements } from "@/services/financial-modeling-prep/statement/statement.typings";
import { CompanyProfile } from "@/services/financial-modeling-prep/company-information/company-information.typings";
import { getLastQ4Value } from "@/utils/processing.utils";


class DiscountManager {

    public async intiateDiscountCheck(cik: string): Promise<void> {
        return this.checkForDiscount(cik)
            .catch((err: any) => {
                console.log(`Error occurred while checking ${cik} for discount: ${err.message}`);
                if (err instanceof InsufficientDataException) {
                    return this.deleteDiscount(cik, err.message);
                }
            });
    }

    private async checkForDiscount(cik: string): Promise<void> {
        console.log(`In discount manager checking for a discount on ${cik}`);
        const profiles = await companyInformationService.getCompanyProfiles(cik);

        const activeProfile = profiles.find(profile => profile.isActivelyTrading === true);
        if (!activeProfile) {
            throw new InsufficientDataException(`${cik} does not have an actively traded profile`);
        }

        const statements = await statementService.getCleanStatements(cik, activeProfile.symbol);
        validateStatements(cik, statements);
        
        const [ 
            stickerPriceInput,
            benchmarkRatioPriceInput,
            discountedCashFlowInput
        ] = await this.buildValuationInputs(
            cik,
            activeProfile.industry,
            activeProfile.symbol,
            statements,
            profiles);
        
        const discount = await buildDiscount(cik, activeProfile,
            stickerPriceService.getStickerPrice(stickerPriceInput),
            benchmarkService.getBenchmarkRatioPrice(cik, benchmarkRatioPriceInput),
            discountedCashFlowService.getDiscountCashFlowPrice(cik, discountedCashFlowInput));
                            
        console.log(JSON.stringify(discount, null, 4));
        return this.saveDiscount(discount);
    }

    private async buildValuationInputs(
        cik: string,
        industry: string,
        activeSymbol: string,
        statements: Statements,
        profiles: CompanyProfile[]
    ): Promise<[ StickerPriceInput, BenchmarkRatioPriceInput, DiscountedCashFlowInput ]> {

        // Compile list of profile symbols, making sure the active symbol is first
        const symbols = profiles.map(profile => profile.symbol)
            .sort((a, b) => a === activeSymbol ? -1 : b === activeSymbol ? 1 : 0);

        // Compile data needed for discount input calculations
        const quarterlyData = await buildQuarterlyData(cik, symbols, statements);
        const { netDebt, totalDebt } = getLastQ4Value(statements.balanceSheets);

        return Promise.all([
            stickerPriceService.buildStickerPriceInput(cik, symbols, quarterlyData),
            benchmarkService.buildBenchmarkRatioPriceInput(cik, industry, quarterlyData),
            discountedCashFlowService.buildDiscountedCashFlowInput(cik, activeSymbol, symbols, totalDebt, netDebt, quarterlyData)
        ]);
    }

    private async saveDiscount(discount: Discount): Promise<void> {
        const cik = discount.cik;
        return discountService.save(discount)
            .then(async response => {
                if (response) {
                    console.log(`Sticker price sale saved for ${cik}`);
                }
            }).catch((err: HttpException) => {
                console.log(`Sticker price save failed for ${cik} with err: ${err}`);
            });
    }

    private async deleteDiscount(cik: string, reason: string): Promise<void> {
        return discountService.delete(cik, reason)
            .then(async () => {
                console.log(`Discount for ${cik} has been deleted due to: ${reason}`);
            }).catch((deleteEx: HttpException) => {
                if (deleteEx.status !== 404) {
                    console.log(`Deleting discount for ${cik} failed due to: ${deleteEx.message}`);
                } else {
                    console.log(`Discount for ${cik} does not exist`);
                }
            })
    }
}

export default DiscountManager;
