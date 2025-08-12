"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import {
  ChevronDown,
  ChevronUp,
  Award,
  GraduationCap,
  BookOpen,
  Star,
  Sparkles,
  Medal,
} from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function TutorsSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.01,
  });

  return (
    <section className="w-full py-16 relative overflow-hidden">
      {/* Subtle background with color */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-pink-50/30"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/pattern-dots.svg')] opacity-5"></div>

      {/* Subtle blob decorations */}
      {/* <div className="absolute top-40 right-10 w-72 h-72 bg-pink-100/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div> */}
      {/* <div className="absolute bottom-40 left-1/3 w-80 h-80 bg-purple-100/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div> */}

      <div className="px-4 md:px-6 relative z-10" ref={ref}>
        <motion.div
          className="flex flex-col items-center justify-center text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-4xl font-bold tracking-tight mb-4 text-gray-800"
            initial={{ scale: 0.9 }}
            animate={inView ? { scale: 1 } : { scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            ติวเตอร์ของเรา
          </motion.h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-200 to-pink-300 rounded-full mb-4"></div>
          <motion.p
            className="text-lg text-gray-600 max-w-3xl"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            มีติวเตอร์จากจุฬาฯ
            ธรรมศาสตร์ที่จบการศึกษาแล้วและกำลังศึกษาอยู่จากคณะแพทย์ วิศวะ
            และอื่นๆให้เลือก ทั้งจบจากไทยและจากมหาวิทยาลัยต่างประเทศ
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tutors.map((tutor, index) => (
            <motion.div
              key={tutor.name}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <TutorCard
                name={tutor.name}
                image={tutor.image}
                education={tutor.education}
                experience={tutor.experience}
                achievements={tutor.achievements}
                subjects={tutor.subjects}
                testScores={tutor.testScores}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface TutorCardProps {
  name: string;
  image: string;
  education: string[];
  experience: string[];
  achievements: string[];
  subjects: string[];
  testScores?: string[];
}

function TutorCard({
  name,
  image,
  education,
  experience,
  achievements,
  subjects,
  testScores,
}: TutorCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("education");
  const [isHovered, setIsHovered] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Check if any list has more than 5 items
  const activeTabHasMoreThanFiveItems = () => {
    switch (activeTab) {
      case "education":
        return education.length > 5;
      case "experience":
        return experience.length > 5;
      case "achievements":
        return (
          achievements.length > 5 ||
          (activeTab === "achievements" && testScores && testScores.length > 5)
        );
      default:
        return false;
    }
  };

  const cardVariants = {
    hover: {
      y: -8,
      boxShadow:
        "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -5px rgba(0, 0, 0, 0.02)",
      transition: { duration: 0.3 },
    },
    initial: {
      y: 0,
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.03), 0 2px 4px -1px rgba(0, 0, 0, 0.02)",
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="initial"
      animate={isHovered ? "hover" : "initial"}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="h-full"
    >
      <Card className="overflow-hidden h-full border border-gray-100 bg-white rounded-xl">
        <CardContent className="p-0 flex flex-col h-full">
          <div className="relative">
            {/* Subtle gradient header */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-50 to-purple-50 h-24 rounded-t-xl"></div>

            {/* Avatar with subtle effect */}
            <div className="relative pt-12 pb-4 flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={
                  inView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }
                }
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-white rounded-full blur-md transform scale-110 opacity-70"></div>
                <Avatar className="h-28 w-28 border-4 border-white shadow-sm relative z-10">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </Avatar>
                {/* Subtle sparkle */}
                <motion.div
                  className="absolute -top-2 -right-2 bg-pink-200 p-1 rounded-full z-20"
                  animate={{ rotate: [0, 15, 0, -15, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Sparkles className="h-4 w-4 text-pink-500" />
                </motion.div>
              </motion.div>

              <motion.h3
                className="text-xl font-bold mt-4 text-gray-800"
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {name}
              </motion.h3>

              <motion.div
                className="flex flex-wrap gap-2 mt-3 justify-center px-4"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {subjects.map((subject, index) => (
                  <motion.span
                    key={index}
                    className="inline-block bg-gradient-to-r from-pink-50 to-pink-100 text-pink-700 text-xs px-3 py-1 rounded-full border border-pink-100"
                    whileHover={{ scale: 1.05, y: -2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {subject}
                  </motion.span>
                ))}
              </motion.div>
            </div>
          </div>

          <div className="p-6 flex-grow">
            <Tabs
              defaultValue="education"
              className="w-full"
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full grid-cols-3 bg-gray-50">
                <TabsTrigger
                  value="education"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-100 data-[state=active]:to-pink-200 data-[state=active]:text-pink-800"
                >
                  <GraduationCap className="h-4 w-4 mr-1 text-gray-500" />
                  <span className="hidden sm:inline">การศึกษา</span>
                </TabsTrigger>
                <TabsTrigger
                  value="experience"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-100 data-[state=active]:to-pink-200 data-[state=active]:text-pink-800"
                >
                  <BookOpen className="h-4 w-4 mr-1 text-gray-500" />
                  <span className="hidden sm:inline">ประสบการณ์</span>
                </TabsTrigger>
                <TabsTrigger
                  value="achievements"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-100 data-[state=active]:to-pink-200 data-[state=active]:text-pink-800"
                >
                  <Award className="h-4 w-4 mr-1 text-gray-500" />
                  <span className="hidden sm:inline">ผลงาน</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="education"
                className="mt-4 h-[220px] overflow-y-auto custom-scrollbar"
              >
                <motion.div
                  key="education"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2"
                >
                  {education.length > 0 ? (
                    <ul className="space-y-3 text-sm">
                      {(expanded ? education : education.slice(0, 5)).map(
                        (item, index) => (
                          <motion.li
                            key={index}
                            className="flex items-start p-2 rounded-lg hover:bg-pink-50/50 transition-colors"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              duration: 0.3,
                              delay: index * 0.05,
                            }}
                          >
                            <div className="bg-gradient-to-r from-pink-100 to-pink-200 p-1.5 rounded-full mr-3 flex-shrink-0 mt-0.5">
                              <GraduationCap className="h-3.5 w-3.5 text-pink-600" />
                            </div>
                            <span className="text-gray-700">{item}</span>
                          </motion.li>
                        )
                      )}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 italic">ไม่มีข้อมูล</p>
                  )}
                </motion.div>
              </TabsContent>

              <TabsContent
                value="experience"
                className="mt-4 h-[220px] overflow-y-auto custom-scrollbar"
              >
                <motion.div
                  key="experience"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2"
                >
                  {experience.length > 0 ? (
                    <ul className="space-y-3 text-sm">
                      {(expanded ? experience : experience.slice(0, 5)).map(
                        (item, index) => (
                          <motion.li
                            key={index}
                            className="flex items-start p-2 rounded-lg hover:bg-pink-50/50 transition-colors"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              duration: 0.3,
                              delay: index * 0.05,
                            }}
                          >
                            <div className="bg-gradient-to-r from-pink-100 to-pink-200 p-1.5 rounded-full mr-3 flex-shrink-0 mt-0.5">
                              <BookOpen className="h-3.5 w-3.5 text-pink-600" />
                            </div>
                            <span className="text-gray-700">{item}</span>
                          </motion.li>
                        )
                      )}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 italic">ไม่มีข้อมูล</p>
                  )}
                </motion.div>
              </TabsContent>

              <TabsContent
                value="achievements"
                className="mt-4 h-[220px] overflow-y-auto custom-scrollbar"
              >
                <motion.div
                  key="achievements"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2"
                >
                  {achievements.length > 0 ? (
                    <ul className="space-y-3 text-sm">
                      {(expanded ? achievements : achievements.slice(0, 5)).map(
                        (item, index) => (
                          <motion.li
                            key={index}
                            className="flex items-start p-2 rounded-lg hover:bg-pink-50/50 transition-colors"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                          >
                            <div className="bg-gradient-to-r from-pink-100 to-pink-200 p-1.5 rounded-full mr-3 flex-shrink-0 mt-0.5">
                              <Award className="h-3.5 w-3.5 text-pink-600" />
                            </div>
                            <span className="text-gray-700">{item}</span>
                          </motion.li>
                        )
                      )}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 italic">ไม่มีข้อมูล</p>
                  )}

                  {testScores && testScores.length > 0 && (
                    <motion.div
                      className="mt-4 p-3 bg-gradient-to-r from-pink-50 to-purple-50/50 rounded-lg border border-pink-100"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <p className="font-medium text-sm mb-2 flex items-center text-pink-700">
                        <Medal className="h-4 w-4 mr-2 text-pink-500" />
                        คะแนนสอบ:
                      </p>
                      <ul className="space-y-2 text-sm">
                        {(expanded ? testScores : testScores.slice(0, 5)).map(
                          (score, index) => (
                            <motion.li
                              key={index}
                              className="flex items-center ml-6"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{
                                duration: 0.3,
                                delay: 0.3 + index * 0.05,
                              }}
                            >
                              <Star className="h-3 w-3 text-yellow-400 mr-2" />
                              <span className="text-gray-700">{score}</span>
                            </motion.li>
                          )
                        )}
                      </ul>
                    </motion.div>
                  )}
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
          {activeTabHasMoreThanFiveItems() && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-full py-2 px-4 bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-sm text-gray-600 transition-colors mt-auto"
            >
              {expanded ? (
                <>
                  <span>แสดงน้อยลง</span>
                  <ChevronUp className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  <span>แสดงเพิ่มเติม</span>
                  <ChevronDown className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Tutor data
const tutors = [
  {
    name: "พี่ดรีม",
    image: "/tutors/พี่ดรีม.jpg",
    education: [
      "บัญชีบัณฑิต จุฬาลงกรณ์มหาวิทยาลัย (เกียรตินิยม)",
      "โรงเรียนเตรียมอุดมศึกษา (ห้อง Gifted วิทย์)",
      "อดีตนิสิตคณะแพทยศาสตร์ มศว (ลาออกตอนปี 2)",
      "สอบติดคณะวิศวกรรมศาสตร์ สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง",
    ],
    experience: [
      "มีประสบการณ์สอนวิชาคณิต วิทยาศาสตร์ ฟิสิกส์ เคมี ชีวะ ภาษาอังกฤษ สอบเข้า ม.1 ห้อง Gifted, ม.4 เข้าเตรียมอุดม จุฬาภรณ์ วมว. และสอนภาษาอังกฤษน้องระดับมหาวิทยาลัย",
      "สอนเพื่อเตรียมสอบเข้าปริญญาโท คณะแพทย์ คณะวิศวะ และอื่นๆ",
    ],
    achievements: [
      "อดีตนักเรียนในค่ายโอลิมปิกวิชาการสาขาฟิสิกส์ ศูนย์กรุงเทพมหานคร",
      "ศึกษาชั้นมัธยมศึกษาตอนปลายที่โรงเรียนเตรียมอุดมศึกษา ห้องโครงการพัฒนาศักยภาพทางวิทยาศาสตร์ (Gifted Science)",
      "สอบติดโรงเรียนเตรียมอุดมศึกษา ได้ลำดับที่ 70 จากผู้เข้าสอบเกือบ 10,000 คน",
      "ได้รับรางวัลชนะเลิศจากการประกวดproject ของสมาพันธ์นิสิตแพทย์นานาชาติแห่งประเทศไทย(IFMSA)",
      "อันดับที่ 2 การแข่งขันพรีเซนแผนธุรกิจสตาร์ทอัพในฐานะตัวแทนจุฬา ที่ Hong Kong University of Science and Technology",
      "ขณะศึกษาชั้นมัธยมศึกษาตอนปลาย ได้เป็นผู้แทนประเทศไทย ไปนำเสนอโครงงานวิทยาศาสตร์ที่ต่างประเทศ",
      "เป็นตัวแทนเตรียมอุดม จุฬาลงกรณ์มหาวิทยาลัย และมศว ไปแลกเปลี่ยน กับ ประเทศแคนาดา เกาหลี ญี่ปุ่น สิงคโปร์ ฮ่องกง อินเดีย เนปาล และคาซัคสถาน",
      "ได้รับรางวัลที่ 1 ของประเทศ การทดสอบความรู้วิชาวิทยาศาสตร์ จัดโดย บริษัท ท็อป เทสท์ เซ็นเตอร์ จำกัด เมื่อศึกษาในชั้นมัธยมศึกษาปีที่ 3",
      "ได้รับรางวัลชมเชย การแข่งขันคณิตศาสตร์ TME ระดับมัธยมศึกษาปีที่ 3 จัดโดย ธนาคารออมสิน",
      "ได้รับรางวัลชมเชยจากการแข่งขันเพชรยอดมงกุฎ วิชา วิทยาศาสตร์ ระดับมัธยมศึกษาตอนต้น",
      "ตัวแทนประเทศไทยเข้าร่วม discussion เกี่ยวกับ Sustainable development ที่ Nanyang Technological University ประเทศสิงคโปร์",
    ],
    subjects: ["วิทยาศาสตร์", "คณิตศาสตร์", "ฟิสิกส์", "ภาษาอังกฤษ"],
  },
  {
    name: "พี่วิน",
    image: "/tutors/พี่วิน.jpg",
    education: [
      "วิศวกรรมศาสตร์บัณฑิต จุฬาลงกรณ์มหาวิทยาลัย (เกียรตินิยมอันดับ 1)",
      "ในขณะที่ศึกษาในชั้นปีที่ 1 ได้รับเกรดเฉลี่ยรวมทุกรายวิชา 4.00",
      "สอบติดแพทย์จุฬา ปี 2561 (คะแนนรวม 75.146/100)",
    ],
    experience: [
      "สอนน้องโรงเรียนสามเสนติดแพทย์ ม.เชียงใหม่",
      "สอนน้องโรงเรียนสาธิตจุฬาฯ ติดวิศวะจุฬาฯ",
      "ประสบการณ์สอนฟิสิกส์ระดับมหาวิทยาลัย น้องคณะแพทย์ศาสตร์​ ศิริราชพยาบาล",
      "ประสบการณ์สอนแคลคูลัสระดับมหาวิทยาลัย น้องคณะ Basci จุฬาฯ",
    ],
    achievements: [
      "ในระดับมัธยมศึกษาตอนปลาย ได้รับรางวัลชมเชย ที่ 25 การแข่งขันคณิตศาสตร์เพชรยอดมงกุฎ ครั้งที่ 19",
      "ผลการสอบ SAT ในส่วนของ SAT Academic Test ประกอบด้วย Mathematics Level 2, Physics และ Chemistry ได้ 800/800 ทั้งสามวิชา",
      "ผลสอบ International English Language Test System (IELTS) ได้ overall 7.0/9 reading 8.5/9",
      "คะแนนผลการสอบวัดระดับ ONET คณิตศาสตร์ ปี 2562 97.5/100",
      `ผลงานการแข่งขันหลากหลายรายการในขณะที่อยู่ระดับชั้นประถมศึกษาและมัธยมศึกษา เช่น การแข่งขันคณิตศาสตร์ (IQ 180) จัดโดยคณะวิทยาศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย เข้ารอบ final
  , การแข่งขันคณิตศาสต์มหาวิทยาลัยราชภ้ฎพระนคร เหรียญทอง เหรียญเงิน และเหรียญทองแดง
  , การแข่งขันคณิตศาสตร์ สสวท เหรียญเงิน 2 เหรียญ`,
    ],
    subjects: ["คณิตศาสตร์", "ฟิสิกส์", "เคมี", "คอมพิวเตอร์"],
    testScores: [
      "PAT1 : 285/300",
      "PAT1 : 254/300 (ปี 2561)",
      "PAT3 : 256/300 (ปี 2561)",
      "GAT : 282.5/300 (150 + 132.5) (ปี 2561)",
      "คณิตศาสตร์ : 92/100 เคมี : 84/100 (ปี 2561)",
      "ฟิสิกส์ : 88/100 อังกฤษ 86.25/100 (ปี 2561)",
      "คะแนนรวม 75.146/100 (ติดแพทย์จุฬา) (ปี 2561)",
    ],
  },
  {
    name: "พี่ป้าง",
    image: "/tutors/พี่ป้าง.png",
    education: [
      "Beihang University คณะ  Electronic Information (ได้รับทุนเต็มจำนวน)",
      "นักเรียนทุนวิทย์-คณิตโครงการวมว. โรงเรียนสวนกุหลาบวิทยาลัย รังสิต (GPA 3.89)",
      "โรงเรียนเทพศิรินทร์ ร่มเกล้า (GPA 3.92)",
      "ติดคณะวิศวกรรมศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย, มหาวิทยาลัยมหิดลล, มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี",
    ],
    experience: [
      "ประสบการณ์การสอน 2 ปี วิชาคณิต วิทยาศาสตร์ ฟิสิกส์ เคมี สอนเข้าม.1 ห้องธรรมดาและ Gifted, ม.4 ห้องวิทย์-คณิต โรงเรียนแข่งขันสูงต่างๆ และติวเพื่อเพิ่มเกรดในห้องเรียน",
    ],
    achievements: [
      "Duolingo english test: 110/160 (ระดับภาษาอังกฤษ)",
      "แข่งขัน IJSO19th ได้เข้ารอบ 60 คนสุดท้ายของประเทศ",
      "เข้าอบรมสอวนฟิสิกส์.ค่าย 1 และ 2 ประจําปีการศึกษา 2565",
      "WMI (World Mathematics Invitational) รางวัล: ได้รางวัลเหรียญทอง",
      "แข่งขันตอบปัญหาวิทยาศาสตร์ ระดับมัธยมศึกษาตอนปลาย ณ มหาวิทยาลัยวไลยอลงกรณ์ รางวัล : รางวัลชนะเลิศอันดับที่ 1",
      "แข่งขันตอบปัญหาวิทยาศาสตร์และคณิตศาสตร์ ระดับมัธยมศึกษาตอนปลาย ณ มหาวิทยาลัยเทคโนโลยีราชมงคลธัญบุรี รางวัล : รางวัลรองชนะเลิศอันดับที่ 2",
      "การแข่งขันโครงงานวิศวกรรมไฟฟ้า CUEE camp 2024 รางวัล : รางวัลรองชนะเลิศอันดับที่ 1",
      "CHANGE INNOVATION AWARDS 2024 รางวัล: รางวัลระดับเหรียญเงิน อันดับที่ 38 จากทั้งหมด 131 ทีม",
      "FIAC (2024) รางวัล: ได้รับการตีพิมพ์เผยแพร่บทความวิจัย",
      "PACCON 2024 รางวัล: ได้เข้าร่วมนำเสนอผลงาน",
      "CUIIC 2024 รางวัล: ได้รางวัลชมเชย",
      "14th SCiUS Forum รางวัล : ได้รับรางวัลเหรียญเงิน",
      "Thailand Cyber Top Talent 2024 รางวัล: ได้อันดับที่ 33 จาก 268 ทีม",
      "Asian Try Zero-G รางวัล: ได้เข้าร่วมการแข่งขัน ผู้จัด: สวทช. และ JAXA",
      "Young founder all-star hackathon ได้รางวัลรองชนะเลิศอันดับที่1",
      "สมาชิก POSN.SKR(เพจให้ความรู้ด้านการสอบ สอวน.",
      `โครงงานที่เคยทำ 
    1.  Extraction of bioactive protein from fish head using enzymatic hydrolysis
    2. Smart mobile fan be more cool 
    3. เครื่องกระตุ้นหัวใจอัตโนมัติ
    4. Wildfire Tracking and Environment Surveillance CubeSat
    `,
    ],
    subjects: ["คณิตศาสตร์", "วิทยาศาสตร์", "ฟิสิกส์", "เคมี"],
  },
  {
    name: "พี่แทนตา",
    image: "/tutors/พี่แทนตา.png",
    education: [
      "ปริญญาตรี สาขาเศรษฐศาสตร์ University of British Columbia (First Class Honours)",
      "สอบติดอักษรจุฬา อินเตอร์ (BALAC)",
      "สอบติดทันตแพทยศาสตร์ อินเตอร์ มหิดล (MIDS)",
      "สอบติด Faculty of Architecture, University of Toronto",
      "แลกเปลี่ยนที่ Michigan, USA",
      "มัธยม: โรงเรียนสามเสนวิทยาลัย (โครงการ EIS), GPA 3.95 , และโรงเรียนเตรียมอุดมศึกษา (ศิลป์-คำนวณ)",
    ],
    experience: [
      "สอนภาษาอังกฤษกว่า 4 ปี ทั้งเด็กประถม มัธยม นักเรียนทุน และผู้ใหญ่",
      "สอน IELTS ตัวต่อตัว และติวสอบเข้ารร.ชั้นนำ",
      "เคยสอน Study Plan และ Personal Statement สำหรับทุน GKS",
      "เคยสอน SOP เข้ามหาลัย",
      "ทำงานด้าน Marketing and Communications ที่แคนาดากว่า 2 ปี",
      "ฝึกงานที่กระทรวงการต่างประเทศ, ธ.ก.ส., A49 HD, BACCOM UK ฯลฯ",
    ],
    achievements: [
      "ได้รับทุน Excellence Scholarship และทุน International Student Scholarship จาก UBC 2 ปีติด",
      "เป็น Copywriter ให้ Douglas College",
      "ได้รับเลือกให้งานเขียนเป็นตัวอย่างที่ UBC",
      "จัดงานเทศกาลไทยในโตรอนโต, ผู้ก่อตั้ง Thai Association Canada",
      "ได้รับรางวัลจากสมเด็จพระสังฆราชฯ ขณะเรียนที่สามเสน",
      "เหรียญทองเรียงความ งานศิลปหัตถกรรมฯ ระดับกรุงเทพฯ",
    ],
    subjects: ["ภาษาอังกฤษ"],
  },
  {
    name: "พี่ฟิลม์",
    image: "/tutors/พี่ฟิลม์.png",
    education: [
      "ประถม-ม.ปลาย GPAX 3.96 จากเซนต์คาเบรียล, สวนกุหลาบ, มหิดลวิทยานุสรณ์",
      "คณะแพทยศาสตร์ศิริราชพยาบาล ม.มหิดล",
    ],
    experience: [
      "ติวนักเรียนจากหลายโรงเรียน, หลายรูปแบบการเรียนการสอน",
      "เป็นวิทยากรออกข้อสอบ โครงการพี่ช่วยน้อง สอวน.คณิต",
    ],
    achievements: [
      "สอวน.คณิต ค่าย 2 หลายปี",
      "TGAT 85, IELTS 7.0",
      "A-level ฟิสิกส์ 86, เคมี 82.5, ชีวะ 85.6",
      "Top 10 ทีมคณิตศาสตร์ระดับประเทศ",
    ],
    subjects: ["คณิตศาสตร์", "ฟิสิกส์", "เคมี", "ชีววิทยา", "ภาษาอังกฤษ"],
  },
  {
    name: "พี่แพรวา",
    image: "/tutors/พี่แพรวา.png",
    education: [
      "เตรียมอุดมศึกษา ห้องควีน-คิง",
      "นิสิตคณะทันตแพทยศาสตร์ จุฬาฯ ปี 5",
    ],
    experience: [
      "สอนภาษาอังกฤษ ปูพื้นฐาน และเพิ่มเกรด (ประถม-ม.ปลาย)",
      "สอนทั้งแบบตัวต่อตัว กลุ่ม และออนไลน์",
    ],
    achievements: [
      "GAT ENG 292.5/300",
      "ONET ENG 92.5",
      "9 วิชาสามัญ ENG 93.75/100",
      "สัมภาษณ์ YES Top 100",
    ],
    subjects: ["ภาษาอังกฤษ"],
  },
  {
    name: "พี่ไนน์",
    image: "/tutors/พี่ไนน์.png",
    education: [
      "จิตวิทยา จุฬาฯ (เกียรตินิยมอันดับ 1)",
      "เตรียมอุดมศึกษา (ศิลป์-จีน)",
    ],
    experience: [
      "สอนเด็กระดับประถม-ม.ต้น 2 ปี",
      "ฝึกงานเนอสเซอรี่ Kido",
      "สอนภาษาไทยให้นักเรียนต่างชาติ",
    ],
    achievements: ["Toeic 895/990", "GAT ENG 140/150", "Art4Worth - สอนศิลปะ"],
    subjects: ["ภาษาอังกฤษ", "ภาษาจีน", "ภาษาไทย", "ศิลปะ"],
  },
  {
    name: "พี่ Will",
    image: "/tutors/พี่ Will.png",
    education: [
      "ปริญญาตรี รัฐศาสตร์ จุฬาฯ (เกียรตินิยมอันดับ 2)",
      "โครงการ Gift diversity voyage ที่มหาวิทยาลัยโตโย ญี่ปุ่น",
    ],
    experience: [
      "วิทยากรภาษาอังกฤษที่โรงเรียนเตรียมอุดมพัฒนาการและหอวัง",
      "แข่งไทยเพชรยอดมงกุฎ, ตอบปัญหากฎหมายกับกระทรวงยุติธรรม",
      "นำเข้าสินค้าจากจีน",
    ],
    achievements: ["สอนเศรษฐศาสตร์ระดับป.ตรี และรัฐศาสตร์จุฬาฯ อินเตอร์"],
    subjects: [
      "ภาษาอังกฤษ",
      "ภาษาไทย",
      "ภาษาญี่ปุ่น",
      "ภาษาจีน",
      "เศรษฐศาสตร์",
      "สังคมศึกษา",
    ],
  },
  {
    name: "พี่พิมพ์",
    image: "/tutors/พี่พิมพ์.png",
    education: [
      "โรงเรียนสาธิต มศว เอกภาษาจีน",
      "คณะครุศาสตร์ จุฬาฯ (เกียรตินิยมอันดับ 1) GPA 3.89",
      "ทุนเรียนภาษา Hunan Agriculture University",
    ],
    experience: [
      "ติววิชาภาษาไทยและสังคมในโรงเรียนและศูนย์การเรียนรู้",
      "ฝึกงานด้านการเรียนรู้เด็กและผู้สูงอายุ",
    ],
    achievements: [
      "TOP 9 วิชาสามัญภาษาไทย (84 คะแนน)",
      "GAT ไทย 150 เต็ม",
      "HSK 4 และ HSKK ผ่านระดับ",
    ],
    subjects: ["ภาษาไทย", "สังคมศึกษา", "ภาษาจีน", "ภาษาอังกฤษ"],
  },
  {
    name: "พี่มันตา",
    image: "/tutors/พี่มันตา.png",
    education: ["อักษรศาสตร์ จุฬาฯ (BALAC Inter)"],
    experience: [
      "ติวเข้าโรงเรียนนานาชาติ และ EP",
      "ติวสัมภาษณ์มหาวิทยาลัยอินเตอร์",
    ],
    achievements: [
      "IELTS 7.5",
      "CEFR C1",
      "A-Level English 92.5 (Percentile 99.128)",
    ],
    subjects: ["ภาษาอังกฤษ"],
  },
  {
    name: "พี่พล",
    image: "/tutors/พี่พล.jpg",
    education: [
      "ปริญญาตรี ครุศาสตรบัณฑิต (เกียรตินิยม) จุฬาลงกรณ์มหาวิทยาลัย",
      "ปริญญาโท ครุศาสตรมหาบัณฑิต จุฬาลงกรณ์มหาวิทยาลัย",
      "ปริญญาตรี ศิลปศาสตรบัณฑิต มหาวิทยาลัยรามคำแหง สาขาวิชาภาษาเยอรมัน",
      "ปริญญาตรี ศิลปศาสตรบัณฑิต (เกียรตินิยมอันดับหนึ่ง) มหาวิทยาลัยรามคำแหง สาขาวิชาภาษาไทย",
      "2565-ปัจจุบัน กำลังศึกษาคณะอักษรศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย",
    ],
    experience: [
      "มีประสบการณ์เป็นครูผู้ช่วยที่โรงเรียนเตรียมอุดมศึกษา กลุ่มสาระการเรียนรู้ภาษาต่างประเทศที่สอง ภาษาเยอรมัน",
    ],
    achievements: [],
    subjects: ["ภาษาเยอรมัน", "ภาษาไทย"],
  },
  {
    name: "พี่กิ๊ฟ",
    image: "/tutors/พี่กิฟท์.jpg",
    education: [
      "จบม.ปลายโรงเรียนโยธินบูรณะ สายศิลป์ภาษาญี่ปุ่น",
      "มหาวิทยาลัยเกษตรศาสตร์ คณะสังคมศาสตร์ สาขานิติศาสตร์ (ปริญญาตรี)",
      "มหาวิทยาลัยรามคำแหง คณะรัฐศาสตร์ (ปริญญาโท)",
    ],
    experience: [
      "ติวภาษาญี่ปุ่นเบื้องต้น",
      "ติวสอบ JLPT5 /A-level",
      "ภาษาไทย และ ภาษาอังกฤษ ประถม มัธยมต้น (สำหรับเนื้อหาที่เรียนและสอบเข้าม.1 ม.4) เน้นทำข้อสอบและแกรมม่า",
      "สังคมศึกษามัธยมต้น ปลาย ประถม กฎหมายเบื้องต้น ติวสอบเข้าม.4เตรียมอุดม",
      "ติวอังกฤษสอบเข้าep สามเสนและเตรียมอุดม",
    ],
    achievements: ["ติวสอบเข้าEP สามเสน ม.1 (นักเรียนสอบติด)"],
    subjects: ["ภาษาญี่ปุ่น", "ภาษาไทย", "ภาษาอังกฤษ", "สังคมศึกษา"],
  },
  {
    name: "พี่ฝ้าย",
    image: "/tutors/พี่ฝ้าย.png",
    education: [
      "ปริญญาตรีคณะมนุษยศาสตร์ เอกภาษาอังกฤษ มหาวิทยาลัยเชียงใหม่ เกียรตินิยมอันดับ 1",
      "ปัจจุบันคณะเภสัชศาสตร์ หลักสูตรนานาชาติ มหาวิทยาลัยขอนแก่น(ปริญญาตรีใบที่ 2)",
    ],
    experience: [
      "ติวข้อสอบ TOEFL ITP ม.6 ยโสธรพิทยาคม",
      "ติวสอนเพิ่มเกรด ปี 1 พระจอมเกล้าพระนครเหนือ",
      "ติวข้อสอบเข้ามหาวิทยาลัย และสอบของโรงเรียนชั้น ม.6 โรงเรียนบุญวาทย์วิทยาลัย และโรงเรียนอื่นๆ",
      "ติวสอนเพิ่มเกรด ม.5 โรงเรียนบุญวาทย์วิทยาลัย",
      "ติวสอนเพิ่มเกรด ป.4 โรงเรียนสุรัสวดี",
    ],
    achievements: [
      "เคยเป็นนักเรียนแลกเปลี่ยน USA 1 ปี(ทุนเต็มจำนวน)",
      "TGAT ENG 93.33/100",
      "A-Level Eng 87.5/100",
      "IELTS 7.5",
    ],
    subjects: ["ภาษาอังกฤษ", "ติวสอบเข้ามหาวิทยาลัย", "IELTS", "TOEFL"],
  },
  {
    name: "พี่อัยนาซ",
    image: "/tutors/พี่อัยนาซ.png",
    education: [
      "Niva American International School",
      "คณะการเงิน (Finance) ม.มหิดลอินเตอร์ ปี 4",
    ],
    experience: [
      "สอนกว่า 4 ปี ทั้งระดับประถม-ม.ปลาย",
      "ติว TOEFL, IELTS, CU-TEP, TGAT, A-Level ฯลฯ",
      "เน้น Speaking, Pronunciation, Writing และติวเข้ามหาวิทยาลัย",
    ],
    achievements: ["IELTS Overall 7.5 (Speaking 8.5, Listening 8.0)"],
    subjects: ["ภาษาอังกฤษ", "ติวสอบเข้ามหาวิทยาลัย", "IELTS", "TOEFL"],
  },
  {
    name: "พี่กิม",
    image: "/tutors/พี่กิม.png",
    education: [
      "ปริญญาตรี ภาษาจีน ม.บูรพา (เกียรตินิยมอันดับ 1), GPA 3.87",
      "ม.ปลาย วิทย์-สาธารณสุข โรงเรียนเบญจมราชูทิศ",
      "ม.ต้น ภาษาอังกฤษ-จีน โรงเรียนสตรีมารดาพิทักษ์",
    ],
    experience: [
      "ล่ามจีนในหลายมหาวิทยาลัย เช่น มศว, ม.บูรพา, ม.กรุงเทพธนบุรี",
      "อาจารย์สอนภาษาไทยสำหรับต่างชาติ (ม.มหิดล)",
      "งาน HR, เลขาฯ, ผู้ช่วยการเงิน ฯลฯ",
    ],
    achievements: [
      "Top scorer PAT7.4",
      "รางวัลการพากย์ภาพยนตร์จีน, การแปลซับไตเติล",
      "รางวัลสะพานวัฒนธรรมภาษาจีน",
    ],
    subjects: ["ภาษาจีน", "ภาษาไทย", "ภาษาอังกฤษ"],
  },
];
