"use client";

import { useUser } from "reactfire";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingState from "@/components/LoadingState";
import Header from "@/components/Header";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user, status } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (status === "success" && !user) {
      router.replace("/login");
    }
  }, [user, status, router]);

  if (status === "loading") {
    return <LoadingState message="Authenticating, please wait..." />;
  }

  return (
    <>
      <Header />
      {children}
    </>
  );
}
