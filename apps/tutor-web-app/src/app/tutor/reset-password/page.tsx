"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { tutorController } from "@/services/controller/tutor";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const ResetPasswordForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    // Validate token on component mount
    if (!token) {
      toast.error("ไม่พบ token สำหรับรีเซ็ตรหัสผ่าน");
      router.push("/tutor/login");
      return;
    }

    setIsValidToken(true);
    setIsLoading(false);
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("รหัสผ่านไม่ตรงกัน");
      return;
    }

    if (password.length < 6) {
      toast.error("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }

    setIsSubmitting(true);

    try {
      // Call backend API for reset password
      await tutorController.ResetPassword({ token: token!, password });

      // Show success state instead of immediate redirect
      setIsSuccess(true);
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold mb-2 text-green-600">
              รีเซ็ตรหัสผ่านสำเร็จ
            </h1>
            <p className="text-gray-600 text-sm mb-6">
              คุณได้รีเซ็ตรหัสผ่านเรียบร้อยแล้ว
              <br />
              กรุณาเข้าสู่ระบบด้วยรหัสผ่านใหม่ของคุณ
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 text-sm">
                ✅ <strong>สำเร็จ:</strong> รหัสผ่านของคุณได้รับการอัพเดตแล้ว
              </p>
            </div>
            <Button
              onClick={() => router.push("/tutor/login")}
              className="w-full bg-[#4caf4f] hover:bg-[#4caf4f]/90 text-white"
            >
              เข้าสู่ระบบ
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex justify-center items-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4caf4f] mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังตรวจสอบ token...</p>
        </div>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex justify-center items-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4 text-red-600">
            Token ไม่ถูกต้อง
          </h1>
          <p className="text-gray-600 mb-4">
            ลิงก์รีเซ็ตรหัสผ่านไม่ถูกต้องหรือหมดอายุแล้ว
          </p>
          <Link
            href="/tutor/forget-password"
            className="text-[#4caf4f] hover:underline"
          >
            ขอลิงก์รีเซ็ตรหัสผ่านใหม่
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">รีเซ็ตรหัสผ่าน</h1>
          <p className="text-gray-600 text-sm">กรุณากรอกรหัสผ่านใหม่ของคุณ</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="password">
              รหัสผ่านใหม่
            </label>
            <Input
              id="password"
              placeholder="กรุณากรอกรหัสผ่านใหม่"
              required
              type="password"
              className="w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="confirmPassword">
              ยืนยันรหัสผ่านใหม่
            </label>
            <Input
              id="confirmPassword"
              placeholder="กรุณากรอกรหัสผ่านใหม่อีกครั้ง"
              required
              type="password"
              className="w-full"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={6}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#4caf4f] hover:bg-[#4caf4f]/90 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "กำลังรีเซ็ต..." : "รีเซ็ตรหัสผ่าน"}
          </Button>
        </form>

        <div className="text-center">
          <Link
            href="/tutor/login"
            className="text-sm text-[#4caf4f] hover:underline"
          >
            กลับไปหน้าเข้าสู่ระบบ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
