"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSharedConstants } from "@/chulatutordream/components/hooks/constant-context";
import { jobController } from "@/chulatutordream/services/controller/job";
import { useQuery } from "@tanstack/react-query";
import { Spin, Tag } from "antd";
import {
  CalendarIcon,
  GraduationCapIcon,
  MapPinIcon,
  UsersIcon,
  BanknoteIcon as BanknotesIcon,
  GlobeIcon,
  BookOpenIcon,
  InfoIcon,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LanguageIcon } from "@heroicons/react/24/outline";

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

function JobCard({ job }) {
  const { subjects } = useSharedConstants();
  const subjectName = subjects[job.subjectId] || `วิชารหัส ${job.subjectId}`;
  // Map status to appropriate color
  // Map status to appropriate color
  const getStatusColor = (status) => {
    switch (status) {
      case "created":
        return "bg-[#F8D2DA] text-gray-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="overflow-hidden border-l-4 border-l-[#F8D2DA] hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">
              รหัสงาน: {job.description}
            </CardTitle>
            <p className="text-muted-foreground text-sm mt-1">
              โรงเรียน: {job.school}
            </p>
          </div>
          <div>
            <Badge
              className="text-lg px-3 py-3 mr-2 bg-blue-100 text-black"
              variant="outline"
            >
              ค่า commission: {job?.referral_fee * 0.2} บาท
            </Badge>
            <Badge
              className={`text-lg px-3 py-3 ${getStatusColor(job.status)}`}
              variant="outline"
            >
              {job.status}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpenIcon className="h-5 w-5 text-[#F8D2DA]" />
              <div>
                <p className="font-medium">วิชา</p>
                <p className="text-muted-foreground">{subjectName}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <GraduationCapIcon className="h-5 w-5 text-[#F8D2DA]" />
              <div>
                <p className="font-medium">ระดับการศึกษา</p>
                <p className="text-muted-foreground">{job.level}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MapPinIcon className="h-5 w-5 text-[#F8D2DA]" />
              <div>
                <p className="font-medium">สถานที่</p>
                <div className="flex items-center gap-1">
                  <p className="text-muted-foreground">{job.location}</p>
                  {job.online && (
                    <GlobeIcon className="h-4 w-4 text-green-500" />
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <UsersIcon className="h-5 w-5 text-[#F8D2DA]" />
              <div>
                <p className="font-medium">จำนวนนักเรียน</p>
                <p className="text-muted-foreground">{job.learner_number}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <BookOpenIcon className="h-5 w-5 text-[#F8D2DA]" />
              <div>
                <p className="font-medium">พื้นฐานของนักเรียน</p>
                <p className="text-muted-foreground">{job.fundamental}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-[#F8D2DA]" />
              <div>
                <p className="font-medium">ตารางเรียน</p>
                <p className="text-muted-foreground">
                  {job.available_date_time}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <LanguageIcon className="h-5 w-5 text-[#F8D2DA]" />
              <div>
                <p className="font-medium">สอนเป็นภาษา</p>
                <p className="text-muted-foreground">
                  {job.learn_language ?? "ไทย"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <BanknotesIcon className="h-5 w-5 text-[#F8D2DA]" />
              <div>
                <p className="font-medium">ค่าตอบแทน</p>
                <p className="text-muted-foreground">
                  ฿{job.fee} ต่อชั่วโมง (ค่าแนะนำ: ฿{job.referral_fee})
                </p>
              </div>
            </div>

            <div>
              <p className="font-medium mb-1">แท็ก</p>
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag) => (
                  <Badge key={tag.id} variant="secondary">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
