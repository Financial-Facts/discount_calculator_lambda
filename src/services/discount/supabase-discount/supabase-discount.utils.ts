import { PeriodicData, Period } from "@/src/types";
import { DbPeriodicData } from "./supabase-discount.typings";

export const cleanPeriodicData = (unclean: DbPeriodicData[]): PeriodicData[] => unclean.map(data => ({
    cik: data.cik,
    announcedDate: new Date(data.announced_date),
    value: data.value,
    period: data.period ? data.period as Period : undefined
}));
