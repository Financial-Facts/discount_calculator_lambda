import HttpException from "@/utils/exceptions/HttpException";
import { AnalystEstimates, Company, CompanyProfile, CompanyTTMRatios, InsiderTrade } from "./company-information.typings";
import { buildURI } from "../fmp-service.utils";
import InsufficientDataException from "@/utils/exceptions/InsufficientDataException";

class CompanyInformationService {

    private fmp_base_url;
    private apiKey;
    
    constructor(fmp_base_url: string, apiKey: string) {
        this.fmp_base_url = fmp_base_url;
        this.apiKey = apiKey;
    }

    public async getCompanyProfiles(cik: string): Promise<CompanyProfile[]> {
        console.log(`In profile service getting company profile for ${cik}`);
        try {
            const url = this.fmp_base_url + buildURI(cik, 'profile', this.apiKey, 'annual');
            return fetch(url)
                .then(async (response: Response) => {
                    if (response.status !== 200) {
                        const text = await response.text();
                        throw new HttpException(response.status,
                            `Error occurred while getting company profile for ${cik}: ${text}`);
                    }
                    return response.json();
                }).then((body: CompanyProfile[]) => {
                    const profiles = body.filter(profile => profile.currency === 'USD');
                    if (!profiles.length) {
                        throw new InsufficientDataException(`${cik} does not have a profile listed in USD`);
                    }
                    return profiles;
                });
        } catch (err: any) {
            throw new HttpException(err.status,
                `Error occurred while getting company profile for ${cik}: ${err.message}`)
        }
    }

    public async getAnalystEstimates(symbols: string[]): Promise<AnalystEstimates[]> {
        console.log(`In profile service getting analysts estimates for ${symbols}`);
        let allAnalystEstimates: AnalystEstimates[] = [];
        try {
            for (const symbol of symbols) {
                const url = this.fmp_base_url + `/api/v3/analyst-estimates/${symbol}?apikey=${this.apiKey}`;
                await fetch(url)
                    .then(async (response: Response) => {
                        if (response.status !== 200) {
                            const text = await response.text();
                            throw new HttpException(response.status,
                                `Error occurred while getting analyst estimates for ${symbol}: ${text}`
                            ) 
                        }
                        return response.json();
                    }).then((body: AnalystEstimates[]) => {
                        allAnalystEstimates = [...allAnalystEstimates, ...body];
                    });
            }
            return allAnalystEstimates.sort((a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf());
        } catch (err: any) {
            throw new HttpException(err.status,
                `Error occurred while getting analyst estimates for ${symbols}: ${err.message}`
            )
        }
    }

    public async getInsiderTrades(symbol: string): Promise<InsiderTrade[]> {
        console.log(`In profile service getting insider trade statistics for ${symbol}`);
        try {
            const url = this.fmp_base_url + `/api/v4/insider-trading?symbol=${symbol}&page=0&transactionType=P-Purchase&transactionType=S-Sale&apikey=${this.apiKey}`;
            return fetch(url)
                .then(async (response: Response) => {
                    if (response.status !== 200) {
                        const text = await response.text();
                        throw new HttpException(response.status,
                            `Error occurred while getting insider trade statistics for ${symbol}: ${text}`
                        ) 
                    }
                    return response.json();
                }).then((body: InsiderTrade[]) => {
                    return body;
                })

        } catch (err: any) {
            throw new HttpException(err.status,
                `Error occurred while getting insider trade statistics for ${symbol}: ${err.message}`
            )
        }
    }

    public async getCompanyListByIndustry(industry: string): Promise<Company[]> {
        console.log(`In profile service getting company list by industry for ${industry}`);
        const url = this.fmp_base_url +'/stable/company-screener' +
            `?industry=${encodeURIComponent(industry)}` +
            `&apikey=${this.apiKey}` +
            '&isActivelyTrading=true' +
            '&isFund=false' +
            '&isEtf=false' +
            '&exchange=NYSE,NASDAQ';

        try {
            return fetch(url)
                .then(async (response: Response) => {
                    if (response.status !== 200) {
                        const text = await response.text();
                        throw new HttpException(response.status,
                            `Error occurred while getting company list by industry for ${industry}: ${text}`
                        )
                    }
                    return response.json();
                }).then((body: Company[]) => {
                    return body;
                });
        } catch (err: any) {
            throw new HttpException(err.status,
                `Error occurred while getting company list by industry for ${industry}: ${err.message}`
            )
        }
    }

    public async getCompanyTTMRatiosBySymbol(symbol: string): Promise<CompanyTTMRatios> {
        const url = this.fmp_base_url + `/stable/ratios-ttm?symbol=${symbol}&apikey=${this.apiKey}`;
        try {
            return fetch(url)
                .then(async (response: Response) => {
                    if (response.status !== 200) {
                        const text = await response.text();
                        throw new HttpException(response.status,
                            `Error occurred while getting company TTM ratios for ${symbol}: ${text}`
                        )
                    }
                    return response.json();
                }).then((body: CompanyTTMRatios[]) => {
                    return body[0];
                });
        } catch (err: any) {
            throw new HttpException(err.status,
                `Error occurred while getting company TTM ratios for ${symbol}: ${err.message}`
            )
        }
    
    }
}

export default CompanyInformationService;
