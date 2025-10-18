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
      collections: {
        Row: {
          created_at: string
          id: string
          item_id: string
          item_type: string
          notes: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          item_type: string
          notes?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          item_type?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      field_notes: {
        Row: {
          content: string
          created_at: string
          id: string
          latitude: number | null
          location_name: string | null
          longitude: number | null
          photos: string[] | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
          weather_conditions: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          latitude?: number | null
          location_name?: string | null
          longitude?: number | null
          photos?: string[] | null
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
          weather_conditions?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          latitude?: number | null
          location_name?: string | null
          longitude?: number | null
          photos?: string[] | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
          weather_conditions?: string | null
        }
        Relationships: []
      }
      geological_sites: {
        Row: {
          accessibility: string | null
          age: string | null
          best_visit_time: string | null
          country: string
          created_at: string
          description: string
          district: string | null
          geological_formation: string | null
          id: string
          image_url: string | null
          latitude: number
          longitude: number
          name: string
          rock_types: string[] | null
          significance: string | null
          state: string
          updated_at: string
        }
        Insert: {
          accessibility?: string | null
          age?: string | null
          best_visit_time?: string | null
          country: string
          created_at?: string
          description: string
          district?: string | null
          geological_formation?: string | null
          id?: string
          image_url?: string | null
          latitude: number
          longitude: number
          name: string
          rock_types?: string[] | null
          significance?: string | null
          state: string
          updated_at?: string
        }
        Update: {
          accessibility?: string | null
          age?: string | null
          best_visit_time?: string | null
          country?: string
          created_at?: string
          description?: string
          district?: string | null
          geological_formation?: string | null
          id?: string
          image_url?: string | null
          latitude?: number
          longitude?: number
          name?: string
          rock_types?: string[] | null
          significance?: string | null
          state?: string
          updated_at?: string
        }
        Relationships: []
      }
      minerals: {
        Row: {
          chemical_formula: string | null
          cleavage: string | null
          color: string | null
          created_at: string
          crystal_system: string | null
          description: string
          fracture: string | null
          hardness: number
          id: string
          image_url: string | null
          locations: string[] | null
          luster: string | null
          name: string
          specific_gravity: number | null
          streak: string | null
          updated_at: string
          uses: string | null
        }
        Insert: {
          chemical_formula?: string | null
          cleavage?: string | null
          color?: string | null
          created_at?: string
          crystal_system?: string | null
          description: string
          fracture?: string | null
          hardness: number
          id?: string
          image_url?: string | null
          locations?: string[] | null
          luster?: string | null
          name: string
          specific_gravity?: number | null
          streak?: string | null
          updated_at?: string
          uses?: string | null
        }
        Update: {
          chemical_formula?: string | null
          cleavage?: string | null
          color?: string | null
          created_at?: string
          crystal_system?: string | null
          description?: string
          fracture?: string | null
          hardness?: number
          id?: string
          image_url?: string | null
          locations?: string[] | null
          luster?: string | null
          name?: string
          specific_gravity?: number | null
          streak?: string | null
          updated_at?: string
          uses?: string | null
        }
        Relationships: []
      }
      pois: {
        Row: {
          caregory: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          image_url: string | null
          latitude: number | null
          longitude: number | null
          name: string | null
        }
        Insert: {
          caregory?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string | null
        }
        Update: {
          caregory?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          full_name: string
          id: string
          institute: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name: string
          id: string
          institute?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string
          id?: string
          institute?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      rocks: {
        Row: {
          color: string | null
          composition: string | null
          created_at: string
          description: string
          formation_process: string | null
          grain_size: string | null
          hardness: number | null
          id: string
          image_url: string | null
          locations: string[] | null
          name: string
          texture: string | null
          type: string
          updated_at: string
          uses: string | null
        }
        Insert: {
          color?: string | null
          composition?: string | null
          created_at?: string
          description: string
          formation_process?: string | null
          grain_size?: string | null
          hardness?: number | null
          id?: string
          image_url?: string | null
          locations?: string[] | null
          name: string
          texture?: string | null
          type: string
          updated_at?: string
          uses?: string | null
        }
        Update: {
          color?: string | null
          composition?: string | null
          created_at?: string
          description?: string
          formation_process?: string | null
          grain_size?: string | null
          hardness?: number | null
          id?: string
          image_url?: string | null
          locations?: string[] | null
          name?: string
          texture?: string | null
          type?: string
          updated_at?: string
          uses?: string | null
        }
        Relationships: []
      }
      scan_history: {
        Row: {
          confidence: number | null
          created_at: string
          id: string
          identified_as: string
          image_url: string
          item_id: string | null
          item_type: string
          notes: string | null
          user_id: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          id?: string
          identified_as: string
          image_url: string
          item_id?: string | null
          item_type: string
          notes?: string | null
          user_id: string
        }
        Update: {
          confidence?: number | null
          created_at?: string
          id?: string
          identified_as?: string
          image_url?: string
          item_id?: string | null
          item_type?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: []
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
          role: Database["public"]["Enums"]["app_role"]
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
      voice_notes: {
        Row: {
          audio_url: string
          created_at: string
          duration: number | null
          id: string
          language: string | null
          title: string
          transcription: string | null
          user_id: string
        }
        Insert: {
          audio_url: string
          created_at?: string
          duration?: number | null
          id?: string
          language?: string | null
          title: string
          transcription?: string | null
          user_id: string
        }
        Update: {
          audio_url?: string
          created_at?: string
          duration?: number | null
          id?: string
          language?: string | null
          title?: string
          transcription?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_user_stats: {
        Args: { user_uuid: string }
        Returns: {
          total_bookmarks: number
          total_field_notes: number
          total_scans: number
          total_voice_notes: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      search_minerals: {
        Args: {
          max_hardness?: number
          min_hardness?: number
          search_query?: string
        }
        Returns: {
          chemical_formula: string | null
          cleavage: string | null
          color: string | null
          created_at: string
          crystal_system: string | null
          description: string
          fracture: string | null
          hardness: number
          id: string
          image_url: string | null
          locations: string[] | null
          luster: string | null
          name: string
          specific_gravity: number | null
          streak: string | null
          updated_at: string
          uses: string | null
        }[]
      }
      search_rocks: {
        Args: {
          max_hardness?: number
          min_hardness?: number
          rock_type?: string
          search_query?: string
        }
        Returns: {
          color: string | null
          composition: string | null
          created_at: string
          description: string
          formation_process: string | null
          grain_size: string | null
          hardness: number | null
          id: string
          image_url: string | null
          locations: string[] | null
          name: string
          texture: string | null
          type: string
          updated_at: string
          uses: string | null
        }[]
      }
    }
    Enums: {
      app_role: "student" | "lecturer" | "professional"
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
      app_role: ["student", "lecturer", "professional"],
    },
  },
} as const
