"use client";
import { jobController } from "@/services/controller/job";
import { sharedController } from "@/services/controller/shared";
import { useQuery } from "@tanstack/react-query";
import React, { createContext, useContext, ReactNode, useState } from "react";

export function toReactSelectOptions(mapping: { [key: number]: string }) {
  return Object.entries(mapping).map(([key, value]) => ({
    label: value,
    value: key.toString(),
  }));
}

// Define the context type
interface ConstantContextType {
  isLoading: boolean;
  isLoadingProvinces: boolean;
  isLoadingAmphoes: boolean;
  isLoadingTambons: boolean;
  provinceId: string | undefined;
  amphoeId: string | undefined;
  tambonId: string | undefined;
  setProvinceId: Function;
  setAmphoeId: Function;
  setTambonId: Function;
  provinces: { id: string; name: string }[];
  amphoes: { id: string; name_th: string }[];
  tambons: { id: string; name_th: string; zip_code: string }[];
}

// Create the context with default values
const ConstantContext = createContext<ConstantContextType | undefined>(
  undefined
);

// Provider component
export const LocationConstantProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [provinceId, setProvinceId] = useState(undefined);
  const [amphoeId, setAmphoeId] = useState(undefined);
  const [tambonId, setTambonId] = useState(undefined);

  const { data: provinces, isFetching: isLoadingProvinces } = useQuery({
    queryKey: ["getAllProvinces"],
    queryFn: async () => {
      const resp = await sharedController.GetAllProvinces();
      return resp.provinces;
    },
    initialData: [],
  });

  const { data: amphoes, isFetching: isLoadingAmphoes } = useQuery({
    queryKey: ["amphoesByProvince", provinceId],
    queryFn: async () => {
      const resp = await sharedController.GetAmphoesByProvinceId(
        provinceId ?? 0
      );
      return resp.amphoes;
    },
    initialData: [],
    enabled: provinceId !== undefined,
  });

  const { data: tambons, isFetching: isLoadingTambons } = useQuery({
    queryKey: ["tambonsByAmphoe", amphoeId],
    queryFn: async () => {
      const resp = await sharedController.GetTambonsByAmphoeId(amphoeId ?? 0);
      return resp.tambons;
    },
    initialData: [],
    enabled: amphoeId !== undefined,
  });

  const isLoading = isLoadingProvinces || isLoadingAmphoes || isLoadingTambons;

  return (
    <ConstantContext.Provider
      value={{
        provinces,
        amphoes,
        tambons,
        isLoading,
        isLoadingProvinces,
        isLoadingAmphoes,
        isLoadingTambons,
        setProvinceId,
        setAmphoeId,
        setTambonId,
        provinceId,
        amphoeId,
        tambonId,
      }}
    >
      {children}
    </ConstantContext.Provider>
  );
};

// Custom hook to use the logged-in state
export const useLocationConstants = () => {
  const context = useContext(ConstantContext);
  if (!context) {
    throw new Error(
      "useLocationConstants must be used within a LocationConstantProvider"
    );
  }
  return context;
};
