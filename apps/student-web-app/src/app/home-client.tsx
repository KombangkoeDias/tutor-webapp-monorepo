"use client";

import { Image as AntdImage } from "antd";
import { useRef, useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Features from "@/components/landing/features";
import Process from "@/components/landing/process";
import TutorsSection from "@/components/landing/tutors";
import StatsSection from "@/components/landing/stats";
import { motion } from "framer-motion";
import { Sparkles, BookOpen, ArrowRight } from "lucide-react";

export default function HomeClient() {
  return <ContinuousReviewCarousel />;
}

function ContinuousReviewCarousel() {
  const scrollRef1 = useRef<HTMLDivElement>(null);
  const scrollRef2 = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isRow1Hovered, setIsRow1Hovered] = useState(false);
  const [isRow2Hovered, setIsRow2Hovered] = useState(false);

  // Animation for the carousel
  useEffect(() => {
    const animateScroll = () => {
      if (scrollRef1.current && scrollRef2.current) {
        // Only scroll row 1 if it's not being hovered
        if (!isRow1Hovered) {
          // Get the current scroll position
          const scrollPosition = scrollRef1.current.scrollLeft;
          // Get the maximum scroll width
          const maxScroll =
            scrollRef1.current.scrollWidth - scrollRef1.current.clientWidth;

          // If we've reached the end, reset to the beginning
          if (scrollPosition >= maxScroll) {
            scrollRef1.current.scrollLeft = 0;
          } else {
            // Otherwise, continue scrolling
            scrollRef1.current.scrollLeft += 1;
          }
        }

        // Only scroll row 2 if it's not being hovered
        if (!isRow2Hovered) {
          // Do the same for the second row, but in the opposite direction
          if (scrollRef2.current.scrollLeft <= 0) {
            scrollRef2.current.scrollLeft =
              scrollRef2.current.scrollWidth - scrollRef2.current.clientWidth;
          } else {
            scrollRef2.current.scrollLeft -= 1;
          }
        }
      }
    };
    // Set up the animation interval
    const animationInterval = setInterval(animateScroll, 50);

    // Clean up the interval on component unmount
    return () => clearInterval(animationInterval);
  }, [isRow1Hovered, isRow2Hovered]);

  return (
    <div className="w-full py-12 overflow-hidden bg-gradient-to-b from-white to-pink-50">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      {/* <div className="absolute bottom-40 left-1/3 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div> */}

      <div className="relative">
        <div className="container mx-auto px-4 md:px-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-full max-w-3xl mx-auto space-y-5">
                <motion.h1
                  className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  Chula Tutor Dream — หาติวเตอร์ส่วนตัว เรียนพิเศษ
                </motion.h1>
                <div className="flex justify-center">
                  <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full" />
                </div>
                <motion.p
                  className="mx-auto text-gray-700 text-base md:text-xl leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  เราอยู่ในวงการติวเตอร์ที่มีคุณภาพสูง
                  มีนักเรียนมาติวกับเรามากมาย
                </motion.p>
                <motion.p
                  className="mx-auto text-gray-600 text-sm md:text-base leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  มีติวเตอร์จากจุฬาฯ และธรรมศาสตร์
                  ทั้งจบการศึกษาแล้วและกำลังศึกษาอยู่ จากคณะแพทย์ วิศวะ
                  และอื่นๆ ให้เลือก ทั้งจบจากไทยและจากมหาวิทยาลัยต่างประเทศ
                </motion.p>
              </div>
              <motion.div
                className="mt-8"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  className="w-[200px] text-lg rounded-full bg-gradient-to-r from-pink-400 to-pink-600 hover:from-pink-500 hover:to-pink-700 text-white shadow-lg hover:shadow-pink-200 transition-all duration-300"
                  onClick={() => router.push("/jobs/create")}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  หาติวเตอร์
                </Button>
              </motion.div>
            </motion.div>
        </div>
      </div>

      <StatsSection />

      {/* Blog Banner */}
      <motion.div
        className="relative py-16 bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-r from-white to-pink-50/50 backdrop-blur-sm">
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  {/* Left side - Content */}
                  <div className="flex-1 text-center lg:text-left">
                    <motion.div
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 font-medium mb-4"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                      <BookOpen className="h-4 w-4" />
                      <span>บทความใหม่</span>
                    </motion.div>

                    <motion.h2
                      className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                    >
                      เรื่องราวประสบการณ์จริงจาก
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
                        {" "}
                        แพทย์จบใหม่
                      </span>
                    </motion.h2>

                    <motion.p
                      className="text-lg text-gray-600 mb-6 max-w-2xl"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                    >
                      อ่านเรื่องราวการเรียนแพทย์ตลอด 6 ปี และการทำงานในฐานะแพทย์
                      จากประสบการณ์จริงที่เต็มไปด้วยแรงบันดาลใจและความเข้าใจชีวิต
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                    >
                      <Button
                        className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                        onClick={() =>
                          router.push(
                            "/blog/a1b2c3d4-e5f6-7890-abcd-ef1234567890"
                          )
                        }
                      >
                        อ่านบทความ
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </motion.div>
                  </div>

                  {/* Right side - Preview Image */}
                  <motion.div
                    className="flex-shrink-0"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                  >
                    <div className="relative">
                      <div className="w-80 h-64 rounded-2xl overflow-hidden shadow-2xl">
                        <img
                          src="/blog/cover.png"
                          alt="ประสบการณ์การเรียนแพทย์"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Decorative elements */}
                      <div className="absolute -top-4 -right-4 w-8 h-8 bg-pink-400 rounded-full opacity-80"></div>
                      <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-400 rounded-full opacity-80"></div>
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>

      <TutorsSection />

      <div className="relative py-16 bg-gradient-to-b from-pink-50 to-white">
        <div className="absolute inset-0 bg-[url('/pattern-dots.svg')] opacity-5"></div>
        <motion.div
          className="flex flex-col items-center justify-center text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl text-center font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
            Reviews
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full mb-4"></div>
          <p className="text-lg text-gray-600 max-w-3xl">
            รีวิวจากน้องๆที่เคยเรียนกับ Chula Tutor Dream
          </p>
        </motion.div>

        {/* First row of reviews - scrolling right */}
        <div
          className="relative overflow-hidden mb-8"
          onMouseEnter={() => setIsRow1Hovered(true)}
          onMouseLeave={() => setIsRow1Hovered(false)}
        >
          <div
            ref={scrollRef1}
            className="flex gap-6 py-4 overflow-x-auto scrollbar-hide"
            style={{
              whiteSpace: "nowrap",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              width: "100%",
            }}
          >
            <div
              className="flex gap-6"
              style={{ paddingLeft: "20px", paddingRight: "20px" }}
            >
              {reviews.slice(0, reviews.length / 2).map((review, index) => (
                <ReviewCard
                  key={`row1-${index}`}
                  review={review}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Second row of reviews - scrolling left */}
        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsRow2Hovered(true)}
          onMouseLeave={() => setIsRow2Hovered(false)}
        >
          <div
            ref={scrollRef2}
            className="flex gap-6 py-4 overflow-x-auto overflow-y-hidden scrollbar-hide"
            style={{
              whiteSpace: "nowrap",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              width: "100%",
            }}
          >
            <div
              className="flex gap-6"
              style={{ paddingLeft: "20px", paddingRight: "20px" }}
            >
              {/* Reverse the order for the second row and offset starting position */}
              {[...reviews]
                .reverse()
                .slice(0, reviews.length / 2 + 1)
                .map((review, index) => (
                  <ReviewCard
                    key={`row2-${index}`}
                    review={review}
                    index={index}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>

      <Features />
      <Process />
    </div>
  );
}

interface Review {
  name: string;
  avatar: string;
  school: string;
  subject: string;
  content: string[];
  images?: string[];
}

interface ReviewCardProps {
  review: Review;
  index: number;
}

function ReviewCard({ review, index }: ReviewCardProps) {
  const [hover, setHover] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`${hover ? "z-10" : "z-1"}`}
      style={{ minWidth: "320px", flex: "0 0 auto" }}
    >
      <Card
        onMouseEnter={() => {
          setHover(true);
        }}
        onMouseLeave={() => setHover(false)}
        className={`min-h-[335px] max-h-[335px] w-[335px] overflow-hidden transition-all duration-300 ${
          hover
            ? "shadow-xl transform -translate-y-2 border-pink-400"
            : "shadow-md border-pink-200"
        } rounded-xl border-2 bg-white/80 backdrop-blur-sm`}
      >
        <CardContent className="p-6 relative">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-pink-100 to-purple-100 rounded-bl-full opacity-50"></div>

          <div className="flex items-start space-x-4">
            <Avatar className="h-12 w-12 border-2 border-pink-200 shadow-sm">
              <AvatarImage
                src={review.avatar || "/placeholder.svg?height=40&width=40"}
                alt={review.name}
              />
              <AvatarFallback className="bg-gradient-to-br from-pink-400 to-pink-600 text-white">
                {review.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="flex items-center">
                <h3 className="font-semibold text-gray-800">{review.name}</h3>
              </div>
              <p className="text-xs text-pink-600 font-medium">
                {review.school}
              </p>
            </div>
          </div>

          <div className="space-y-2 mt-4 grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              {review.images?.map((image, index) => (
                <motion.div whileHover={{ scale: 1.05 }} key={index}>
                  <AntdImage
                    src={image}
                    alt="Chula Tutor Dream"
                    width={50}
                    height={50}
                    className="rounded-md border border-pink-200 shadow-sm"
                  />
                </motion.div>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <p className="text-xs bg-gradient-to-r from-pink-100 to-purple-100 px-3 py-3 rounded-full">
                เรียนวิชา: <b className="text-pink-700">{review.subject}</b>
              </p>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600 line-clamp-6">
            {review.content.map((content, index) => (
              <blockquote
                key={index}
                className="border-l-4 border-pink-300 italic text-gray-700 pl-4 py-2 break-words whitespace-normal bg-pink-50/50 rounded-r-md mb-2"
              >
                "{content}"
              </blockquote>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

const reviews: Review[] = [
  {
    name: "น้องดิว",
    avatar: "/reviews/น้องดิว.webp",
    school: "คณะแพทยศาสตร์ มหาวิทยาลัยสยาม",
    subject: "ฟิสิกส์",
    content: [
      "พี่เป็น Role Model ของผมเลยนะ",
      "ขอขอบคุณพี่ดรีมมากครับที่สอนผมจนสอบติด เป็นพี่ที่คอยดูแลน้องเป็นอย่างดีและสอนเนื้อหาแน่น ไม่ผิดหวังอย่างยิ่งที่ได้เป็นลูกศิษย์พี่ครับ",
    ],
    images: ["/reviews/น้องดิว2.webp", "/reviews/น้องดิว3.webp"],
  },
  {
    name: "น้องกัลยกร จันทร์อ่ำ",
    avatar: "/reviews/ano.png",
    school: "สถาปัตยกรรมศาสตร์ มหาวิทยาลัยขอนแก่น",
    subject: "ภาษาอังกฤษ",
    content: [
      "ชอบที่พี่ดรีมใส่ใจค่ะ ให้ศัพท์เยอะมาก อยากเปลี่ยนเรื่องเรียน พี่ดรีมก็ตามใจ เป็นการเรียนแบบเน้นผู้เรียน ให้อธิบายซ้ำก็ได้",
      "พี่ดรีมสอนออกเสียงด้วย สอนหลายอย่างมากๆ ขอบคุณมากๆค่ะ ที่ตั้งใจสอนขนาดนี้ ฮืออ",
    ],
    images: ["/reviews/ถาปัต.webp"],
  },
  {
    name: "น้องไบรท์",
    avatar: "/reviews/น้องต้นน้ำ1.png",
    subject: "เลข,ฟิสิกส์",
    school: "โรงเรียนเบ็ญจะมะ อุบลราชธานี",
    content: [
      "เรียนกับพี่ดรีม รู้สึกปลอดภัยค่ะ ใจเย็น ไม่เครียดไม่กดดัน โจทย์ง่ายไปยากดีเหมาะกับคนไม่มีพื้นแบบเราดี",
    ],
    images: ["/reviews/น้องต้นน้ำ2.png"],
  },
  {
    name: "น้องณพัชชา วิเศษชาติ",
    avatar: "/reviews/จุฬาภร.webp",
    subject: "วิทยาศาสตร์",
    school: "โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย บุรีรัมย์",
    content: [
      "สอนเข้าใจง่ายค่ะแต่ถ้าสงสัยตรงไหนก็ถามได้ตลอดหนูชอบการสอนของพี่มากๆเลยเพราะบรรยากาศเป็นกันเองไม่เครียดแต่ได้ความรู้ค่ะ 😊",
    ],
    images: ["/reviews/จุฬาภร2.webp"],
  },
  {
    name: "น้องเจมส์",
    avatar: "/reviews/ano.png",
    subject: "คณิตศาสตร์ แคลคูลัส",
    school: "โรงเรียนเตรียมอุดมศึกษา",
    content: [
      "เรียนเพื่อเตรียมสอบPat1เข้าคณะอักษรฯ จุฬา",
      "เรียนกับพี่ก็สนุกดีค่ะ เป็นกันเองพี่ปล่อยมุกตลอด ถึงพี่จะพูดเร็วไปนิดแต่ก็มีทริคคิดเลขง่ายๆให้ตลอดเลย ขอบคุณนะคับ",
    ],
    images: ["/reviews/น้องเจมส์.webp"],
  },
  {
    name: "Anonymous",
    avatar: "/reviews/ano.png",
    subject: "ภาษาอังกฤษ",
    school: "-",
    content: [
      "น้องเรียน GED RLA (วิชาภาษาอังกฤษ) เรียนvocab ก่อนสอบ 1 ครั้ง เก็งข้อสอบให้ใกล้เคียงของจริง",
      "เจอศัพท์ที่พี่ให้ทุกคำเลย",
    ],
    images: ["/reviews/น้องเรียนGED.webp"],
  },
  {
    name: "น้องแพท",
    avatar: "/reviews/ano.png",
    subject: "ชีววิทยา",
    school: "-",
    content: [
      "น้อง ม.5 เรียนวิชาชีววิทยา เรื่องพืช เพื่อเตรียมตัวสอบกลางภาคที่โรงเรียน",
      "ถ้าเจอพี่เร็วกว่านี้จำได้แม่นเลย",
    ],
    images: ["/reviews/น้องแพท.webp"],
  },
  {
    name: "น้องพิมพ์",
    avatar: "/reviews/ano.png",
    subject: "ฟิสิกส์ ม.ปลาย",
    school: "-",
    content: ["น้ำตาจะไหลมากค่ะพี่ ไม่ต้องไปตามสอบซ่อม"],
    images: ["/reviews/น้องพิมพ์.webp"],
  },
  {
    name: "Anonymous",
    avatar: "/reviews/น้องฟิสยาม2.webp",
    subject: "ฟิสิกส์ ม.ต้น",
    school: "โรงเรียนอัสสัมชัญธนบุรี",
    content: [
      "คุณครูเก่ง มีข้อมูลในการสอนเยอะ  สอนเข้าใจง่ายค่ะ และได้เทคนิคการคำนวนค่ะ",
    ],
    images: ["/reviews/น้องฟิสยาม.webp"],
  },

  {
    name: "น้องแคทลียา",
    avatar: "/reviews/ano.png",
    subject: "ฟิิสิกส์",
    school: "คณะเทคนิคการแพทย์",
    content: ["น้องแคทลียา จังหวัดสกลนคร สอบติดคณะเทคนิคการแพทย์"],
    images: ["/reviews/น้องภาคใต้.webp"],
  },
  {
    name: "น้อง whale",
    avatar: "/reviews/ano.png",
    subject: "ภาษาอังกฤษ",
    school: "homeschool",
    content: ["สอนดีเข้าใจง่ายครับผม"],
    images: ["/reviews/whale.webp"],
  },
  {
    name: "น้องผักกาด",
    avatar: "/reviews/ano.png",
    subject: "คณิตศาสตร์",
    school: "-",
    content: [
      "น้องติดสำรอง วมวนะคะ และติดห้อง GC ที่เดิมค่ะ",
      "ผลสอบออกเมื่อวานสอบได้ที่ 9 ค่ะ ซึ่งเหนือความคาดหมายมากค่ะ",
      "ขอบคุณพี่ดรีมนะคะ ที่ช่วยติวให้",
    ],
    images: ["/reviews/น้องผักกาด.png"],
  },
  {
    name: "น้องลีโอ",
    avatar: "/reviews/ano.png",
    subject: "สังคมศึกษา",
    school: "โรงเรียนโยธินบูรณะ",
    content: [
      "สอบติดเข้าเรียนต่อระดับชั้นมัธยมศึกษาปีที่ 4 โรงเรียนโยธินบูรณะ",
    ],
    images: ["/reviews/น้องลีโอ.png"],
  },
  {
    name: "น้องลีโอ",
    avatar: "/reviews/ano.png",
    subject: "สังคมศึกษา",
    school: "โรงเรียนโยธินบูรณะ",
    content: [
      "สอบติดเข้าเรียนต่อระดับชั้นมัธยมศึกษาปีที่ 4 โรงเรียนโยธินบูรณะ",
    ],
    images: ["/reviews/น้องลีโอ.png"],
  },
  {
    name: "น้องโอ๊ค",
    avatar: "/reviews/ano.png",
    subject: "สังคมศึกษา",
    school: "-",
    content: ["ขอบคุณครับผมสอบติดแล้วครับ"],
    images: ["/reviews/น้องโอ๊ค.png"],
  },
];
