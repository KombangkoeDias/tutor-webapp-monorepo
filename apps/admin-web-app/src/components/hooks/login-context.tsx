"use client";
import { JWT_TOKEN_KEY } from "@/chulatutordream/services/http-client";
import { adminController } from "@/services/controller";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

// Define the context type
interface LoggedInContextType {
  loggedIn: boolean;
  setLoggedIn: (status: boolean) => void;
  tutor:
    | {
        email: string;
        name: string;
        email_verified: boolean;
        admin_verified: boolean;
        admin_comments: { created_at_ms: string; detail: string }[];
        updated_at_ms: string;
      }
    | undefined;
  setTutor: (tutor: any) => void;
  isLoading: boolean;
}

// Create the context with default values
const LoggedInContext = createContext<LoggedInContextType | undefined>(
  undefined
);

export const getLatestComment = (
  admin_comments: { created_at_ms: string; detail: string }[] | undefined
) => {
  if (!admin_comments) {
    return undefined;
  }
  return admin_comments.reduce((latest, current) => {
    return current.created_at_ms > latest.created_at_ms ? current : latest;
  }, admin_comments[0]); // Initialize with the first comment
};

// Provider component
export const LoggedInProvider = ({ children }: { children: ReactNode }) => {
  const [loggedIn, setLoggedIn] = useState(false); // Default to not logged in
  const [tutor, setTutor] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage?.getItem(JWT_TOKEN_KEY);
    if (token !== null) {
      adminController
        .Authenticate()
        .then((res) => {
          localStorage?.setItem(JWT_TOKEN_KEY, res.token);
          setLoggedIn(true);
          setTutor(res.tutor);
        })
        .catch((err) => {
          localStorage?.removeItem(JWT_TOKEN_KEY);
          setLoggedIn(false);
          setTutor(undefined);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <LoggedInContext.Provider
      value={{ loggedIn, setLoggedIn, tutor, setTutor, isLoading }}
    >
      {children}
    </LoggedInContext.Provider>
  );
};

// Custom hook to use the logged-in state
export const useLoggedIn = () => {
  const context = useContext(LoggedInContext);
  if (!context) {
    throw new Error("useLoggedIn must be used within a LoggedInProvider");
  }
  return context;
};
