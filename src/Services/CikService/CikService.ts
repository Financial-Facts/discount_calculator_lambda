import { cikToSymbol } from "./cikToSymbol";
import { symbolToCik } from "./symbolToCik";

class CikService {

    constructor() {}

    public getCikWithSymbol(symbol: string): string {
        return symbolToCik[symbol];
    }

    public getSymbolWithCik(cik: string): string {
        return cikToSymbol[cik];
    }

}

export default CikService;
