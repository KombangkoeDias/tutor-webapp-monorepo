"use client";

import { jobController } from "@/chulatutordream/services/controller/job";
import { tutorController } from "@/chulatutordream/services/controller/tutor";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import JobReferral from "@/chulatutordream/components/shared/referral/job_referral";
import TutorReferral from "@/chulatutordream/components/shared/referral/tutor_referral";
import { cn } from "@/chulatutordream/lib/utils";

const tabs = [
  {
    label: "ติวเตอร์ที่ refer โดยคุณ",
  },
  {
    label: "งานที่ refer โดยคุณ",
  },
];

export default function ReferralPage() {
  const [activeTab, setActiveTab] = useState(0);

  const urlSearchParams = useSearchParams();
  const code = urlSearchParams.get("utm_ref") ?? undefined;
  const router = useRouter();

  useEffect(() => {
    if (!code) {
      router.push("/");
    }
  }, []);

  return (
    <div className="w-full">
      <div className="mb-8 flex justify-center border-b">
        <div className="flex space-x-4 px-4">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={cn(
                "relative py-4 text-lg font-medium transition-colors focus:outline-none",
                activeTab === index
                  ? "text-pink-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-pink-600"
                  : "text-muted-foreground hover:text-pink-600"
              )}
            >
              <div
                className={cn(
                  "rounded-md border-2 px-6 py-3 transition-all",
                  activeTab === index
                    ? "border-pink-500 bg-pink-50 text-pink-700 dark:border-pink-400 dark:bg-teal-950/30 dark:text-pink-300"
                    : "border-muted bg-transparent hover:border-pink-300 hover:text-pink-600 dark:hover:border-pink-700 dark:hover:text-pink-400"
                )}
              >
                {tab.label}
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 flex justify-center">
        {activeTab == 0 && <TutorListingPage code={code} />}
        {activeTab == 1 && <JobListingPage code={code} />}
      </div>
    </div>
  );
}

const JobListingPage = ({ code }) => {
  const {
    data: { jobs, referrer },
    isFetching,
  } = useQuery({
    queryKey: ["getAllJobReferral"],
    queryFn: async () => {
      if (code) {
        return await jobController.GetAllJobReferral(code);
      }
    },
    initialData: { jobs: [], referrer: {} },
    enabled: !!code,
  });

  return (
    <JobReferral
      isFetching={isFetching}
      jobs={jobs}
      referrer={referrer}
      color="pink"
      code={code}
    />
  );
};

const TutorListingPage = ({ code }) => {
  const {
    data: { referrer, ...data },
    isFetching,
  } = useQuery({
    queryKey: ["getAllTutorReferral"],
    queryFn: async () => {
      if (code) {
        return await tutorController.listByReferral(code);
      }
    },
    initialData: { jobs: [], referrer: {} },
    enabled: !!code,
  });

  return (
    <TutorReferral
      data={data}
      isFetching={isFetching}
      referrer={referrer}
      color="pink"
      code={code}
    />
  );
};
