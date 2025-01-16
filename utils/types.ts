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
