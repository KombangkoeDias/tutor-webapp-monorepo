"use client";
import { jobController } from "@/services/controller/job";
import { useQuery } from "@tanstack/react-query";
import React, { createContext, useContext, ReactNode } from "react";

export function toReactSelectOptions(mapping: { [key: number]: string }) {
  return Object.entries(mapping).map(([key, value]) => ({
    label: value,
    value: key.toString(),
  }));
}

// Define the context type
interface ConstantContextType {
  isLoading: boolean;
  isLoadingSubjects: boolean;
  isLoadingTags: boolean;
  subjects: { [key: number]: string };
  tags: { [key: number]: string };
}

// Create the context with default values
const ConstantContext = createContext<ConstantContextType | undefined>(
  undefined
);

// Provider component
export const ConstantProvider = ({ children }: { children: ReactNode }) => {
  const { data: subjects, isFetching: isLoadingSubjects } = useQuery({
    queryKey: ["getAllSubjects"],
    queryFn: async () => {
      return jobController.GetSubjects();
    },
    initialData: {},
  });

  const { data: tags, isFetching: isLoadingTags } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      return jobController.GetTags();
    },
    initialData: {},
  });

  const isLoading = isLoadingSubjects || isLoadingTags;

  return (
    <ConstantContext.Provider
      value={{ subjects, tags, isLoading, isLoadingSubjects, isLoadingTags }}
    >
      {children}
    </ConstantContext.Provider>
  );
};

// Custom hook to use the logged-in state
export const useSharedConstants = () => {
  const context = useContext(ConstantContext);
  if (!context) {
    throw new Error("useLoggedIn must be used within a LoggedInProvider");
  }
  return context;
};
