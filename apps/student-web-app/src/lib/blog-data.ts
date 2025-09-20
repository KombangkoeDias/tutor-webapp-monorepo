import blogPostsData from "@/data/blog-posts.json";
import { BlogPost, BlogPosts } from "@/types/blog";

// Type assertion to ensure the JSON data matches our interface
const blogPosts: BlogPosts = blogPostsData as BlogPosts;

export function getAllBlogPosts(): BlogPost[] {
  return Object.values(blogPosts);
}

export function getBlogPostById(id: string): BlogPost | undefined {
  return blogPosts[id];
}

export function getBlogPostIds(): string[] {
  return Object.keys(blogPosts);
}

export default blogPosts;
