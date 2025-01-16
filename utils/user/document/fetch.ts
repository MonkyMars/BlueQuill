import { database } from "@/utils/client";
import { DocumentType } from "@/utils/types";

export async function fetchUserDocuments(user_id: string) {
  try {
    const { data, error } = await database
      .from("Documents")
      .select("*")
      .limit(10)
      .eq("owner", user_id);

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }
    return {
      success: true,
      data: data as DocumentType[],
    };
  } catch (error) {
    return {
      success: false,
      error: `An unexpected error occurred while fetching documents: ${error}`,
    };
  }
}
