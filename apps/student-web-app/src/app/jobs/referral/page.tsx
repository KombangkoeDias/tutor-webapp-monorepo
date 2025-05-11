"use client";

import { jobController } from "@/chulatutordream/services/controller/job";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import JobReferral from "@/chulatutordream/components/shared/referral/job_referral";

export default function JobListingPage() {
  const urlSearchParams = useSearchParams();
  const code = urlSearchParams.get("utm_ref") ?? undefined;
  const router = useRouter();

  useEffect(() => {
    if (!code) {
      router.push("/");
    }
  }, []);

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
      color={undefined}
    />
  );
}
