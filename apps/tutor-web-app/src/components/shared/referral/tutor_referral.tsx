import { useSharedConstants } from "../../hooks/constant-context";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  GraduationCapIcon,
  MapPinIcon,
  BanknoteIcon,
  BookOpenIcon,
  InfoIcon,
  UserIcon,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Spin } from "antd";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CopyButton } from "../copy-button";
import { handleSignUpLink } from "@/lib/utils";

export default function TutorReferral({
  code,
  data,
  isFetching,
  referrer,
  color,
}) {
  const tutorsWithReservation = data?.with_reservation || [];
  const tutorsWithoutReservation = data?.without_reservation || [];

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          ติวเตอร์ทั้งหมดที่ refer โดยคุณ {referrer?.name}
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          เมื่อติวเตอร์ที่คุณแนะนำได้รับงานและสอนเรียบร้อยแล้ว คุณจะได้รับค่า
          referral 20% ของค่าแนะนำ
        </p>
        <p className="max-w-2xl mx-auto mt-4">
          คลิกที่ปุ่มนี้เพื่อ คัดลอก ลิงก์ referral ของคุณ
          สำหรับการเชิญชวนติวเตอร์ใหม่มาสมัคร
        </p>
        <CopyButton
          className="mt-2"
          text="copy referral link"
          copyFunc={() => handleSignUpLink(code)}
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

      {!isFetching &&
        tutorsWithReservation.length === 0 &&
        tutorsWithoutReservation.length === 0 && (
          <div>
            <p className="mx-auto text-center m-4">
              ยังไม่มีติวเตอร์ที่ refer โดยคุณ
            </p>
          </div>
        )}

      {tutorsWithReservation.length >= 0 ||
        (tutorsWithoutReservation.length >= 0 && (
          <Tabs defaultValue="with-reservation" className="mt-6">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="with-reservation">
                ติวเตอร์ที่มีงาน ({tutorsWithReservation.length})
              </TabsTrigger>
              <TabsTrigger value="without-reservation">
                ติวเตอร์ที่ยังไม่มีงาน ({tutorsWithoutReservation.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="with-reservation">
              <div className="grid grid-cols-1 gap-6 mt-4">
                {tutorsWithReservation.map((tutor) => (
                  <TutorWithReservationCard
                    key={`${tutor.tutor.id}-${tutor.job.id}`}
                    tutor={tutor}
                    color={color}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="without-reservation">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                {tutorsWithoutReservation.map((tutor) => (
                  <TutorWithoutReservationCard
                    key={tutor.id}
                    tutor={tutor}
                    color={color}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        ))}
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

function TutorWithReservationCard({ tutor, color }) {
  const { subjects } = useSharedConstants();
  const subjectName =
    subjects[tutor.job.subject] || `วิชารหัส ${tutor.job.subject}`;

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
      style={{ borderLeftColor: color ?? "#F8D2DA" }}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start flex-wrap gap-2">
          <div>
            <CardTitle className="text-xl font-bold">
              ติวเตอร์: {tutor.tutor.name}
            </CardTitle>
            <p className="text-muted-foreground text-sm mt-1">
              รหัสงาน: {tutor.job.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge
              className="text-lg px-3 py-3 bg-blue-100 text-black"
              variant="outline"
            >
              ค่า referral: {tutor.job.referral_reward.toFixed(0)} บาท
            </Badge>
            <Badge
              className={`text-lg px-3 py-3 ${getStatusColor(tutor.status)}`}
              variant="outline"
            >
              {tutor.status}
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
                <p className="text-muted-foreground">{tutor.job.level}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MapPinIcon className="h-5 w-5 text-[#F8D2DA]" />
              <div>
                <p className="font-medium">สถานที่</p>
                <p className="text-muted-foreground">{tutor.job.location}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BanknoteIcon className="h-5 w-5 text-[#F8D2DA]" />
              <div>
                <p className="font-medium">ค่าตอบแทน</p>
                <p className="text-muted-foreground">
                  ฿{tutor.job.fee} ต่อชั่วโมง (ค่าที่เสนอ: ฿
                  {tutor.job.propose_fee})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-[#F8D2DA]" />
              <div>
                <p className="font-medium">รหัสติวเตอร์</p>
                <p className="text-muted-foreground">{tutor.tutor.id}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TutorWithoutReservationCard({ tutor, color }) {
  return (
    <Card
      className="overflow-hidden border-l-4 hover:shadow-md transition-shadow"
      style={{ borderLeftColor: color ?? "#F8D2DA" }}
    >
      <CardHeader>
        <CardTitle className="text-lg font-medium">{tutor.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <UserIcon className="h-5 w-5 text-[#F8D2DA]" />
          <div>
            <p className="font-medium">รหัสติวเตอร์</p>
            <p className="text-muted-foreground">{tutor.id}</p>
          </div>
        </div>
        <div className="mt-4">
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            ยังไม่มีงาน
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
