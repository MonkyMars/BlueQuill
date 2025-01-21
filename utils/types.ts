export interface DocumentType {
  id: string;
  title: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
  owner: string;
  type?: "blog" | "article" | "academic" | "script";
  status?: "draft" | "completed";
}

export interface ProfileType {
  created_at: string;
  email: string;
  full_name: string;
  plan: string;
  role: string;
  updated_at: string;
  user_id: string;
}
