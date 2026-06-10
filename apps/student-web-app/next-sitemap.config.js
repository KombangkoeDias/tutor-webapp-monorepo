const fs = require("fs");
const path = require("path");

function getBlogPostIds() {
  const filePath = path.join(__dirname, "src/data/blog-posts.json");
  const raw = fs.readFileSync(filePath, "utf8");
  return Object.keys(JSON.parse(raw));
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://chulatutordream.com",
  generateRobotsTxt: true,
  exclude: [
    "/jobs/reservation/list",
    "/jobs/reservation/list/*",
    "/jobs/referral",
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/jobs/reservation/list"],
      },
    ],
  },
  additionalPaths: async () => {
    const blogIds = getBlogPostIds();

    return [
      {
        loc: "/blog",
        changefreq: "weekly",
        priority: 0.8,
        lastmod: new Date().toISOString(),
      },
      ...blogIds.map((id) => ({
        loc: `/blog/${id}`,
        changefreq: "monthly",
        priority: 0.7,
        lastmod: new Date().toISOString(),
      })),
    ];
  },
};
