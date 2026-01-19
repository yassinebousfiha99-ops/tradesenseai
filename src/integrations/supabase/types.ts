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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      challenge_plans: {
        Row: {
          account_size: number
          created_at: string
          daily_loss_limit: number
          id: string
          is_active: boolean
          leverage: string
          max_loss_limit: number
          min_trading_days: number
          name: string
          price: number
          profit_split: number
          profit_target_phase1: number
          profit_target_phase2: number
          updated_at: string
        }
        Insert: {
          account_size: number
          created_at?: string
          daily_loss_limit?: number
          id?: string
          is_active?: boolean
          leverage?: string
          max_loss_limit?: number
          min_trading_days?: number
          name: string
          price: number
          profit_split?: number
          profit_target_phase1?: number
          profit_target_phase2?: number
          updated_at?: string
        }
        Update: {
          account_size?: number
          created_at?: string
          daily_loss_limit?: number
          id?: string
          is_active?: boolean
          leverage?: string
          max_loss_limit?: number
          min_trading_days?: number
          name?: string
          price?: number
          profit_split?: number
          profit_target_phase1?: number
          profit_target_phase2?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          country: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      trades: {
        Row: {
          challenge_id: string
          closed_at: string | null
          created_at: string
          entry_price: number
          exit_price: number | null
          id: string
          opened_at: string
          profit_loss: number | null
          quantity: number
          side: string
          status: string
          symbol: string
          user_id: string
        }
        Insert: {
          challenge_id: string
          closed_at?: string | null
          created_at?: string
          entry_price: number
          exit_price?: number | null
          id?: string
          opened_at?: string
          profit_loss?: number | null
          quantity: number
          side: string
          status?: string
          symbol: string
          user_id: string
        }
        Update: {
          challenge_id?: string
          closed_at?: string | null
          created_at?: string
          entry_price?: number
          exit_price?: number | null
          id?: string
          opened_at?: string
          profit_loss?: number | null
          quantity?: number
          side?: string
          status?: string
          symbol?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trades_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "user_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          challenge_id: string | null
          created_at: string
          currency: string
          id: string
          payment_method: string | null
          payment_reference: string | null
          status: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          challenge_id?: string | null
          created_at?: string
          currency?: string
          id?: string
          payment_method?: string | null
          payment_reference?: string | null
          status?: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          challenge_id?: string | null
          created_at?: string
          currency?: string
          id?: string
          payment_method?: string | null
          payment_reference?: string | null
          status?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "user_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_challenges: {
        Row: {
          created_at: string
          current_balance: number
          daily_loss: number
          ended_at: string | null
          highest_balance: number
          id: string
          phase: Database["public"]["Enums"]["challenge_phase"]
          plan_id: string
          started_at: string | null
          starting_balance: number
          status: Database["public"]["Enums"]["challenge_status"]
          total_loss: number
          total_profit: number
          trading_days: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_balance: number
          daily_loss?: number
          ended_at?: string | null
          highest_balance: number
          id?: string
          phase?: Database["public"]["Enums"]["challenge_phase"]
          plan_id: string
          started_at?: string | null
          starting_balance: number
          status?: Database["public"]["Enums"]["challenge_status"]
          total_loss?: number
          total_profit?: number
          trading_days?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_balance?: number
          daily_loss?: number
          ended_at?: string | null
          highest_balance?: number
          id?: string
          phase?: Database["public"]["Enums"]["challenge_phase"]
          plan_id?: string
          started_at?: string | null
          starting_balance?: number
          status?: Database["public"]["Enums"]["challenge_status"]
          total_loss?: number
          total_profit?: number
          trading_days?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_challenges_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "challenge_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      challenge_phase: "phase1" | "phase2" | "funded"
      challenge_status: "pending" | "active" | "passed" | "failed" | "cancelled"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
      challenge_phase: ["phase1", "phase2", "funded"],
      challenge_status: ["pending", "active", "passed", "failed", "cancelled"],
    },
  },
} as const
