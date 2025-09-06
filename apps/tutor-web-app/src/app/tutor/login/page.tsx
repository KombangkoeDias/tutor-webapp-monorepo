"use client";

import { useLoggedIn } from "@/components/hooks/login-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { tutorController } from "@/services/controller/tutor";
import { JWT_TOKEN_KEY } from "@/services/http-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { loggedIn, setLoggedIn, setTutor } = useLoggedIn();
  const router = useRouter();

  useEffect(() => {
    if (loggedIn) {
      router.push("/");
    }
  }, [loggedIn]);

  return (
    <div className="min-h-[calc(100vh-64px)] flex justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-semibold mb-8">เข้าสู่ระบบติวเตอร์</h1>

        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const resp = await tutorController.Login({
              email: username,
              password,
            });
            if (resp.token) {
              localStorage?.setItem(JWT_TOKEN_KEY, resp.token);
              setTutor(resp.tutor);
              setLoggedIn(true);
            } else {
              setTutor(undefined);
              setLoggedIn(false);
            }
          }}
        >
          <div className="space-y-2">
            <label className="text-sm" htmlFor="username">
              อีเมล
            </label>
            <Input
              id="username"
              placeholder="กรุณากรอกอีเมล"
              required
              type="text"
              className="w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm" htmlFor="password">
              รหัสผ่าน
            </label>
            <Input
              id="password"
              required
              placeholder="กรุณากรอกรหัสผ่าน"
              type="password"
              className="w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Link
            href="/tutor/forget-password"
            className="text-sm text-[#4caf4f] hover:text-[#4caf4f]/80 hover:underline block"
          >
            ลืมรหัสผ่าน
          </Link>

          <Button
            type="submit"
            className="w-full bg-[#4caf4f] hover:bg-[#4caf4f]/90 text-white"
          >
            เข้าสู่ระบบ
          </Button>
          {/* {!errMsg && <div className="space-y-2"></div>}
          {errMsg && (
            <div className="space-y-2" style={{ color: "red" }}>
              {errMsg}
            </div>
          )} */}
        </form>
        <p className="text-sm text-center text-gray-600">
          ยังไม่มี account ใช่หรือไม่?{" "}
          <Link href="/tutor/signup" className="text-[#4caf4f] hover:underline">
            สมัครสมาชิก
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
