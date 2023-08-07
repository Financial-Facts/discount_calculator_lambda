type SortBy = 'CIK' | 'SYMBOL' | 'NAME';

type SortOrder = 'ASC' | 'DESC';

export default interface BulkIdentitiesRequest {

    startIndex: number,
    limit: number,
    sortBy: SortBy,
    order: SortOrder
    
}