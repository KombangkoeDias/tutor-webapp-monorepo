import { useSharedConstants } from "../../hooks/constant-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { LanguageIcon } from "@heroicons/react/24/outline";
import { Separator } from "@/components/ui/separator";
import { Spin, Tag } from "antd";
import { handleGenerateLink } from "../../../lib/utils";
import { CopyButton } from "../copy-button";

export default function JobReferral({
  code,
  jobs,
  isFetching,
  referrer,
  color,
}) {
  return (
    <div className="container py-8 px-4">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          งานทั้งหมดที่ refer โดยคุณ {referrer?.name}
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          เมื่อนักเรียนหาติวเตอร์สำหรับงานนั้นๆได้สำเร็จและนักเรียนได้เรียนกับติวเตอร์เรียบร้อยแล้ว
          ท่านจะได้รับค่า referral ของงานนั้นๆ
        </p>
        <p className="max-w-2xl mx-auto mt-4">
          คลิกที่ปุ่มนี้เพื่อ คัดลอก ลิงก์ referral ของคุณ
          สำหรับการเชิญชวนนักเรียนผู้ปกครองมาสร้างงาน
        </p>
        <CopyButton
          className="mt-2"
          text="copy referral link"
          copyFunc={() => handleGenerateLink(code)}
          color={color}
        />
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
        {jobs?.map((job) => <JobCard key={job.id} job={job} color={color} />)}
      </div>
    </div>
  );
}

function StatusLegend() {
  const tagStyle = { fontSize: "14px", padding: "6px 10px" };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border">
      <div className="flex items-center gap-2 mb-2">
        <InfoIcon className="h-5 w-5 text-[#F8D2DA]" />
        <h3 className="font-medium">สถานะงาน</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <div className="flex items-center gap-2">
          <Tag color="pink" style={tagStyle}>
            created
          </Tag>
          <span className="text-sm text-muted-foreground">
            งานได้ถูกสร้างขึ้นแล้ว กำลังรอติวเตอร์มาสมัคร
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Tag color="green" style={tagStyle}>
            approved
          </Tag>
          <span className="text-sm text-muted-foreground">
            นักเรียนได้เลือกติวเตอร์แล้ว กำลังรอติวเตอร์ยืนยัน
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Tag color="red" style={tagStyle}>
            cancelled
          </Tag>
          <span className="text-sm text-muted-foreground">
            งานได้ถูกยกเลิกโดยนักเรียนหรือแอดมิน
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Tag color="purple" style={tagStyle}>
            completed
          </Tag>
          <span className="text-sm text-muted-foreground">
            ติวเตอร์ได้ยืนยันงานแล้ว งานเสร็จสมบูรณ์
          </span>
        </div>
      </div>
    </div>
  );
}

function JobCard({ job, color }) {
  const { subjects } = useSharedConstants();
  const subjectName = subjects[job.subjectId] || `วิชารหัส ${job.subjectId}`;
  const largeTagStyle = { fontSize: "16px", padding: "8px 12px" };
  const normalTagStyle = { fontSize: "14px", padding: "6px 10px" };
  // Map status to appropriate color
  const getStatusColor = (status) => {
    switch (status) {
      case "created":
        return "pink";
      case "approved":
        return "green";
      case "cancelled":
        return "red";
      case "completed":
        return "purple";
      default:
        return "default";
    }
  };

  return (
    <Card
      className="overflow-hidden border-l-4 hover:shadow-md transition-shadow"
      style={{ borderLeftColor: color ?? "#F8D2DA" }}
    >
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
            <Tag color="blue" style={{ ...largeTagStyle, marginRight: "8px" }}>
              ค่า commission: {job?.referral_fee * 0.2} บาท
            </Tag>
            <Tag color={getStatusColor(job.status)} style={largeTagStyle}>
              {job.status}
            </Tag>
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
