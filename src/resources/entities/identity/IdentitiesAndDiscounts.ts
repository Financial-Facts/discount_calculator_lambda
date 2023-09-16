import { SimpleDiscount } from "@/resources/services/discount/discount.typings";
import Identity from "./Identity";

export default interface IdentitiesAndDiscounts {

    discounts?: SimpleDiscount[],
    identities: Identity
     
}