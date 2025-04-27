"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Features() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const featureItems = [
    {
      image: "/pics/ez.png",
      alt: "ez",
      text: "สะดวก ปลอดภัย ส่งติวเตอร์ติวเข้มถึงบ้าน หรือสถานที่ที่ผู้เรียนสะดวก สามารถเลือกวัน-เวลาเองได้",
      color: "from-pink-200 to-purple-100",
      borderColor: "border-pink-300",
      delay: 0.1,
    },
    {
      image: "/pics/tutor.png",
      alt: "tutor",
      text: "มีติวเตอร์หลายท่านให้เลือก มีติวเตอร์ให้เลือกทุกวิชา ทุกระดับชั้นอย่างหลากหลาย",
      color: "from-purple-200 to-blue-100",
      borderColor: "border-purple-300",
      delay: 0.3,
    },
    {
      image: "/pics/value.png",
      alt: "value",
      text: "ประหยัดค่าใช้จ่าย จัดหาติวเตอร์คุณภาพ ในราคาที่เหมาะสม และ ช่วยผู้ปกครองประหยัดค่าใช้จ่ายยิ่งขึ้น เมื่อลงเรียนเป็นคอร์ส หรือเรียนเป็นกลุ่ม",
      color: "from-blue-200 to-teal-100",
      borderColor: "border-blue-300",
      delay: 0.5,
    },
    {
      image: "/pics/money.png",
      alt: "money",
      text: "สอนทางออนไลน์ ผ่านวิดิโอคอลได้ หากผู้เรียนและผู้สอนอยู่ไกลกัน สามารถจัดคอร์สสอนทางไกลผ่านวิดิโอคอล ช่วยประหยัดเวลาและค่าใช้จ่ายในการเดินทาง",
      color: "from-teal-200 to-pink-100",
      borderColor: "border-teal-300",
      delay: 0.7,
    },
  ];

  return (
    <div className="relative bg-gradient-to-b from-[#F5F7FA] to-[#E8F0FE] overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-pink-300 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-purple-300 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-300 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -20 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center text-[#263238] mb-16"
        >
          ทำไมต้องเลือก{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
            Chula Tutor Dream
          </span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {featureItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
              transition={{ duration: 0.7, delay: item.delay }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
            >
              <div className="flex flex-col md:flex-row items-center p-6">
                <div className="w-full md:w-1/2 mb-6 md:mb-0">
                  <div
                    className={`bg-gradient-to-br ${item.color} p-5 rounded-2xl transform transition-transform duration-300 hover:scale-105`}
                  >
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.alt}
                      width={200}
                      height={200}
                      className={`border-3 ${item.borderColor} rounded-2xl shadow-md`}
                    />
                  </div>
                </div>
                <div className="w-full md:w-1/2 md:pl-6">
                  <p className="text-[#263238] text-lg leading-relaxed font-medium">
                    {item.text}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
