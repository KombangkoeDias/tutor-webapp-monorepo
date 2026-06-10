import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/seo/json-ld";
import { getBlogPostById, getBlogPostIds } from "@/lib/blog-data";
import { articleJsonLd, buildPageMetadata } from "@/lib/seo";
import BlogPostClient from "./blog-post-client";

type BlogPostPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return getBlogPostIds().map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { id } = await params;
  const post = getBlogPostById(id);

  if (!post) {
    return buildPageMetadata({
      title: "ไม่พบบทความ",
      description: "บทความที่คุณกำลังมองหาไม่มีอยู่",
      path: `/blog/${id}`,
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.id}`,
    image: post.image,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { id } = await params;
  const post = getBlogPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          title: post.title,
          description: post.excerpt,
          path: `/blog/${post.id}`,
          image: post.image,
          author: post.author,
          publishedAt: post.publishedAt,
        })}
      />
      <BlogPostClient />
    </>
  );
}
