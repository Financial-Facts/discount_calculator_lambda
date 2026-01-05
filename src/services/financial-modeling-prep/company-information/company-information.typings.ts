
export interface CompanyProfile {
    symbol: string,
    price: number,
    beta: number,
    volAvg: number,
    mktCap: number,
    lastDiv: number,
    range: string,
    changes: number,
    companyName: string,
    currency: string,
    cik: string,
    isin: string,
    cusip: string,
    exchange: string,
    exchangeShortName: string,
    industry: string,
    website: string,
    description: string,
    ceo: string,
    sector: string,
    country: string,
    fullTimeEmployees: string,
    phone: string,
    address: string,
    city: string,
    state: string,
    zip: string,
    dcfDiff: number,
    dcf: number,
    image: string,
    ipoDate: string,
    defaultImage: boolean,
    isEtf: boolean,
    isActivelyTrading: boolean,
    isAdr: boolean,
    isFund: boolean
}

export interface AnalystEstimates {
    symbol: string
    date: Date
    estimatedEpsAvg: number
}

export interface InsiderTrade {
    symbol: string
    transactionDate: Date
    transactionType: 'P-Purchase' | 'S-Sale'
    securitiesTransacted: number
}

export interface Company {
    symbol: string
    companyName: string
    price: number
    marketCap: number
}

export interface CompanyTTMRatios {
    symbol: string
    priceToSalesRatioTTM: number
}
