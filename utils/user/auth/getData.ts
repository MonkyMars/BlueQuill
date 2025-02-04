import { database } from "@/utils/client";
import { userDataDownloadType } from "@/utils/types";

export const getData = async (userId: string) => {
  try {
    const profile = await database
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();
    const documents = await database
      .from("Documents")
      .select("*")
      .eq("owner", userId);
    console.log("documents", documents);
    console.log("profile", profile);

    return {
      user_metadata: {
        full_name: profile.data.full_name,
        email: profile.data.email,
        plan: profile.data.plan,
        created_at: profile.data.created_at,
      },
      documents: documents.data?.map((doc) => {
        return {
          created_at: doc.created_at,
          title: doc.title,
          content: doc.content,
        };
      }),
    } as userDataDownloadType;
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
    };
  }
};

export const downloadData = async (data: userDataDownloadType) => {
  const element = document.createElement("a");
  const file = new Blob([JSON.stringify(data)], { type: "application/json" });
  element.href = URL.createObjectURL(file);
  element.download = `${data.user_metadata.email}.json`;
  document.body.appendChild(element);
  element.click();
};

export const deleteData = async (userId: string) => {
  try {
    const { error } = await database.rpc("deletedata", {
      user_id: userId,
    });
    if (error) throw new Error(error.message);
    await database.auth.admin.deleteUser(userId);
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
    };
  }
};
