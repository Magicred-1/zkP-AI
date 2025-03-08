export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string | null
          email: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name?: string | null
          email?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          email?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      agents: {
        Row: {
          id: string
          name: string
          description: string | null
          type: string
          avatar_url: string | null
          config: Json
          is_active: boolean
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          type: string
          avatar_url?: string | null
          config?: Json
          is_active?: boolean
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          type?: string
          avatar_url?: string | null
          config?: Json
          is_active?: boolean
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      agent_interactions: {
        Row: {
          id: string
          agent_id: string
          user_id: string
          input: string
          output: string
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          agent_id: string
          user_id: string
          input: string
          output: string
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          agent_id?: string
          user_id?: string
          input?: string
          output?: string
          metadata?: Json
          created_at?: string
        }
      }
    }
  }
}