"use client";
import { JWT_TOKEN_KEY } from "@/services/http-client";
import { tutorController } from "@/services/controller/tutor";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

type TutorDetail = {
  email: string;
  name: string;
  email_verified: boolean;
  admin_verified: boolean;
  admin_comments: { created_at_ms: string; detail: string }[];
  updated_at_ms: string;
  profile_pic_original: string;
  profile_pic_crop_setting: string;
};

// Define the context type
interface LoggedInContextType {
  loggedIn: boolean;
  setLoggedIn: (status: boolean) => void;
  tutor: TutorDetail | undefined;
  setTutor: (tutor: any) => void;
  isLoading: boolean;
  isTutorAllVerified: () => boolean;
  reAuthenticate: () => void;
}

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

// Create the context with default values
const LoggedInContext = createContext<LoggedInContextType | undefined>(
  undefined
);

// Provider component
export const LoggedInProvider = ({ children }: { children: ReactNode }) => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false); // Default to not logged in
  const [tutor, setTutor] = useState<TutorDetail>();
  const [isLoading, setIsLoading] = useState(true);

  const isTutorAllVerified = () => {
    if (!loggedIn) {
      return false;
    }
    return (tutor?.email_verified && tutor?.admin_verified) ?? false;
  };

  useEffect(() => {
    authenticate();
  }, []);

  const authenticate = () => {
    const token = localStorage?.getItem(JWT_TOKEN_KEY);
    if (token !== null) {
      setLoggedIn(true);
      tutorController
        .Authenticate(token)
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
  };

  return (
    <LoggedInContext.Provider
      value={{
        loggedIn,
        setLoggedIn,
        tutor,
        setTutor,
        isLoading,
        isTutorAllVerified,
        reAuthenticate: authenticate,
      }}
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
