import { Database } from "./supabase-schema"

export type TableName = keyof Database['public']['Tables']

export type DbPeriodicData = {
  cik: string
  announced_date: string
  value: number
  period: string | null
}

export type DbSimpleDiscount = {
  cik: string
  symbol: string
  name: string
  active: boolean
  last_updated: string
  discountedcashflowprice: number
  benchmarkratioprice: number
  stickerprice: number
}
