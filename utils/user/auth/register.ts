import { database } from "@/utils/client";

export async function register(
  email: string,
  password: string,
  fullName: string
) {
  try {
    const { data, error } = await database.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
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
        error: "User creation failed, no user data returned.",
      };
    }

    const { error: profileError } = await database.from("profiles").insert({
      id: data.user.id,
      full_name: fullName,
      email: email,
      plan: "free",
    });

    if (profileError) {
      return {
        success: false,
        error: profileError.message,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: `An unexpected error occurred during registration: ${error}`,
    };
  }
}
