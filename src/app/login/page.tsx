"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth, useUser } from "reactfire";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const auth = useAuth();
  const { data: user, status } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (status === "success" && user) {
      router.replace("/");
    }
  }, [user, status, router]);

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // // Optionally redirect or show success
    } catch (e) {
      console.debug(e);
      // Handle error
      alert("Google sign-in failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">
          Sign in to your account
        </h2>
        <Button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full"
          variant="default"
        >
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}
