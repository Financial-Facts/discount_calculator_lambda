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

export type DbDiscount = {
  cik: string,
  symbol: string,
  name: string,
  last_updated: string,
  active: boolean,
  sticker_price: {
    cik: string,
    price: number,
    sticker_price_input: {
      cik: string,
      annual_pe: DbPeriodicData[],
      annual_eps: DbPeriodicData[],
      debt_years: number,
      annual_bvps: DbPeriodicData[],
      annual_roic: DbPeriodicData[],
      annual_equity: DbPeriodicData[],
      annual_revenue: DbPeriodicData[],
      annual_operating_cash_flow: DbPeriodicData[],
    }
  },
  benchmark_ratio_price: {
    cik: string,
    price: number,
    benchmark_ratio_price_input: {
      cik: string,
      industry: string,
      ttm_revenue: number,
      ps_benchmark_ratio: number,
      shares_outstanding: number
    }
  },
  discounted_cash_flow_price: {
    cik: string,
    price: number,
    discounted_cash_flow_input: {
      cik: string,
      wacc: number,
      symbol: string,
      net_debt: number,
      market_price: number,
      terminal_value: number,
      enterprise_value: number,
      free_cash_flowt1: number,
      projected_revenue: DbPeriodicData[],
      historical_revenue: DbPeriodicData[],
      long_term_growth_rate: number,
      projected_free_cash_flow: DbPeriodicData[],
      historical_free_cash_flow: DbPeriodicData[],
      diluted_shares_outstanding: number,
      projected_capital_expenditure: DbPeriodicData[],
      projected_operating_cash_flow: DbPeriodicData[],
      historical_capital_expenditure: DbPeriodicData[],
      historical_operating_cash_flow: DbPeriodicData[]
    }
  }
}
