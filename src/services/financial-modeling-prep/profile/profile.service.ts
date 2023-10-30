import HttpException from "@/utils/exceptions/HttpException";
import { CompanyProfile } from "./profile.typings";
import { buildURI } from "../fmp-service.utils";
import InsufficientDataException from "@/utils/exceptions/InsufficientDataException";

class ProfileService {

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
                    const profile = body.find(profile => profile.currency === 'USD');
                    if (!profile) {
                        throw new InsufficientDataException(`${cik} does not have a profile listed in USD`);
                    }
                    return profile;
                });
        } catch (err: any) {
            throw new HttpException(err.status,
                `Error occurred while getting company profile for ${cik}: ${err.message}`)
        }
    }
}

export default ProfileService;
