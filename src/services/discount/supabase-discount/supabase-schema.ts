export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      annual_bvps: {
        Row: {
          announced_date: string
          cik: string
          period: string | null
          value: number
        }
        Insert: {
          announced_date: string
          cik: string
          period?: string | null
          value: number
        }
        Update: {
          announced_date?: string
          cik?: string
          period?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_annual_bvps_cik_fkey"
            columns: ["cik"]
            isOneToOne: false
            referencedRelation: "sticker_price_input"
            referencedColumns: ["cik"]
          },
        ]
      }
      annual_eps: {
        Row: {
          announced_date: string
          cik: string
          period: string | null
          value: number
        }
        Insert: {
          announced_date: string
          cik: string
          period?: string | null
          value: number
        }
        Update: {
          announced_date?: string
          cik?: string
          period?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_annual_eps_cik_fkey"
            columns: ["cik"]
            isOneToOne: false
            referencedRelation: "sticker_price_input"
            referencedColumns: ["cik"]
          },
        ]
      }
      annual_equity: {
        Row: {
          announced_date: string
          cik: string
          period: string | null
          value: number
        }
        Insert: {
          announced_date: string
          cik: string
          period?: string | null
          value: number
        }
        Update: {
          announced_date?: string
          cik?: string
          period?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_annual_equity_cik_fkey"
            columns: ["cik"]
            isOneToOne: false
            referencedRelation: "sticker_price_input"
            referencedColumns: ["cik"]
          },
        ]
      }
      annual_operating_cash_flow: {
        Row: {
          announced_date: string
          cik: string
          period: string | null
          value: number
        }
        Insert: {
          announced_date: string
          cik: string
          period?: string | null
          value: number
        }
        Update: {
          announced_date?: string
          cik?: string
          period?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_annual_operating_cash_flow_cik_fkey"
            columns: ["cik"]
            isOneToOne: false
            referencedRelation: "sticker_price_input"
            referencedColumns: ["cik"]
          },
        ]
      }
      annual_pe: {
        Row: {
          announced_date: string
          cik: string
          period: string | null
          value: number
        }
        Insert: {
          announced_date: string
          cik: string
          period?: string | null
          value: number
        }
        Update: {
          announced_date?: string
          cik?: string
          period?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_annual_pe_cik_fkey"
            columns: ["cik"]
            isOneToOne: false
            referencedRelation: "sticker_price_input"
            referencedColumns: ["cik"]
          },
        ]
      }
      annual_revenue: {
        Row: {
          announced_date: string
          cik: string
          period: string | null
          value: number
        }
        Insert: {
          announced_date: string
          cik: string
          period?: string | null
          value: number
        }
        Update: {
          announced_date?: string
          cik?: string
          period?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_annual_revenue_cik_fkey"
            columns: ["cik"]
            isOneToOne: false
            referencedRelation: "sticker_price_input"
            referencedColumns: ["cik"]
          },
        ]
      }
      annual_roic: {
        Row: {
          announced_date: string
          cik: string
          period: string | null
          value: number
        }
        Insert: {
          announced_date: string
          cik: string
          period?: string | null
          value: number
        }
        Update: {
          announced_date?: string
          cik?: string
          period?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_annual_roic_cik_fkey"
            columns: ["cik"]
            isOneToOne: false
            referencedRelation: "sticker_price_input"
            referencedColumns: ["cik"]
          },
        ]
      }
      benchmark_ratio_price: {
        Row: {
          cik: string
          price: number
        }
        Insert: {
          cik: string
          price: number
        }
        Update: {
          cik?: string
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_benchmark_ratio_price_cik_fkey"
            columns: ["cik"]
            isOneToOne: true
            referencedRelation: "discount"
            referencedColumns: ["cik"]
          },
        ]
      }
      benchmark_ratio_price_input: {
        Row: {
          cik: string
          industry: string
          ps_benchmark_ratio: number
          shares_outstanding: number
          ttm_revenue: number
        }
        Insert: {
          cik: string
          industry: string
          ps_benchmark_ratio: number
          shares_outstanding: number
          ttm_revenue: number
        }
        Update: {
          cik?: string
          industry?: string
          ps_benchmark_ratio?: number
          shares_outstanding?: number
          ttm_revenue?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_benchmark_ratio_price_input_cik_fkey"
            columns: ["cik"]
            isOneToOne: true
            referencedRelation: "benchmark_ratio_price"
            referencedColumns: ["cik"]
          },
        ]
      }
      discount: {
        Row: {
          active: boolean
          cik: string
          last_updated: string
          name: string
          symbol: string
        }
        Insert: {
          active: boolean
          cik: string
          last_updated: string
          name: string
          symbol: string
        }
        Update: {
          active?: boolean
          cik?: string
          last_updated?: string
          name?: string
          symbol?: string
        }
        Relationships: []
      }
      discounted_cash_flow_input: {
        Row: {
          cik: string
          diluted_shares_outstanding: number
          enterprise_value: number
          free_cash_flowt1: number
          long_term_growth_rate: number
          market_price: number
          net_debt: number
          symbol: string
          terminal_value: number
          wacc: number
        }
        Insert: {
          cik: string
          diluted_shares_outstanding: number
          enterprise_value: number
          free_cash_flowt1: number
          long_term_growth_rate: number
          market_price: number
          net_debt: number
          symbol: string
          terminal_value: number
          wacc: number
        }
        Update: {
          cik?: string
          diluted_shares_outstanding?: number
          enterprise_value?: number
          free_cash_flowt1?: number
          long_term_growth_rate?: number
          market_price?: number
          net_debt?: number
          symbol?: string
          terminal_value?: number
          wacc?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_discounted_cash_flow_input_cik_fkey"
            columns: ["cik"]
            isOneToOne: true
            referencedRelation: "discounted_cash_flow_price"
            referencedColumns: ["cik"]
          },
        ]
      }
      discounted_cash_flow_price: {
        Row: {
          cik: string
          price: number
        }
        Insert: {
          cik: string
          price: number
        }
        Update: {
          cik?: string
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_discounted_cash_flow_price_cik_fkey"
            columns: ["cik"]
            isOneToOne: true
            referencedRelation: "discount"
            referencedColumns: ["cik"]
          },
        ]
      }
      facts: {
        Row: {
          cik: string
          data: Json | null
          last_sync: string | null
        }
        Insert: {
          cik: string
          data?: Json | null
          last_sync?: string | null
        }
        Update: {
          cik?: string
          data?: Json | null
          last_sync?: string | null
        }
        Relationships: []
      }
      historical_capital_expenditure: {
        Row: {
          announced_date: string
          cik: string
          period: string | null
          value: number
        }
        Insert: {
          announced_date: string
          cik: string
          period?: string | null
          value: number
        }
        Update: {
          announced_date?: string
          cik?: string
          period?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_historical_capital_expenditure_cik_fkey"
            columns: ["cik"]
            isOneToOne: false
            referencedRelation: "discounted_cash_flow_input"
            referencedColumns: ["cik"]
          },
        ]
      }
      historical_free_cash_flow: {
        Row: {
          announced_date: string
          cik: string
          period: string | null
          value: number
        }
        Insert: {
          announced_date: string
          cik: string
          period?: string | null
          value: number
        }
        Update: {
          announced_date?: string
          cik?: string
          period?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_historical_free_cash_flow_cik_fkey"
            columns: ["cik"]
            isOneToOne: false
            referencedRelation: "discounted_cash_flow_input"
            referencedColumns: ["cik"]
          },
        ]
      }
      historical_operating_cash_flow: {
        Row: {
          announced_date: string
          cik: string
          period: string | null
          value: number
        }
        Insert: {
          announced_date: string
          cik: string
          period?: string | null
          value: number
        }
        Update: {
          announced_date?: string
          cik?: string
          period?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_historical_operating_cash_flow_cik_fkey"
            columns: ["cik"]
            isOneToOne: false
            referencedRelation: "discounted_cash_flow_input"
            referencedColumns: ["cik"]
          },
        ]
      }
      historical_revenue: {
        Row: {
          announced_date: string
          cik: string
          period: string | null
          value: number
        }
        Insert: {
          announced_date: string
          cik: string
          period?: string | null
          value: number
        }
        Update: {
          announced_date?: string
          cik?: string
          period?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_historical_revenue_cik_fkey"
            columns: ["cik"]
            isOneToOne: false
            referencedRelation: "discounted_cash_flow_input"
            referencedColumns: ["cik"]
          },
        ]
      }
      identity: {
        Row: {
          cik: string
          name: string
          symbol: string
        }
        Insert: {
          cik: string
          name: string
          symbol: string
        }
        Update: {
          cik?: string
          name?: string
          symbol?: string
        }
        Relationships: []
      }
      projected_capital_expenditure: {
        Row: {
          announced_date: string
          cik: string
          period: string | null
          value: number
        }
        Insert: {
          announced_date: string
          cik: string
          period?: string | null
          value: number
        }
        Update: {
          announced_date?: string
          cik?: string
          period?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_projected_capital_expenditure_cik_fkey"
            columns: ["cik"]
            isOneToOne: false
            referencedRelation: "discounted_cash_flow_input"
            referencedColumns: ["cik"]
          },
        ]
      }
      projected_free_cash_flow: {
        Row: {
          announced_date: string
          cik: string
          period: string | null
          value: number
        }
        Insert: {
          announced_date: string
          cik: string
          period?: string | null
          value: number
        }
        Update: {
          announced_date?: string
          cik?: string
          period?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_projected_free_cash_flow_cik_fkey"
            columns: ["cik"]
            isOneToOne: false
            referencedRelation: "discounted_cash_flow_input"
            referencedColumns: ["cik"]
          },
        ]
      }
      projected_operating_cash_flow: {
        Row: {
          announced_date: string
          cik: string
          period: string | null
          value: number
        }
        Insert: {
          announced_date: string
          cik: string
          period?: string | null
          value: number
        }
        Update: {
          announced_date?: string
          cik?: string
          period?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_projected_operating_cash_flow_cik_fkey"
            columns: ["cik"]
            isOneToOne: false
            referencedRelation: "discounted_cash_flow_input"
            referencedColumns: ["cik"]
          },
        ]
      }
      projected_revenue: {
        Row: {
          announced_date: string
          cik: string
          period: string | null
          value: number
        }
        Insert: {
          announced_date: string
          cik: string
          period?: string | null
          value: number
        }
        Update: {
          announced_date?: string
          cik?: string
          period?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_projected_revenue_cik_fkey"
            columns: ["cik"]
            isOneToOne: false
            referencedRelation: "discounted_cash_flow_input"
            referencedColumns: ["cik"]
          },
        ]
      }
      sticker_price: {
        Row: {
          cik: string
          price: number
        }
        Insert: {
          cik: string
          price: number
        }
        Update: {
          cik?: string
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_sticker_price_cik_fkey"
            columns: ["cik"]
            isOneToOne: true
            referencedRelation: "discount"
            referencedColumns: ["cik"]
          },
        ]
      }
      sticker_price_input: {
        Row: {
          cik: string
          debt_years: number
        }
        Insert: {
          cik: string
          debt_years: number
        }
        Update: {
          cik?: string
          debt_years?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_sticker_price_input_cik_fkey"
            columns: ["cik"]
            isOneToOne: true
            referencedRelation: "sticker_price"
            referencedColumns: ["cik"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_bulk_simple_discounts: {
        Args: Record<PropertyKey, never>
        Returns: {
          cik: string
          symbol: string
          name: string
          active: boolean
          last_updated: string
          discountedcashflowprice: number
          benchmarkratioprice: number
          stickerprice: number
        }[]
      }
      get_discount: {
        Args: {
          discount_cik: string
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
