"use client";
import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import NavigationMenuLayout from "@/component/UI/Layouts/NavigationMenuLayout";
import { TaskProvider } from "@/component/context/TaskContext";
import { UserProvider } from "@/component/context/UserContext";

export default function AuthenticatedLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/signup"); // or wherever your login is
    }
  }, [router]);

  return (
  <NavigationMenuLayout>
        <UserProvider>
     <TaskProvider>
    {children}
    </TaskProvider>
    </UserProvider>
    </NavigationMenuLayout>);
}
