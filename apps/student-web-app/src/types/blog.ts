export interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  publishedAt: string;
  readTime: string;
  excerpt: string;
  category: string;
  image: string;
  ctaUrl?: string;
}

export interface BlogPosts {
  [key: string]: BlogPost;
}
