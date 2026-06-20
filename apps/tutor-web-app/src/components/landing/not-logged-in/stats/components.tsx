"use client";

import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Briefcase,
  Users,
  GraduationCap,
  Wifi,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { publicController } from "@/services/controller/public";

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
        <p className="text-3xl md:text-4xl font-bold text-[#263238]">
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

function StatsSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });
  const { data: stats } = useQuery({
    queryKey: ["publicStats"],
    queryFn: () => publicController.GetStats(),
    staleTime: 5 * 60 * 1000,
  });

  const s = stats?.tutor;
  const topSubjects = s?.top_open_subjects ?? [];

  return (
    <section
      ref={ref}
      className="relative py-20 overflow-hidden bg-gradient-to-b from-white via-emerald-50/50 to-teal-50"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 right-1/4 w-72 h-72 rounded-full bg-teal-200/30 blur-3xl" />
        <div className="absolute bottom-10 left-1/4 w-64 h-64 rounded-full bg-emerald-200/30 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            โอกาสรอคุณอยู่ตรงนี้
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#263238]">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
              ความต้องการติวเตอร์จริง จากนักเรียนจริง
            </span>
          </h2>
          <p className="mt-3 text-gray-600 max-w-xl mx-auto">
            ดูงานที่เปิดอยู่ตอนนี้ แล้วเลือกจองได้เลย — ไม่ต้องรอให้ระบบจับคู่
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
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 opacity-60 blur-lg" />
          <div className="relative bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl px-8 py-10 text-center text-white shadow-xl">
            <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-90" />
            <p className="text-emerald-100 text-lg mb-1">งานที่เปิดรับจองอยู่ตอนนี้</p>
            <p className="text-6xl md:text-7xl font-bold tracking-tight">
              <AnimatedNumber value={s?.open_jobs ?? 0} inView={inView} />
              <span className="text-3xl md:text-4xl font-semibold ml-2">งาน</span>
            </p>
          </div>
        </motion.div>

        {/* Stat cards */}
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
            icon={<GraduationCap className="w-5 h-5" />}
            label="ติวเตอร์ที่ผ่านการคัดเลือก"
            value={s?.verified_tutors ?? 0}
            suffix=" คน"
            inView={inView}
            delay={0.25}
            accent="from-blue-400 to-indigo-500"
          />
          <StatCard
            icon={<Briefcase className="w-5 h-5" />}
            label="งานทั้งหมดบนแพลตฟอร์ม"
            value={s?.total_jobs ?? 0}
            suffix=" งาน"
            inView={inView}
            delay={0.35}
            accent="from-rose-400 to-pink-500"
          />
          <StatCard
            icon={<Wifi className="w-5 h-5" />}
            label="งานสอนออนไลน์ที่เปิดอยู่"
            value={s?.online_jobs ?? 0}
            suffix=" งาน"
            inView={inView}
            delay={0.45}
            accent="from-cyan-400 to-teal-500"
          />
          <StatCard
            icon={<Sparkles className="w-5 h-5" />}
            label="วิชาที่เปิดรับ"
            value={s?.subject_count ?? 0}
            suffix=" วิชา"
            inView={inView}
            delay={0.55}
            accent="from-amber-400 to-orange-500"
          />
          <StatCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="การจองงานทั้งหมด"
            value={s?.total_reservations ?? 0}
            suffix=" ครั้ง"
            inView={inView}
            delay={0.65}
            accent="from-emerald-400 to-green-500"
          />
        </div>

        {/* Top subjects */}
        {topSubjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <p className="text-gray-500 text-sm mb-3">
              วิชาที่มีงานเปิดอยู่ตอนนี้
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {topSubjects.map(({ subject, count }) => (
                <span
                  key={subject}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-emerald-200 text-[#263238] text-sm font-medium shadow-sm"
                >
                  {subject}
                  <span className="text-emerald-600 font-bold">{count}</span>
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default StatsSection;
