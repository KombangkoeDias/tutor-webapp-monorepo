"use client";

import { useLoggedIn } from "@/components/hooks/login-context";
import { tutorController } from "@/services/controller/tutor";
import { Spin } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const VerifyTutorPage = () => {
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  const code = searchParams.get("code");
  const email = searchParams.get("email");

  const [seconds, setSeconds] = useState(5);

  const router = useRouter();

  const { reAuthenticate } = useLoggedIn();

  const isArgsValid =
    code != null && code != "" && email != null && email != "";

  useEffect(() => {
    if (seconds <= 1) return;

    if (verified) {
      reAuthenticate();
      const timer = setInterval(() => {
        setSeconds((prev) => Math.max(1, prev - 1));
      }, 1000);
      return () => clearInterval(timer); // Cleanup on unmount
    }
  }, [verified]);

  useEffect(() => {
    if (seconds == 1) {
      router.push("/tutor/login");
    }
  }, [seconds]);

  useEffect(() => {
    if (isArgsValid) {
      tutorController
        .VerifyTutor(code, email)
        .then((_) => {
          setVerified(true);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  if (!isArgsValid) {
    return router.push("/tutor/login");
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex justify-center p-4">
      {loading && (
        <>
          <Spin size="large" className="mr-2" />
          <h1 className="text-2xl font-semibold mb-8">กำลังยืนยันติวเตอร์</h1>
        </>
      )}
      {!loading && verified && (
        <>
          <h1 className="text-2xl font-semibold mb-8">
            ✅ Email: {email} ได้รับการยืนยันเรียบร้อยแล้ว <br />{" "}
            กรุณาปิดหน้านี้ <br />
            ไปหน้า login ใน {seconds} วินาที
          </h1>
        </>
      )}
      {!loading && !verified && (
        <>
          <h1 className="text-2xl font-semibold mb-8">
            ❌ ไม่สามารถ ยืนยันอีเมล Email: {email} เนื่องจาก email
            ได้ยืนยันไปแล้ว หรือ ปัญหาอื่นๆ <br /> กรุณาตรวจเช็คลิงก์ของท่าน
          </h1>
        </>
      )}
    </div>
  );
};

export default VerifyTutorPage;
