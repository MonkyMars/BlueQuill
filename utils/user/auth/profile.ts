import { database } from "@/utils/client";

export const fetchProfile = async(uuid: string) => {
  try{
    const { data, error } = await database.from("profiles").select().eq("user_id", uuid).single();
    if (error) {
      console.error(`An error occurred while fetching profile: ${error.message}`);
      return null;
    }
    return data;
  } catch (error) {
    console.error(`An unexpected error occurred while fetching profile: ${error}`);
  };
}