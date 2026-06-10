import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "เลือกติวเตอร์",
  description: "เลือกติวเตอร์สำหรับงานสอนของคุณ",
  path: "/jobs/reservation/list",
  noIndex: true,
});

export default function ReservationListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
