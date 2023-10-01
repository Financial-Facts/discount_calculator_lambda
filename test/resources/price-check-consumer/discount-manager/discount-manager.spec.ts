import DiscountManager from "@/resources/price-check-consumer/discount-manager/discount-manager"
import DiscountService from "@/services/discount/discount.service";
import { assert } from "chai";
import Sinon from "sinon";

describe('Discount Manager Tests', () => {

    let discountManager: DiscountManager;
    const discountService = Sinon.mock(DiscountService);

    beforeEach(() => {
        discountManager = new DiscountManager();
    });

    it('should create when constructed', () => {
        assert.exists(discountManager);
    });

    it('should create a set for existing discounts on construction', () => {
        assert.exists(discountManager.existingDiscountCikSet);
    });

    it('should load existing discounts on construction', () => {
        discountService.expects('getBulkSimpleDiscounts').resolves()
    });
})