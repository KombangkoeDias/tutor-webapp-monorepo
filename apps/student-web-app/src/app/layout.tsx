import "./globals.css";
import ClientLayout from "./ClientLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Chula Tutor Dream | หาติวเตอร์ส่วนตัว เรียนพิเศษ ทุกระดับชั้น ทุกวิชา",
  description: "หาติวเตอร์สอนพิเศษทุกระดับชั้นทุกวิชา",
  keywords: ["หาติวเตอร์", "เรียนเพิ่มเติม", "เรียนพิเศษ", "เรียนออนไลน์"],
  openGraph: {
    title:
      "Chula Tutor Dream | หาติวเตอร์ส่วนตัว เรียนพิเศษ ทุกระดับชั้น ทุกวิชา",
    description: "หาติวเตอร์สอนพิเศษทุกระดับชั้นทุกวิชา",
    url: "https://chulatutordream.com",
    siteName: "Chula Tutor Dream",
    images: [
      {
        url: "https://chulatutordream.com/favicon.png",
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
        <link rel="icon" href="https://i.ibb.co/7NVLT3LT/favicon.png" />
        <title>Chula Tutor Dream</title>
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
