export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      sessions: {
        Row: {
          id: string;
          user_id: string;
          subject: string;
          topic: string;
          grade: number | null;
          feedback: string | null;
          transcript: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          subject: string;
          topic: string;
          grade?: number | null;
          feedback?: string | null;
          transcript?: Json | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["sessions"]["Insert"]>;
        Relationships: [];
      };
      session_messages: {
        Row: {
          id: string;
          session_id: string;
          role: "examiner" | "student";
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          role: "examiner" | "student";
          content: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["session_messages"]["Insert"]>;
        Relationships: [];
      };
      subscriptions: {
        Row: {
          user_id: string;
          plan: "free" | "premium";
          status: "active" | "canceled" | "past_due";
          stripe_customer_id: string | null;
          current_period_end: string | null;
        };
        Insert: {
          user_id: string;
          plan?: "free" | "premium";
          status?: "active" | "canceled" | "past_due";
          stripe_customer_id?: string | null;
          current_period_end?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["subscriptions"]["Insert"]>;
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          show_on_leaderboard: boolean | null;
          exam_date: string | null;
          exam_fag: string | null;
          exam_variant: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          show_on_leaderboard?: boolean | null;
          exam_date?: string | null;
          exam_fag?: string | null;
          exam_variant?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
    };
  };
}
