export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.0.2 (a4e00ff)"
  }
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
      benchmark_industry_ps_ratio: {
        Row: {
          industry: string
          ps_ratio: number
          updated_at: string
        }
        Insert: {
          industry: string
          ps_ratio?: number
          updated_at?: string
        }
        Update: {
          industry?: string
          ps_ratio?: number
          updated_at?: string
        }
        Relationships: []
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
          annual_dividend: number
          average_volume: number
          ceo: string
          cik: string
          deleted_reasons: string[]
          description: string
          exchange: string
          industry: string
          is_deleted: string
          last_updated: string
          location: string
          market_price: number
          name: string
          symbol: string
          ttm_insider_purchases: number
          website: string
        }
        Insert: {
          active: boolean
          annual_dividend: number
          average_volume: number
          ceo: string
          cik: string
          deleted_reasons?: string[]
          description: string
          exchange: string
          industry: string
          is_deleted?: string
          last_updated: string
          location: string
          market_price: number
          name: string
          symbol: string
          ttm_insider_purchases?: number
          website: string
        }
        Update: {
          active?: boolean
          annual_dividend?: number
          average_volume?: number
          ceo?: string
          cik?: string
          deleted_reasons?: string[]
          description?: string
          exchange?: string
          industry?: string
          is_deleted?: string
          last_updated?: string
          location?: string
          market_price?: number
          name?: string
          symbol?: string
          ttm_insider_purchases?: number
          website?: string
        }
        Relationships: []
      }
      discount_qualifiers: {
        Row: {
          cik: string
          periods: string
          type: string
          value: number
        }
        Insert: {
          cik: string
          periods: string
          type: string
          value: number
        }
        Update: {
          cik?: string
          periods?: string
          type?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "discount_qualifiers_cik_fkey"
            columns: ["cik"]
            isOneToOne: false
            referencedRelation: "discount"
            referencedColumns: ["cik"]
          },
        ]
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
          ffy_estimated_eps_growth_rate: number | null
        }
        Insert: {
          cik: string
          debt_years: number
          ffy_estimated_eps_growth_rate?: number | null
        }
        Update: {
          cik?: string
          debt_years?: number
          ffy_estimated_eps_growth_rate?: number | null
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
        Args: never
        Returns: {
          active: boolean
          benchmarkratioprice: number
          cik: string
          discountedcashflowprice: number
          last_updated: string
          name: string
          stickerprice: number
          symbol: string
        }[]
      }
      get_bulk_simple_discounts_json: { Args: never; Returns: Json }
      get_discount: { Args: { discount_cik: string }; Returns: Json }
      get_discounts_with_filter: {
        Args: {
          hideabovebenchmarkratioprice: boolean
          hideabovediscountedflowprice: boolean
          hideabovestickerprice: boolean
          lowerbound: number
          permitteddeletedvalues: string[]
          searchkeyword: string
          upperbound: number
        }
        Returns: {
          active: boolean
          annual_dividend: number
          average_volume: number
          benchmark_ratio_price: number
          cik: string
          discounted_cash_flow_price: number
          is_deleted: string
          last_updated: string
          market_price: number
          name: string
          sticker_price: number
          symbol: string
          ttm_insider_purchases: number
        }[]
      }
      get_qualified_simple_discount: { Args: never; Returns: Json }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
