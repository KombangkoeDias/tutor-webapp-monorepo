"use client";

import JobReferral from "@/components/shared/referral/job_referral";
import { cn } from "@/lib/utils";
import { jobController } from "@/services/controller/job";
import { tutorController } from "@/services/controller/tutor";
import { useQuery } from "@tanstack/react-query";
import { Spin } from "antd";

import React, { useEffect, useState } from "react";
import TutorReferral from "@/components/shared/referral/tutor_referral";
import { useAuthRedirect } from "@/components/hooks/use-auth-redirect";

const tabs = [
  {
    label: "ติวเตอร์ที่ refer โดยคุณ",
  },
  {
    label: "งานที่ refer โดยคุณ",
  },
];

const ReferralPage = () => {
  useAuthRedirect();
  const {
    data: referral,
    isFetching: isFetchingReferral,
    refetch,
  } = useQuery({
    queryKey: ["getReferral"],
    queryFn: async () => {
      return (await tutorController.getReferral()).referral;
    },
    initialData: {},
  });

  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    // Check if referral code exists
    if (!isFetchingReferral && !referral?.code) {
      tutorController.createReferral().then(() => {
        refetch();
      });
    }
  }, [referral]);

  if (isFetchingReferral) {
    return (
      <div className="w-full h-[100vh] flex justify-center items-center">
        <Spin />
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 flex justify-center border-b">
        <div className="flex space-x-4 px-4">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={cn(
                "relative py-4 text-lg font-medium transition-colors focus:outline-none",
                activeTab === index
                  ? "text-teal-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-teal-600"
                  : "text-muted-foreground hover:text-teal-600"
              )}
            >
              <div
                className={cn(
                  "rounded-md border-2 px-6 py-3 transition-all",
                  activeTab === index
                    ? "border-teal-500 bg-teal-50 text-teal-700 dark:border-teal-400 dark:bg-teal-950/30 dark:text-teal-300"
                    : "border-muted bg-transparent hover:border-teal-300 hover:text-teal-600 dark:hover:border-teal-700 dark:hover:text-teal-400"
                )}
              >
                {tab.label}
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 flex justify-center mr-5">
        {activeTab == 0 && <TutorListingPage code={referral?.code} />}
        {activeTab == 1 && <JobListingPage code={referral?.code} />}
      </div>
    </>
  );
};

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
      color="teal"
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
      color="teal"
      code={code}
    />
  );
};

export default ReferralPage;
