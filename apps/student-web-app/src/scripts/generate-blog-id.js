// Simple script to generate UUIDs for new blog posts
// Run with: node src/scripts/generate-blog-id.js

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

console.log("Generated UUID for new blog post:");
console.log(generateUUID());
console.log("\nYou can use this UUID as the key in your blog-posts.json file.");
