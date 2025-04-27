import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const REQUIRED = { required: "This field is required" };

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

export const addSearchParam = (
  searchParams: any,
  name: string,
  value: string
) => {
  const params = new URLSearchParams(searchParams.toString());
  params.set(name, value);
  return params.toString();
};

export const removeSearchParam = (searchParams: any, name: string) => {
  const params = new URLSearchParams(searchParams.toString());
  params.delete(name);
  return params.toString();
};
