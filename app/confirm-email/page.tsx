"use client";

import React, { useState, useEffect } from "react";
import { database } from "@/utils/client";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";

const ConfirmEmailPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const {
      data: { subscription },
    } = database.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user?.email_confirmed_at) {
        router.push("/documents");
      }
    });

    const checkAuthState = async () => {
      const {
        data: { user },
      } = await database.auth.getUser();
      if (user?.email_confirmed_at) {
        router.push("/documents");
      }
    };
    checkAuthState();

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const handleResendConfirmation = async () => {
    if (!email) {
      setIsError(true);
      return;
    }

    setIsLoading(true);
    setIsError(false);

    try {
      const { error } = await database.auth.resend({
        type: "signup",
        email,
      });

      if (error) {
        console.error("Error resending confirmation:", error.message);
        setIsError(true);
      } else {
        setIsSuccess(true);
      }
    } catch (err) {
      console.error("Failed to resend confirmation email:", err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Check your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We sent a confirmation email to{" "}
            <span className="font-medium text-indigo-600">{email}</span>
          </p>
          <p className="mt-2 text-center text-sm text-gray-500">
            Click the link in the email to confirm your account
          </p>
        </div>

        <div className="mt-5">
          <p className="text-center text-sm text-gray-500">
            Didn&apos;t receive the email?
          </p>
          <Button
            onClick={handleResendConfirmation}
            disabled={isLoading}
            className="mt-3 w-full flex justify-center py-2 px-4"
          >
            {isLoading ? "Sending..." : "Resend confirmation email"}
          </Button>
        </div>
        {isSuccess && (
          <p className="text-center text-sm text-green-600">
            Confirmation email resent successfully!
          </p>
        )}
        {isError && (
          <p className="text-center text-sm text-red-600">
            Error resending confirmation email
          </p>
        )}
      </div>
    </div>
  );
};

export default ConfirmEmailPage;
