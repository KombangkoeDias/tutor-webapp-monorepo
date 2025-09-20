"use client";

import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getBlogPostById } from "@/lib/blog-data";

export default function BlogPost() {
  const params = useParams();
  const postId = params.id as string;

  const post = getBlogPostById(postId);

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                ไม่พบบทความ
              </h1>
              <p className="text-gray-600 mb-6">
                บทความที่คุณกำลังมองหาไม่มีอยู่
              </p>
              <Link href="/">
                <Button className="bg-pink-500 hover:bg-pink-600 text-white">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  กลับหน้าแรก
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Back button */}
          <div className="mb-8">
            <Link href="/">
              <Button
                variant="outline"
                className="bg-white hover:bg-pink-50 border-pink-200"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                กลับหน้าแรก
              </Button>
            </Link>
          </div>

          {/* Blog post card */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              {/* Header */}
              <div className="mb-8">
                <motion.h1
                  className="text-4xl font-bold text-gray-800 mb-4 leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  {post.title}
                </motion.h1>

                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(post.publishedAt).toLocaleDateString("th-TH")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <motion.p
                  className="text-lg text-gray-600 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  {post.excerpt}
                </motion.p>
              </div>

              {/* Content */}
              <motion.div
                className="prose prose-lg max-w-none"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                dangerouslySetInnerHTML={{
                  __html: post.content
                    // First, convert markdown images to HTML
                    .replace(
                      /!\[([^\]]*)\]\(([^)]+)\)/g,
                      '<div class="my-4"><img src="$2" alt="$1" class="w-full h-auto rounded-lg shadow-md" /></div>'
                    )
                    // Wrap consecutive images in a custom layout: first image on left, second and third stacked on right
                    .replace(
                      /(<div class="my-4"><img[^>]*><\/div>)(\s*<div class="my-4"><img[^>]*><\/div>)(\s*<div class="my-4"><img[^>]*><\/div>)/g,
                      '<div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">$1<div class="space-y-4">$2$3</div></div>'
                    )
                    // Then convert markdown headings to HTML before converting \n to <br>
                    .replace(
                      /^### (.*$)/gm,
                      '<h3 class="text-xl font-medium text-gray-700 mb-2 mt-4">$1</h3>'
                    )
                    .replace(
                      /^## (.*$)/gm,
                      '<h2 class="text-2xl font-semibold text-gray-700 mb-3 mt-6">$1</h2>'
                    )
                    .replace(
                      /^# (.*$)/gm,
                      '<h1 class="text-3xl font-bold text-gray-800 mb-4 mt-8">$1</h1>'
                    )
                    // Convert blockquotes
                    .replace(
                      /^> (.*$)/gm,
                      '<blockquote class="border-l-4 border-pink-300 pl-4 py-2 italic text-gray-700 bg-pink-50/50 rounded-r-md my-4">$1</blockquote>'
                    )
                    // Convert bold text
                    .replace(
                      /\*\*(.*?)\*\*/g,
                      '<strong class="font-semibold text-gray-800">$1</strong>'
                    )
                    // Convert italic text
                    .replace(
                      /\*(.*?)\*/g,
                      '<em class="italic text-gray-700">$1</em>'
                    )
                    // Convert bullet points
                    .replace(/^- (.*$)/gm, '<li class="ml-4 mb-1">• $1</li>')
                    // Wrap consecutive list items in ul tags
                    .replace(
                      /(<li[^>]*>[\s\S]*?<\/li>)(\s*<li[^>]*>[\s\S]*?<\/li>)+/g,
                      '<ul class="list-disc list-inside mb-4">$&</ul>'
                    )
                    // Convert line breaks
                    .replace(/\n/g, "<br>"),
                }}
              />

              {/* Call to action */}
              <motion.div
                className="mt-12 p-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  ต้องการความช่วยเหลือในการเรียนเพิ่มเติม?
                </h3>
                <p className="text-gray-600 mb-4">
                  หาติวเตอร์ส่วนตัวที่มีคุณภาพจาก Chula Tutor Dream
                  เพื่อช่วยให้การเรียนของคุณประสบความสำเร็จ
                </p>
                <Link href={post.ctaUrl || "/jobs/create"}>
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">
                    หาติวเตอร์ตอนนี้
                  </Button>
                </Link>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
