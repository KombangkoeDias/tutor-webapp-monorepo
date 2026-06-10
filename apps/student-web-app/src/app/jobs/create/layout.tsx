import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "หาติวเตอร์ | ลงทะเบียนหาติวเตอร์ส่วนตัว",
  description:
    "ลงทะเบียนหาติวเตอร์ส่วนตัวจากจุฬาฯ ธรรมศาสตร์ และมหาวิทยาลัยชั้นนำ เลือกวิชา ระดับชั้น และรูปแบบการเรียนที่เหมาะกับคุณ",
  path: "/jobs/create",
});

export default function CreateJobLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
