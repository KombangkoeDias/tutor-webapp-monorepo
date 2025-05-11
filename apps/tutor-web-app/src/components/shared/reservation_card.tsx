import { useSharedConstants } from "../hooks/constant-context";
import { Badge } from "@/components/ui/badge";
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

export default function JobCard({ reservation }) {
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
    <Card
      className="overflow-hidden border-l-4 hover:shadow-md transition-shadow"
      style={{ borderLeftColor: "#F8D2DA" }}
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
