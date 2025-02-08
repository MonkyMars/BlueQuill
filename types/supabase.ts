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
      documents: {
        Row: {
          id: string
          created_at: string
          title: string
          content: string
          owner: string
          updated_at: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          content: string
          owner: string
          updated_at?: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          content?: string
          owner?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_owner_fkey"
            columns: ["owner"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      collaborators: {
        Row: {
          id: string
          document_id: string
          user_id: string
          role: 'editor' | 'viewer'
          created_at: string
        }
        Insert: {
          id?: string
          document_id: string
          user_id: string
          role: 'editor' | 'viewer'
          created_at?: string
        }
        Update: {
          id?: string
          document_id?: string
          user_id?: string
          role?: 'editor' | 'viewer'
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "collaborators_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collaborators_document_id_fkey"
            columns: ["document_id"]
            referencedRelation: "documents"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 