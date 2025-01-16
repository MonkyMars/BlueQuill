import { database } from "@/utils/client";

export async function deleteUserDocument(document_id: string, user_id: string) {
  try {
    const { error } = await database.from("Documents").delete().eq("id", document_id).eq("owner", user_id);

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: `An unexpected error occurred while deleting document: ${error}`,
    };
  }
}