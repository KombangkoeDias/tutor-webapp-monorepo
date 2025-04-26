"use client";
import { type ReactNode, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { tutorController } from "@/services/controller/tutor";

const HeroComponent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-emerald-50 to-teal-50 py-4 px-0">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-green-200 opacity-20 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-blue-200 opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-teal-100 opacity-10 blur-3xl"></div>
      </div>

      <main className="container relative mx-auto px-4 py-8 md:py-12 lg:py-16 items-center">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8 text-center lg:text-left justify-center"
          >
            <div className="space-y-4">
              <motion.div
                className="flex items-center space-x-4 justify-center lg:justify-start"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full blur-sm opacity-70 animate-pulse"></div>
                  <Image
                    src="/pics/mushroom-cat.png"
                    alt="cat"
                    width={100}
                    height={100}
                    className="relative rounded-full bg-white p-1"
                  />
                </div>
                <h1 className="text-[#2d3748] text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">
                  รับสมัครติวเตอร์
                </h1>
              </motion.div>
              <motion.h2
                className="text-[#4a5568] text-xl md:text-2xl font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                สอนทุกระดับชั้น ทั่วประเทศ
              </motion.h2>
            </div>

            <motion.p
              className="text-[#4a5568] text-lg max-w-md mx-auto lg:mx-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              สอนพิเศษตามบ้าน / ห้างสรรพสินค้า / Online ผ่าน Zoom
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Link href="/tutor/signup">
                <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-6 text-lg rounded-md shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  สมัครติวเตอร์
                </Button>
              </Link>
              {getNewsDialog(
                <Link href="">
                  <Button
                    variant="outline"
                    className="border-2 border-teal-400 text-teal-600 hover:bg-teal-50 px-8 py-6 text-lg rounded-md shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  >
                    ติดตามข่าวสาร
                  </Button>
                </Link>
              )}
            </motion.div>
          </motion.div>

          <motion.div
            className="aspect-[4/3] w-full hidden lg:block"
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            <div className="relative">
              <div className="absolute w-[635px] -inset-4 bg-gradient-to-r from-teal-200 to-emerald-200 rounded-2xl blur-md opacity-70"></div>
              <Image
                src="/pics/tutors.png"
                alt="tutors"
                width={600}
                height={600}
                className="relative rounded-2xl shadow-2xl transform hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default HeroComponent;

const getNewsDialog = (triggerButton: ReactNode) => {
  const [email, setEmail] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const schema = z.object({
    email: z.string({ required_error: "กรุณากรอกอีเมล" }).email(),
  });

  return (
    <Dialog>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-[450px] bg-gradient-to-b from-white to-teal-50 border-teal-200 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl text-teal-700">
            ติดตามข่าวสาร
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            ติดตามงานใหม่ๆจาก Job Tutor Dream ได้ผ่านช่องทางด้านล่าง
          </DialogDescription>
        </DialogHeader>
        <Separator className="my-4 bg-gradient-to-r from-transparent via-teal-200 to-transparent" />
        <motion.h5
          className="text-center font-medium text-teal-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          รับข่าวสาร Job Tutor Dream ผ่านทาง E-mail
        </motion.h5>
        <div className="grid gap-4 py-4 items-center">
          {!isSuccess ? (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right text-teal-700">
                  Email
                </Label>
                <Input
                  id="name"
                  className="col-span-3 border-teal-200 focus:border-teal-400 focus:ring-teal-400 transition-all duration-300"
                  placeholder="กรุณากรอกอีเมลของท่าน"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errMsg) setErrMsg("");
                  }}
                />
              </div>
              <div className="col-span-2 mt-4 flex justify-center">
                <Button
                  className={`bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white transition-all duration-300 ${
                    isSubmitting ? "opacity-70" : ""
                  }`}
                  onClick={async (e) => {
                    e.preventDefault();
                    setIsSubmitting(true);

                    const result = schema.safeParse({ email });
                    if (!result.success) {
                      setErrMsg(result.error.errors.at(0)?.message ?? "");
                      setIsSubmitting(false);
                    } else {
                      setErrMsg("");
                      try {
                        await tutorController.AddEmailForNews(
                          result.data.email
                        );
                        setIsSuccess(true);
                      } catch (error) {
                        setErrMsg("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
                      } finally {
                        setIsSubmitting(false);
                      }
                    }
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "กำลังส่ง..." : "Submit"}
                </Button>
              </div>
              {errMsg && (
                <motion.div
                  className="col-span-2 text-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-red-500 bg-red-50 p-2 rounded-md">
                    {errMsg}
                  </p>
                </motion.div>
              )}
            </>
          ) : (
            <motion.div
              className="text-center p-4 bg-green-50 rounded-lg border border-green-200"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-green-600 font-medium">
                ขอบคุณสำหรับการลงทะเบียน!
              </p>
              <p className="text-green-500 text-sm mt-1">
                เราจะส่งข่าวสารไปยังอีเมลของคุณเร็วๆ นี้
              </p>
            </motion.div>
          )}
        </div>

        <Separator
          className="my-4 bg-gradient-to-r from-transparent via-teal-200 to-transparent"
          decorative
        />
        <motion.h5
          className="text-center font-medium text-teal-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          เข้าร่วมไลน์เพื่อรับอัพเดทงาน
        </motion.h5>
        <motion.div
          className="flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="relative p-1 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-teal-400 rounded-lg blur-sm opacity-70 animate-pulse"></div>
            <Image
              src="/pics/line-qr.png"
              alt="line qr"
              width={120}
              height={120}
              priority
              className="relative rounded-md"
            />
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
