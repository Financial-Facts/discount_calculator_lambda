import Discount from "./IDiscount";
import fetch from 'node-fetch';
import HttpException from "@/utils/exceptions/HttpException";


class DiscountService {

    // Create a new discount 
    public async create(discount: Discount): Promise<string> {
        try {
            const url = `${process.env.FINANCIAL_FACTS_SERVICE_BASE_URL}/v1/discount`;
            return fetch(url, { 
                method: 'POST',
                headers: { 
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(discount)
            }).then((response: any) => {
                return response.text();
            })
        } catch (err: any) {
            throw new HttpException(400, err.message);   
        }
    }

    // Update an existing discount 
    public async update(discount: Discount): Promise<Discount> {
        try {
            const url = `${process.env.FINANCIAL_FACTS_SERVICE_BASE_URL}/v1/discount`;
            return fetch(url, { method: 'PUT', body: JSON.stringify(discount) });
        } catch (err) {
            throw new HttpException(400, 'Failure during discount update request');   
        }
    }

    // Get an existing discount
    public async get(cik: string): Promise<Discount> {
        try {
            const url = `${process.env.FINANCIAL_FACTS_SERVICE_BASE_URL}/v1/discount/${cik}`;
            return fetch(url)
                .then((response: any) => {
                    return response.text();
                }).then((body: Discount) => {
                    return body;
                });
        } catch (err) {
            throw new HttpException(400, 'Failure during discount get request')
        }
    }
}

export default DiscountService;