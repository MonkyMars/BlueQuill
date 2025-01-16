import { database } from "@/utils/client";
import { DocumentType } from "@/utils/types";

export async function createUserDocument(document: DocumentType, user_id: string) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, ...docWithoutId } = document;
    const { data, error } = await database.from("Documents").insert({
      ...docWithoutId,
      owner: user_id,
    }).select().single();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    if (!data) {
      return {
        success: false,
        error: "Failed to create document: No data returned",
      };
    }
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      error: `An unexpected error occurred while creating document: ${error}`,
    };
  }
}