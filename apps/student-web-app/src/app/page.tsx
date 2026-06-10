import type { Metadata } from "next";
import HomeClient from "./home-client";
import { buildPageMetadata, DEFAULT_TITLE } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: DEFAULT_TITLE,
  path: "/",
  absoluteTitle: true,
});

export default function HomePage() {
  return <HomeClient />;
}
