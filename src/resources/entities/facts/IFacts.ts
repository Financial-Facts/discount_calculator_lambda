import QuarterlyData from "../models/QuarterlyData"
import FactsWrapper from "./models/FactsWrapper"

export default interface Facts {

    cik: string
    lastSync: Date
    data: FactsWrapper

}