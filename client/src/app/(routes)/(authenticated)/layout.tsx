"use client";
import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import NavigationMenuLayout from "@/component/UI/Layouts/NavigationMenuLayout";

export default function AuthenticatedLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/signup"); // or wherever your login is
    }
  }, [router]);

  return <NavigationMenuLayout>{children}</NavigationMenuLayout>;
}
