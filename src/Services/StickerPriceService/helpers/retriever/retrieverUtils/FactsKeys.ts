const FACTS_KEYS = {
    SHAREHOLDER_EQUITY: {
        HOLDERS_EQUITY: 'StockholdersEquity',
        L_AND_H_EQUITY: 'LiabilitiesAndStockholdersEquity'
    },
    OUTSTANDING_SHARES: {
        COMMON_SHARES_OUTSTANDING: 'CommonStockSharesOutstanding',
        COMMON_SHARES_ISSUED: 'CommonStockSharesIssued',
        AVG_NUM_SHARES_OUTSTANDING: 'WeightedAverageNumberOfSharesOutstandingBasic',
    },
    DEI: {
        OUTSTANDING_SHARES: {
            E_COMMON_OUTSTANDING: 'EntityCommonStockSharesOutstanding'
        }
    }
}

export default FACTS_KEYS;