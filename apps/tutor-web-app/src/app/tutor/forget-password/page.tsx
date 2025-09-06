"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { tutorController } from "@/services/controller/tutor";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const ForgetPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Call backend API for forget password
      await tutorController.ForgetPassword({ email });

      // Show success state instead of immediate redirect
      setIsSuccess(true);
    } catch (error) {
      console.error("Forget password error:", error);
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
              ส่งอีเมลสำเร็จ
            </h1>
            <p className="text-gray-600 text-sm mb-6">
              เราได้ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมล <strong>{email}</strong>{" "}
              แล้ว
              <br />
              กรุณาตรวจสอบอีเมลของคุณและคลิกลิงก์เพื่อรีเซ็ตรหัสผ่าน
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm">
                💡 <strong>คำแนะนำ:</strong> หากไม่พบอีเมล
                กรุณาตรวจสอบในโฟลเดอร์ Spam หรือ Junk
              </p>
            </div>
            <Button
              onClick={() => router.push("/tutor/login")}
              className="w-full bg-[#4caf4f] hover:bg-[#4caf4f]/90 text-white"
            >
              กลับไปหน้าเข้าสู่ระบบ
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">ลืมรหัสผ่าน</h1>
          <p className="text-gray-600 text-sm">
            กรุณากรอกอีเมลที่ใช้สมัครสมาชิก เราจะส่งลิงก์รีเซ็ตรหัสผ่านให้คุณ
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">
              อีเมล
            </label>
            <Input
              id="email"
              placeholder="กรุณากรอกอีเมล"
              required
              type="email"
              className="w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#4caf4f] hover:bg-[#4caf4f]/90 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "กำลังส่ง..." : "ส่งลิงก์รีเซ็ตรหัสผ่าน"}
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

export default ForgetPasswordForm;
