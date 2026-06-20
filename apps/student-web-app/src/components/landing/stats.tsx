"use client";

import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Users,
  GraduationCap,
  BookOpen,
  Wifi,
  Sparkles,
  Search,
} from "lucide-react";
import { publicController } from "@/chulatutordream/services/controller/public";

function AnimatedNumber({
  value,
  inView,
  prefix,
  suffix,
}: {
  value: number;
  inView: boolean;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <>
      {prefix}
      {inView ? (
        <CountUp start={0} end={value} duration={1.8} separator="," />
      ) : (
        value.toLocaleString("th-TH")
      )}
      {suffix}
    </>
  );
}

function StatCard({
  icon,
  label,
  value,
  suffix,
  prefix,
  inView,
  delay,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  inView: boolean;
  delay: number;
  accent: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className="relative group"
    >
      <div
        className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r ${accent} opacity-40 blur group-hover:opacity-70 transition-opacity`}
      />
      <div className="relative bg-white rounded-2xl p-6 shadow-md h-full">
        <div
          className={`inline-flex p-2.5 rounded-xl bg-gradient-to-r ${accent} text-white mb-4`}
        >
          {icon}
        </div>
        <p className="text-gray-500 text-sm mb-1">{label}</p>
        <p className="text-3xl md:text-4xl font-bold text-gray-800">
          <AnimatedNumber
            value={value}
            inView={inView}
            prefix={prefix}
            suffix={suffix}
          />
        </p>
      </div>
    </motion.div>
  );
}

export default function StatsSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });
  const { data: stats } = useQuery({
    queryKey: ["publicStats"],
    queryFn: () => publicController.GetStats(),
    staleTime: 5 * 60 * 1000,
  });

  const s = stats?.student;
  const topSubjects = s?.top_open_subjects ?? [];

  return (
    <section
      ref={ref}
      className="relative py-20 overflow-hidden bg-gradient-to-b from-pink-50 via-white to-purple-50/50"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-1/4 w-72 h-72 rounded-full bg-pink-200/30 blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-64 h-64 rounded-full bg-purple-200/30 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-pink-100 text-pink-800 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            ไว้ใจได้ด้วยตัวเลขจริง
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
              ติวเตอร์คุณภาพ พร้อมสอนให้คุณ
            </span>
          </h2>
          <p className="mt-3 text-gray-600 max-w-xl mx-auto">
            โพสต์งานแล้วรอติวเตอร์มาจอง — เลือกคนที่ใช่ได้เอง
          </p>
        </motion.div>

        {/* Hero highlight */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="relative max-w-3xl mx-auto mb-10"
        >
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-pink-400 via-purple-400 to-fuchsia-400 opacity-60 blur-lg" />
          <div className="relative bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl px-8 py-10 text-center text-white shadow-xl">
            <GraduationCap className="w-10 h-10 mx-auto mb-3 opacity-90" />
            <p className="text-pink-100 text-lg mb-1">
              ติวเตอร์ที่ผ่านการคัดเลือก
            </p>
            <p className="text-6xl md:text-7xl font-bold tracking-tight">
              <AnimatedNumber value={s?.verified_tutors ?? 0} inView={inView} />
              <span className="text-3xl md:text-4xl font-semibold ml-2">คน</span>
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto mb-10">
          <StatCard
            icon={<Users className="w-5 h-5" />}
            label="นักเรียนทั้งหมด"
            value={s?.unique_students ?? 0}
            suffix=" คน"
            inView={inView}
            delay={0.15}
            accent="from-violet-400 to-purple-500"
          />
          <StatCard
            icon={<Search className="w-5 h-5" />}
            label="งานที่เปิดอยู่ตอนนี้"
            value={s?.open_jobs ?? 0}
            suffix=" งาน"
            inView={inView}
            delay={0.25}
            accent="from-pink-400 to-rose-500"
          />
          <StatCard
            icon={<BookOpen className="w-5 h-5" />}
            label="งานทั้งหมดบนแพลตฟอร์ม"
            value={s?.total_jobs ?? 0}
            suffix=" งาน"
            inView={inView}
            delay={0.35}
            accent="from-fuchsia-400 to-pink-500"
          />
          <StatCard
            icon={<Wifi className="w-5 h-5" />}
            label="งานสอนออนไลน์ที่เปิดอยู่"
            value={s?.online_jobs ?? 0}
            suffix=" งาน"
            inView={inView}
            delay={0.45}
            accent="from-cyan-400 to-blue-500"
          />
          <StatCard
            icon={<Sparkles className="w-5 h-5" />}
            label="วิชาที่มีติวเตอร์รองรับ"
            value={s?.subject_count ?? 0}
            suffix=" วิชา"
            inView={inView}
            delay={0.55}
            accent="from-amber-400 to-orange-500"
          />
        </div>

        {topSubjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <p className="text-gray-500 text-sm mb-3">
              วิชาที่มีติวเตอร์กำลังหางานอยู่
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {topSubjects.map(({ subject, count }) => (
                <span
                  key={subject}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-pink-200 text-gray-800 text-sm font-medium shadow-sm"
                >
                  {subject}
                  <span className="text-pink-600 font-bold">{count}</span>
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
