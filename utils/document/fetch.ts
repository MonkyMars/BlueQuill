import { database } from "../client";
import { DocumentType } from "../types";

export async function fetchDocument(
  documentId: string,
  collectionName: string = "Documents"
): Promise<DocumentType | null> {
  try {
    const { data: document } = await database
      .from(collectionName)
      .select("*")
      .eq("id", documentId)
      .single();
    return document;
  } catch (error) {
    console.error("Error fetching document:", error);
    return null;
  }
}