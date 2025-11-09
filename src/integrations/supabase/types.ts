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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          application_id: string
          application_type: string
          created_at: string | null
          decline_reason: string | null
          escalated_to:
            | Database["public"]["Enums"]["escalation_department"]
            | null
          fee_amount: number | null
          form_data: Json
          id: string
          last_update: string | null
          payment_reference: string | null
          payment_status: string | null
          status: Database["public"]["Enums"]["application_status"] | null
          submitted_date: string | null
          user_id: string
        }
        Insert: {
          application_id: string
          application_type: string
          created_at?: string | null
          decline_reason?: string | null
          escalated_to?:
            | Database["public"]["Enums"]["escalation_department"]
            | null
          fee_amount?: number | null
          form_data: Json
          id?: string
          last_update?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          submitted_date?: string | null
          user_id: string
        }
        Update: {
          application_id?: string
          application_type?: string
          created_at?: string | null
          decline_reason?: string | null
          escalated_to?:
            | Database["public"]["Enums"]["escalation_department"]
            | null
          fee_amount?: number | null
          form_data?: Json
          id?: string
          last_update?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          submitted_date?: string | null
          user_id?: string
        }
        Relationships: []
      }
      cases: {
        Row: {
          applicant_name: string
          case_id: string
          created_at: string | null
          description: string
          district: string
          id: string
          nida_number: string
          phone: string
          region: string
          related_service: string | null
          status: Database["public"]["Enums"]["application_status"] | null
          title: string
          updated_at: string | null
          user_id: string
          ward: string
        }
        Insert: {
          applicant_name: string
          case_id: string
          created_at?: string | null
          description: string
          district: string
          id?: string
          nida_number: string
          phone: string
          region: string
          related_service?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          title: string
          updated_at?: string | null
          user_id: string
          ward: string
        }
        Update: {
          applicant_name?: string
          case_id?: string
          created_at?: string | null
          description?: string
          district?: string
          id?: string
          nida_number?: string
          phone?: string
          region?: string
          related_service?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          title?: string
          updated_at?: string | null
          user_id?: string
          ward?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          nida_number: string | null
          phone: string | null
          updated_at: string | null
          verification_method: string | null
          verification_status:
            | Database["public"]["Enums"]["verification_status"]
            | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          nida_number?: string | null
          phone?: string | null
          updated_at?: string | null
          verification_method?: string | null
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          nida_number?: string | null
          phone?: string | null
          updated_at?: string | null
          verification_method?: string | null
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
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
      app_role: "admin" | "citizen"
      application_status:
        | "pending"
        | "in_progress"
        | "approved"
        | "declined"
        | "escalated"
        | "call_to_office"
      escalation_department:
        | "fire"
        | "police"
        | "immigration"
        | "health"
        | "education"
        | "transportation"
        | "ministry"
        | "nemc"
        | "brela"
        | "sumatra"
      verification_status: "pending" | "verified" | "rejected"
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
      app_role: ["admin", "citizen"],
      application_status: [
        "pending",
        "in_progress",
        "approved",
        "declined",
        "escalated",
        "call_to_office",
      ],
      escalation_department: [
        "fire",
        "police",
        "immigration",
        "health",
        "education",
        "transportation",
        "ministry",
        "nemc",
        "brela",
        "sumatra",
      ],
      verification_status: ["pending", "verified", "rejected"],
    },
  },
} as const
