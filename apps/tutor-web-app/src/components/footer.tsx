import { Facebook, Instagram, Youtube } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useLoggedIn } from "./hooks/login-context";
import z from "zod";
import { useState } from "react";
import { tutorController } from "@/services/controller/tutor";
import Link from "next/link";

const schema = z.object({
  email: z.string({ required_error: "กรุณากรอกอีเมล" }).email(),
});

export default function Footer() {
  const [email, setEmail] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const { loggedIn } = useLoggedIn();
  return (
    <footer className="bg-[#263238] text-white py-12">
      <div className="px-4">
        <div
          className={`grid grid-cols-1 ${
            loggedIn ? "md:grid-cols-3" : "md:grid-cols-3"
          } gap-4 flex justify-center`}
        >
          <div>
            <Image
              src="/logo.png" // Path to your image (local or external URL)
              alt="logo"
              width={130} // Set the width of the image
              height={60}
            />
            <h3 className="font-bold mb-4">Job Tutor Dream</h3>
            <p className="text-sm text-gray-400">Copyright © 2025</p>
            <p className="text-sm text-gray-400">All rights reserved</p>
            <div className="flex gap-4 mt-4">
              <Link
                href="https://lin.ee/xTlIo62"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/pics/line.svg"
                  alt="line logo"
                  width={20}
                  height={20}
                />
              </Link>
              <Link
                href="https://www.facebook.com/share/15uPmDqZAu/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              </Link>
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-4">Job Tutor Dream</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <Link href="/jobs">
                <li className="mb-2">งานสอนพิเศษทั้งหมด</li>
              </Link>

              <Link href="/jobs/steps">
                <li>ขั้นตอนการรับงาน</li>
              </Link>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <Link href="/contact_us">
                <li>ติดต่อทีมงาน</li>
              </Link>
              <li>Terms of service</li>
            </ul>
          </div>
          {!loggedIn && (
            <div>
              <h3 className="font-bold mb-4">Stay up to date</h3>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Your email address"
                  className="bg-[#374151] border-gray-600"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button
                  variant="secondary"
                  onClick={async (e) => {
                    e.preventDefault();
                    const result = schema.safeParse({ email });
                    if (!result.success) {
                      setErrMsg(result.error.errors.at(0)?.message ?? "");
                    } else {
                      setErrMsg("");
                      await tutorController.AddEmailForNews(result.data.email);
                    }
                  }}
                >
                  →
                </Button>
              </div>
              {errMsg && (
                <div className="col-span-2 text-center mt-2">
                  <p style={{ color: "red" }}>{errMsg}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
