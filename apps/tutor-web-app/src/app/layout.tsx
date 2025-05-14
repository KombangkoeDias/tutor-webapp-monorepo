import "./globals.css";

import ClientLayout from "./ClientLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Job Tutor Dream | หางานสอนพิเศษ ทุกระดับชั้นทุกวิชา",
  description:
    "เข้าร่วมกับเราเพื่อหางานสอนพิเศษทุกระดับชั้นทุกวิชา และพบกับนักเรียนที่กำลังมองหาครูสอนพิเศษ",
  keywords: ["ติวเตอร์", "งานสอน", "ครูสอนพิเศษ", "หานักเรียน", "สอนออนไลน์"],
  openGraph: {
    title: "Job Tutor Dream | หางานสอนพิเศษ ทุกระดับชั้นทุกวิชา",
    description: "เข้าร่วมกับเราเพื่อหางานสอนพิเศษ ทุกระดับชั้นทุกวิชา",
    url: "https://jobtutordream.com",
    siteName: "Job Tutor Dream",
    images: [
      {
        url: "https://jobtutordream.com/og-image.png",
        width: 800,
        height: 800,
      },
    ],
    locale: "th_TH",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="https://i.ibb.co/99Kgt3d2/favicon.png" />
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
