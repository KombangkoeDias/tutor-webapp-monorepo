"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { jobController } from "@/chulatutordream/services/controller/job";
import { useQuery } from "@tanstack/react-query";
import { Spin, Tag } from "antd";
import { InfoIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import JobCard from "@/chulatutordream/components/shared/job_card";

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
    <div className="container mx-auto py-8 px-4">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          งานทั้งหมดที่ refer โดยคุณ {referrer?.name}
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          เมื่อนักเรียนหาติวเตอร์สำหรับงานนั้นๆได้สำเร็จและนักเรียนได้เรียนกับติวเตอร์เรียบร้อยแล้ว
          ท่านจะได้รับค่า referral ของงานนั้นๆ
        </p>
      </header>

      <StatusLegend />

      <div className="m-4"></div>

      <Separator />

      {isFetching && (
        <div className="flex justify-center items-center m-4">
          <Spin />
        </div>
      )}

      {!isFetching && jobs?.length === 0 && (
        <div>
          <p className="mx-auto text-center m-4">ยังไม่มีงานที่ refer โดยคุณ</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 mt-4">
        {jobs?.map((job) => <JobCard key={job.id} job={job} />)}
      </div>
    </div>
  );
}

function StatusLegend() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border">
      <div className="flex items-center gap-2 mb-2">
        <InfoIcon className="h-5 w-5 text-[#F8D2DA]" />
        <h3 className="font-medium">สถานะงาน</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <div className="flex items-center gap-2">
          <Badge className="bg-[#F8D2DA] text-gray-800" variant="outline">
            created
          </Badge>
          <span className="text-sm text-muted-foreground">
            งานได้ถูกสร้างขึ้นแล้ว กำลังรอติวเตอร์มาสมัคร
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-100 text-green-800" variant="outline">
            approved
          </Badge>
          <span className="text-sm text-muted-foreground">
            นักเรียนได้เลือกติวเตอร์แล้ว กำลังรอติวเตอร์ยืนยัน
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-red-100 text-red-800" variant="outline">
            cancelled
          </Badge>
          <span className="text-sm text-muted-foreground">
            งานได้ถูกยกเลิกโดยนักเรียนหรือแอดมิน
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-purple-100 text-purple-800" variant="outline">
            completed
          </Badge>
          <span className="text-sm text-muted-foreground">
            ติวเตอร์ได้ยืนยันงานแล้ว งานเสร็จสมบูรณ์
          </span>
        </div>
      </div>
    </div>
  );
}
