import DiscountManager from '@/resources/discount-manager/discount-manager'
import { assert } from "chai";
import Sinon, { stub } from "sinon";
import { mockBenchmarkPrice, mockHistoricalPrices, mockSimpleDiscounts, mockStatements, mockStickerPrice } from "./discount-manager.mocks";
import { TEST_CONSTANTS } from "@/test/test.constants";
import * as discountManagerUtils from '@/resources/discount-manager/discount-manager.utils';
import { discountServiceStub, statementServiceStub, profileServiceStub, historicalPriceServiceStub, stickerPriceServiceStub, benchmarkServiceStub } from '@/test/setup.spec';


describe('Discount Manager', () => {

    const utilsStub = stub(discountManagerUtils);

    describe('constructor', () => {

        let discountManager: DiscountManager;

        beforeEach(() => {
            discountManager = new DiscountManager();
        });

        it('should create', () => {
            assert.exists(discountManager);
        });
    
        it('should create a set for existing discounts', () => {
            assert.exists(discountManager.existingDiscountCikSet);
        });

        it('should begin loading existing discount set', () => {
            assert.exists(discountManager.isReady);
        });

    });

    describe('loadExistingDiscountCikSet', () => {

        let discountManager: DiscountManager;

        beforeEach(() => {
            discountServiceStub.getBulkSimpleDiscounts.resetHistory();
            discountServiceStub.getBulkSimpleDiscounts.resolves(mockSimpleDiscounts);
            discountManager = new DiscountManager();
        });

        it('should load existing discounts on construction', async () => {
            await discountManager.isReady;
            const discountSet = discountManager.existingDiscountCikSet;
            assert.isTrue(discountServiceStub.getBulkSimpleDiscounts.calledOnce);
            assert.equal(discountSet.size, 2);
            assert.isTrue(discountSet.has(TEST_CONSTANTS.CIK));
            assert.isTrue(discountSet.has(TEST_CONSTANTS.CIK2))
        });

    });

    describe('initiateDiscountCheck', () => {

        let discountManager: DiscountManager;

        beforeEach(() => {
            prepareStubs();
            discountManager = new DiscountManager();
        });

        it('should fetch company statements and profile', async () => {
            await discountManager.intiateDiscountCheck(TEST_CONSTANTS.CIK)
            assert.isTrue(statementServiceStub.getStatements.calledOnce);
            assert.isTrue(profileServiceStub.getCompanyProfile.calledOnce);
        });

        it('should check if there are a sufficient number of statements', async () => {
            statementServiceStub.getStatements.resolves({
                incomeStatements: mockStatements.incomeStatements.slice(-1),
                balanceSheets: mockStatements.balanceSheets.slice(-1),
                cashFlowStatements: mockStatements.cashFlowStatements.slice(-1)   
            });
            return discountManager.intiateDiscountCheck(TEST_CONSTANTS.CIK)
                .then(() => {
                    assert.isTrue(utilsStub.checkHasSufficientStatements.calledOnce);
                });
        });

        it('should delete discount on insufficient number of statements if one exists', async () => {
            utilsStub.checkHasSufficientStatements.callThrough();
            statementServiceStub.getStatements.resolves({
                incomeStatements: mockStatements.incomeStatements.slice(-1),
                balanceSheets: mockStatements.balanceSheets.slice(-1),
                cashFlowStatements: mockStatements.cashFlowStatements.slice(-1)   
            });
            return discountManager.intiateDiscountCheck(TEST_CONSTANTS.CIK)
                .then(() => {
                    assert.isTrue(discountServiceStub.delete.called);
                    assert.isTrue(discountServiceStub.delete.calledWith(TEST_CONSTANTS.CIK));
                });
        });
    });

    describe('checkForDiscount', () => {

        let discountManager: DiscountManager;

        beforeEach(() => {
            prepareStubs();
            discountManager = new DiscountManager();
        });

        it('should get statements when checking for discount', async () => {
            return discountManager
        });
    });

    describe('saveDiscount', () => {

    });

    
    function prepareStubs() {
        Sinon.resetHistory();
        discountServiceStub.getBulkSimpleDiscounts.resolves(mockSimpleDiscounts);
        statementServiceStub.getStatements.resolves(mockStatements);
        utilsStub.annualizeByAdd.callThrough();
        utilsStub.processPeriodicDatasets.callThrough();
        historicalPriceServiceStub.getHistoricalPrices.resolves(mockHistoricalPrices);
        stickerPriceServiceStub.calculateStickerPriceObject.resolves(mockStickerPrice);
        benchmarkServiceStub.getBenchmarkRatioPrice.resolves(mockBenchmarkPrice);
        historicalPriceServiceStub.getCurrentPrice.resolves(8);
        discountServiceStub.save.resolves('Success');
        discountServiceStub.delete.resolves('Success');
    }

});
