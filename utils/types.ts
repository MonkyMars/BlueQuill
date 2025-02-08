export interface Collaborator {
  userId: string;
  email: string;
  role: "editor" | "viewer";
  full_name?: string;
}

export interface DocumentType {
  id: string;
  title: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
  owner: string;
  type?: "blog" | "article" | "academic" | "script";
  status?: "draft" | "completed";
  collaborators: Collaborator[];
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

export interface userDataDownloadType {
  user_metadata: {
    full_name: string;
    email: string;
    plan: string;
    created_at: string;
  }
  documents: {
    created_at: string;
    title: string;
    content: string;
  }[]
}