import { clsx, type ClassValue } from "clsx";
import toast from "react-hot-toast";
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

export const copyToClipboard = async (link: string) => {
  try {
    await navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard!");
  } catch (err) {
    toast.error(`Failed to copy link: ${err}`);
  }
};

export const handleGenerateLink = async (code: string) => {
  const baseLink = "https://test.chulatutordream.com"; // Replace with your actual URL
  const link = `${baseLink}/jobs/create?utm_ref=${code}`;
  await copyToClipboard(link);
};

export const handleSignUpLink = async (code: string) => {
  const baseLink = "https://test.jobtutordream.com"; // Replace with your actual URL
  const link = `${baseLink}/tutor/signup?utm_ref=${code}`;
  await copyToClipboard(link);
};

export const handleListReferredJobsLink = async (code: string) => {
  const baseLink = "https://test.chulatutordream.com"; // Replace with your actual URL
  const link = `${baseLink}/jobs/referral?utm_ref=${code}`;
  await copyToClipboard(link);
};
