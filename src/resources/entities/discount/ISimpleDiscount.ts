export default interface SimpleDiscount {

    cik: string;

    symbol: string;

    name: string;

    active: boolean;

    ratioPrice?: number;

    ttmSalePrice: number;

    tfySalePrice: number;

    ttySalePrice: number;
    
}
