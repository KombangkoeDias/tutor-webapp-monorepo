import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "แนะนำเพื่อน | รับสิทธิพิเศษ",
  description:
    "แนะนำเพื่อนมาใช้บริการ Chula Tutor Dream และรับสิทธิประโยชน์พิเศษ",
  path: "/jobs/referral",
  noIndex: true,
});

export default function ReferralLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
