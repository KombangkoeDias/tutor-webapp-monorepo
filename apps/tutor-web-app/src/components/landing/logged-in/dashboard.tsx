"use client";
import { useLoggedIn } from "@/components/hooks/login-context";
import { CalendarDays } from "lucide-react";
import { JobHistoryTableMode } from "./job-history";
import { useRouter } from "next/navigation";
import { JobTableMode } from "@/app/jobs/page";
import JobsPage from "@/app/jobs/page";
import dynamic from "next/dynamic";

const JobHistoryTable = dynamic(
  () => import("@/components/landing/logged-in/job-history"),
  {
    ssr: false,
  }
);

export default function TutorDashboard() {
  const { tutor } = useLoggedIn();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            ยินดีต้อนรับ, {tutor?.name ?? ""}!
          </h1>
        </div>
        <div className="flex items-center gap-2 text-gray-600 bg-white px-4 py-2 rounded-lg shadow-sm">
          <CalendarDays className="w-5 h-5 text-[#4CAF4F]" />
          <span>{new Date().toDateString()}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <JobHistoryTable mode={JobHistoryTableMode.CONCISE} />
        <JobsPage mode={JobTableMode.CONCISE} />
      </div>
    </div>
  );
}
