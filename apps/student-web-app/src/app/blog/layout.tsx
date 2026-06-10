import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "บล็อกการศึกษา | เทคนิคและเคล็ดลับการเรียน",
  description:
    "อ่านบทความการศึกษา เทคนิคการเรียน และประสบการณ์จริงจากผู้เชี่ยวชาญ เพื่อเตรียมสอบและพัฒนาทักษะการเรียน",
  path: "/blog",
  image: "/blog/cover.png",
});

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
