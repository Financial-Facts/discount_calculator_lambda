import HttpException from "@/utils/exceptions/HttpException";
import { AnalystEstimates, CompanyProfile } from "./company-information.typings";
import { buildURI } from "../fmp-service.utils";
import InsufficientDataException from "@/utils/exceptions/InsufficientDataException";

class CompanyInformationService {

    private fmp_base_url;
    private apiKey;
    
    constructor(fmp_base_url: string, apiKey: string) {
        this.fmp_base_url = fmp_base_url;
        this.apiKey = apiKey;
    }

    public async getCompanyProfile(cik: string): Promise<CompanyProfile> {
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
                    if (profiles.length === 0) {
                        throw new InsufficientDataException(`${cik} does not have a profile listed in USD`);
                    }
                    return profiles.slice(-1)[0];
                });
        } catch (err: any) {
            throw new HttpException(err.status,
                `Error occurred while getting company profile for ${cik}: ${err.message}`)
        }
    }

    public async getAnalystEstimates(symbol: string): Promise<AnalystEstimates[]> {
        console.log(`In profile service getting analysts estimates for ${symbol}`);
        try {
            const url = this.fmp_base_url + `/api/v3/analyst-estimates/${symbol}?apikey=${this.apiKey}`;
            return fetch(url)
                .then(async (response: Response) => {
                    if (response.status !== 200) {
                        const text = await response.text();
                        throw new HttpException(response.status,
                            `Error occurred while getting analyst estimates for ${symbol}: ${text}`
                        ) 
                    }
                    return response.json();
                }).then((body: AnalystEstimates[]) => {
                    return body;
                })

        } catch (err: any) {
            throw new HttpException(err.status,
                `Error occurred while getting analyst estimates for ${symbol}: ${err.message}`
            )
        }
    }
}

export default CompanyInformationService;
