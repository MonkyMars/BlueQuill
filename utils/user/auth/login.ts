import { database } from "@/utils/client";

export async function login(email: string, password: string) {
  try {
    const { data, error } = await database.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    if (!data?.user) {
      return {
        success: false,
        error: "Login failed, no user data returned.",
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: `An unexpected error occurred during login: ${error}`,
    };
  }
}