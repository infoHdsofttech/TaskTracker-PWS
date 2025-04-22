"use client";
import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import NavigationMenuLayout from "@/component/UI/Layouts/NavigationMenuLayout";
import { TaskProvider } from "@/component/context/TaskContext";
import { UserProvider } from "@/component/context/UserContext";

import { useAutoPause } from "@/utils/autopause";
import AutoPauseModal from "@/component/modals/AutoPauseModal";

export default function AuthenticatedLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/signup"); // or wherever your login is
    }
  }, [router]);

    // Hook that checks 6PM, schedules modal, and provides handlers
    const {
      open,
      handlePauseAll,
      handleKeepRunning,
      handleRemindLater,
      handleClose,
    } = useAutoPause();

    
  return (
  <NavigationMenuLayout>
        <UserProvider>
     <TaskProvider>
    {children}
    <AutoPauseModal
            open={open}
            onPauseAll={handlePauseAll}
            onKeepRunning={handleKeepRunning}
            onRemindLater={handleRemindLater}
            onClose={handleClose}
          />
    </TaskProvider>
    </UserProvider>
    </NavigationMenuLayout>);
}
