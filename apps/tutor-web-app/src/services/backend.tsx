import axiosClient from "@/services/http-client";
import { AxiosError } from "axios";

export enum APIStatus {
  SUCCESS = "success",
}

export async function POST(endpoint: string, data: any, config: any = {}) {
  try {
    const res = await axiosClient.post(endpoint, data, config);
    return res;
  } catch (err) {
    throw err;
  }
}

export async function GET(endpoint: string, config?: any) {
  try {
    const res = await axiosClient.get(endpoint, config);
    return res;
  } catch (err) {
    throw err;
  }
}

export async function PUT(endpoint: string, data: any, config?: any) {
  try {
    const res = await axiosClient.put(endpoint, data, config);
    return res;
  } catch (err) {
    console.log("kbd error", err);
    throw err;
  }
}

export const ENDPOINTS = {
  UPLOAD_ENDPOINT: "/tutor/upload",
  ADD_SLIP_ENDPOINT: "/tutor/add_slip",
  UPLOAD_RECEIPT_ENDPOINT: "/tutor/upload_receipt",
  SIGNUP_ENDPOINT: "/tutor/signup",
  LOGIN_ENDPOINT: "/tutor/login",
  AUTHENTICATE_ENDPOINT: "/tutor/authenticate",
  ADD_EMAIL_FOR_NEWS: "/tutor/add_email_for_news",
  RESEND_VERIFY_EMAIL_ENDPOINT: "/tutor/resend_verify_email",
  PROFILE_ENDPOINT: "/tutor/profile",
  VERIFY_TUTOR_ENDPOINT: "tutor/verify",
  RESERVATION_HISTORY_ENDPOINT: "/reservation/history",
  GET_JOBS_ENDPOINT: "/job/search",
  GET_SUBJECTS_ENDPOINT: "/job/get_all_subjects",
  GET_TAGS_ENDPOINT: "/job/get_all_tags",
  GET_JOB_BY_ID_ENDPOINT: (id: number) => `/job/${id}`,
  RESERVE_JOB_ENDPOINT: "/job/reserve",
  CANCEL_RESERVATION: "/tutor/cancel_reservation",
  GET_RESERVATION_BY_ID_ENDPOINT: (id: string) => `/reservation/${id}`,
  GENERATE_QR_CODE_ENDPOINT: `/reservation/qr`,
  GET_ALL_PROVINCES: "/shared/provinces",
  GET_AMPHOES_BY_PROVINCE: (provinceId: number) =>
    `/shared/amphoes?provinceId=${provinceId}`,
  GET_TAMBONS_BY_AMPHOE: (amphoeId: number) =>
    `/shared/tambons?amphoeId=${amphoeId}`,
};

export const toastCaption = {
  SUCCESS: <b>Success! ✅</b>,
  FAIL: (err: AxiosError) => {
    console.error("error", err.response?.data);
    return (
      <b>"Failed! 😭: {(err.response?.data as { error: string }).error}"</b>
    );
  },
};
