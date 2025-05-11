import { useSharedConstants } from "../../hooks/constant-context";
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
import { Spin, Tag } from "antd";
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
    <div className="container py-8 px-4">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          ติวเตอร์ทั้งหมดที่ refer โดยคุณ {referrer?.name}
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          เมื่อติวเตอร์ที่คุณแนะนำได้รับงานเป็นครั้งแรกและสอนเรียบร้อยแล้ว
          คุณจะได้รับค่า referral 20% ของค่าแนะนำ
        </p>
        <p className="max-w-2xl mx-auto mt-4">
          คลิกที่ปุ่มนี้เพื่อ คัดลอก ลิงก์ referral ของคุณ
          สำหรับการเชิญชวนติวเตอร์ใหม่มาสมัคร
        </p>
        <CopyButton
          className="mt-2"
          text="copy referral link"
          copyFunc={() => handleSignUpLink(code)}
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

      {!isFetching &&
        tutorsWithReservation.length === 0 &&
        tutorsWithoutReservation.length === 0 && (
          <div>
            <p className="mx-auto text-center mt-4">
              ยังไม่มีติวเตอร์ที่ refer โดยคุณ
            </p>
          </div>
        )}

      {(tutorsWithReservation.length > 0 ||
        tutorsWithoutReservation.length > 0) && (
        <Tabs defaultValue="with-reservation" className="mt-4">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="with-reservation">
              ติวเตอร์ที่สมัครงานแล้ว ({tutorsWithReservation.length})
            </TabsTrigger>
            <TabsTrigger value="without-reservation">
              ติวเตอร์ที่ยังไม่สมัครงาน ({tutorsWithoutReservation.length})
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
      )}
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
        <div className="flex items-center gap-2 mt-4">
          <Tag color="blue" style={tagStyle}>
            reserved
          </Tag>
          <span className="text-sm text-muted-foreground">
            ติวเตอร์ได้จองงานแล้ว รอการตอบรับจากนักเรียน
          </span>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <Tag color="green" style={tagStyle}>
            approved
          </Tag>
          <span className="text-sm text-muted-foreground">
            นักเรียนได้อนุมัติติวเตอร์แล้ว
          </span>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <Tag color="gold" style={tagStyle}>
            backup
          </Tag>
          <span className="text-sm text-muted-foreground">
            ติวเตอร์อยู่ในรายชื่อสำรอง
          </span>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <Tag color="red" style={tagStyle}>
            rejected
          </Tag>
          <span className="text-sm text-muted-foreground">
            นักเรียนปฏิเสธติวเตอร์
          </span>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <Tag color="orange" style={tagStyle}>
            pending-refund
          </Tag>
          <span className="text-sm text-muted-foreground">
            อยู่ระหว่างการคืนเงิน
          </span>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <Tag color="cyan" style={tagStyle}>
            refunded
          </Tag>
          <span className="text-sm text-muted-foreground">
            คืนเงินเรียบร้อยแล้ว
          </span>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <Tag color="red" style={tagStyle}>
            cancelled
          </Tag>
          <span className="text-sm text-muted-foreground">งานถูกยกเลิก</span>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <Tag color="purple" style={tagStyle}>
            completed
          </Tag>
          <span className="text-sm text-muted-foreground">งานเสร็จสมบูรณ์</span>
        </div>
      </div>
    </div>
  );
}

function TutorWithReservationCard({ tutor, color }) {
  const { subjects } = useSharedConstants();
  const subjectName =
    subjects[tutor.job.subject] || `วิชารหัส ${tutor.job.subject}`;

  const textColor = color ? `text-[${color}]` : "text-[#F8D2DA]";

  // Map status to appropriate color
  const getStatusColor = (status) => {
    switch (status) {
      case "reserved":
        return "blue";
      case "approved":
        return "green";
      case "backup":
        return "gold";
      case "rejected":
        return "red";
      case "pending-refund":
        return "orange";
      case "refunded":
        return "cyan";
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
        <div className="flex justify-between items-start flex-wrap gap-2">
          <div>
            <CardTitle className="text-xl font-bold">
              รหัสงาน: {tutor.job.description}
            </CardTitle>
            <p className="text-muted-foreground text-sm mt-1">
              ติวเตอร์: {tutor.tutor.name}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Tag color="blue" style={{ fontSize: "16px", padding: "8px 12px" }}>
              ค่า referral: {tutor.job.referral_reward.toFixed(0)} บาท
            </Tag>
            <Tag
              color={getStatusColor(tutor.status)}
              style={{ fontSize: "16px", padding: "8px 12px" }}
            >
              {tutor.status}
            </Tag>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpenIcon className={`h-5 w-5 ${textColor}`} />
              <div>
                <p className="font-medium">วิชา</p>
                <p className="text-muted-foreground">{subjectName}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <GraduationCapIcon className={`h-5 w-5 ${textColor}`} />
              <div>
                <p className="font-medium">ระดับชั้นผู้เรียน</p>
                <p className="text-muted-foreground">{tutor.job.level}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MapPinIcon className={`h-5 w-5 ${textColor}`} />
              <div>
                <p className="font-medium">สถานที่เรียน</p>
                <p className="text-muted-foreground">{tutor.job.location}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BanknoteIcon className={`h-5 w-5 ${textColor}`} />
              <div>
                <p className="font-medium">ค่าแนะนำ</p>
                <p className="text-muted-foreground">
                  ฿{tutor.job.fee} ต่อชั่วโมง (ค่าสอนที่เสนอ: ฿
                  {tutor.job.propose_fee})
                </p>
              </div>
            </div>
            คุณจะได้รับค่า referral
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
          <Tag color="gold">ยังไม่มีงาน</Tag>
        </div>
      </CardContent>
    </Card>
  );
}
