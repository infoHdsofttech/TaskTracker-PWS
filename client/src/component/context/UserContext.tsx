"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { fetchLoggedInUserdata } from "@/actions/auth";

// Define the shape of the user data. Replace `any` with a more specific type if available.
interface User {
  id: string;
  name: string;
  email: string;
  // Add any other fields your API returns
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
}

// Create the context; default value is undefined.
const UserContext = createContext<UserContextType | undefined>(undefined);

// Custom hook to use the User Context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch the logged-in user data when the provider mounts.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchLoggedInUserdata();
        console.log("User data fetched:", data);
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
