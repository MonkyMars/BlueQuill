import { database } from "../client";
import { DocumentType } from "../types";

export async function saveDocument(
  document: DocumentType,
  collectionName: string = "Documents"
) {
  try {
    const { data: existingDocument } = await database
      .from(collectionName)
      .select("*")
      .eq("id", document.id);
    if (existingDocument && existingDocument.length > 0) {
      const { data, error } = await database
        .from(collectionName)
        .update({
          title: document.title,
          content: document.content,
          updatedAt: document.updatedAt,
        })
        .eq("id", document.id);
      if (error) {
        return {
          data: error,
          status: 500,
        };
      }
      return {
        data,
        status: 200,
      };
    } else {
        const { data, error } = await database
        .from(collectionName)
        .insert({
          title: document.title,
          content: document.content,
          updatedAt: document.updatedAt,
        });
        if (error) {
            return {
              data: error,
              status: 500,
            };
          }
          return {
            data,
            status: 200,
          };
    }
  } catch (error) {
    console.error("Error inserting document:", error);
    throw new Error("Document insertion failed");
  }
}
