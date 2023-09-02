import { ReportTranslated } from "sec-edgar-api";

export default interface ReportAdded {

    acceptedDate?: string | null;
    goodwill?: number | null;
    commonStock?: number | null;
    capitalLeaseObligations?: number | null;
    investmentsTotal?: number | null;
    deferredIncomeTaxLiabilitiesNet?: number | null;
    accumulatedOtherComprehensiveIncomeLoss?: number | null;

}

export type Report = ReportAdded & ReportTranslated;