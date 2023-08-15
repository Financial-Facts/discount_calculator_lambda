import BulkIdentitiesRequest from "@/resources/entities/identity/BulkIdentitiesRequest";
import IdentitiesAndDiscounts from "@/resources/entities/identity/IdentitiesAndDiscounts";
import Identity from "@/resources/entities/identity/Identity";

export default interface IdentityService {

    getIdentityWithCik(cik: string): Promise<Identity>;
    getBulkIdentitiesAndOptionalDiscounts(
        request: BulkIdentitiesRequest,
        includeDiscounts: boolean
    ): Promise<IdentitiesAndDiscounts>;

}