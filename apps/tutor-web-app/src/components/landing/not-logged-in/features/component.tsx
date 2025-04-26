"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, Clock, UserCheck, DollarSign } from "lucide-react";

export default function Features() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const elementPosition =
        document.getElementById("features-section")?.offsetTop || 0;

      if (scrollPosition > elementPosition) {
        setIsVisible(true);
      }
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      image: "/pics/easy-find.png",
      title: "ค้นหางานง่าย",
      icon: <Search className="w-6 h-6 text-teal-500" />,
      color: "from-teal-400 to-emerald-300",
      delay: 0.1,
    },
    {
      image: "/pics/fast-refund.png",
      title: "งานถูกยกเลิก คืนเงินภายใน 24 ชั่วโมง",
      icon: <Clock className="w-6 h-6 text-purple-500" />,
      color: "from-purple-400 to-pink-300",
      delay: 0.2,
    },
    {
      image: "/pics/no-intermediary.png",
      title: "ขั้นตอนง่าย ไม่ต้องรอ แอดมินตอบ",
      icon: <UserCheck className="w-6 h-6 text-blue-500" />,
      color: "from-blue-400 to-indigo-300",
      delay: 0.3,
    },
    {
      image: "/pics/can-propose.png",
      title: "ติวเตอร์เสนอราคาค่าสอนได้",
      icon: <DollarSign className="w-6 h-6 text-rose-500" />,
      color: "from-rose-400 to-pink-300",
      delay: 0.4,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div
      id="features-section"
      className="relative py-20 overflow-hidden bg-gradient-to-b from-[#F5F7FA] to-white"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-teal-100 opacity-30 blur-3xl"></div>
        <div className="absolute top-40 -left-20 w-72 h-72 rounded-full bg-purple-100 opacity-30 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-blue-100 opacity-20 blur-3xl"></div>
      </div>

      <div className="container relative mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -20 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-block">
            <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-teal-100 to-emerald-100 text-teal-800 text-sm font-medium mb-4">
              ทำไมต้องเลือกเรา
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#263238] relative">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600">
                ทำไมต้องเลือก Job Tutor Dream
              </span>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full transform scale-x-0 origin-left animate-expandWidth"></div>
            </h2>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.7, delay: feature.delay }}
              whileHover={{ scale: 1.03 }}
              className="flex flex-col md:flex-row items-center gap-6 bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="relative group">
                <div
                  className={`absolute -inset-1 rounded-[24px] bg-gradient-to-r ${feature.color} opacity-70 blur-sm group-hover:opacity-100 group-hover:blur-md transition-all duration-500`}
                ></div>
                <div className="relative bg-white p-4 rounded-[20px] overflow-hidden">
                  <div className="absolute top-2 right-2 bg-white/90 rounded-full p-1 shadow-sm">
                    {feature.icon}
                  </div>
                  <Image
                    src={feature.image || "/placeholder.svg"}
                    alt={feature.title}
                    width={180}
                    height={180}
                    className="rounded-[16px] transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-semibold text-[#263238] mb-2">
                  {feature.title}
                </h3>
                <div
                  className={`h-1 w-12 rounded-full bg-gradient-to-r ${feature.color} mx-auto md:mx-0`}
                ></div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Add custom animation keyframes */}
      <style jsx>{`
        @keyframes expandWidth {
          0% {
            transform: scaleX(0);
          }
          100% {
            transform: scaleX(1);
          }
        }
        .animate-expandWidth {
          animation: expandWidth 1.5s ease-out forwards;
          animation-delay: 0.5s;
        }
      `}</style>
    </div>
  );
}
