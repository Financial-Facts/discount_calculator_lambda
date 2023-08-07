import SimpleDiscount from "../discount/ISimpleDiscount";
import Identity from "./Identity";

export default interface IdentitiesAndDiscounts {

    discounts?: SimpleDiscount[],
    identities: Identity
     
}