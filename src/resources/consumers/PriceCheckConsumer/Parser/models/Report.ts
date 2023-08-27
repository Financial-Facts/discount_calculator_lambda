import { ReportTranslated } from "sec-edgar-api";
import ReportAdded from "./ReportAdded";

export type Report = ReportAdded & ReportTranslated;