"use client";
import { JobHistoryTableMode } from "@/components/landing/logged-in/job-history";
import dynamic from "next/dynamic";
import React from "react";

const JobHistoryTable = dynamic(
  () => import("@/components/landing/logged-in/job-history"),
  {
    ssr: false,
  }
);

export default function ReservationHistoryPage() {
  return <JobHistoryTable pageSize={20} mode={JobHistoryTableMode.DETAILED} />;
}
