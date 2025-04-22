const fs = require("fs");
const matter = require("gray-matter");

const articles = [];

fs.readdirSync("./post").forEach(file => {
  if (file.endsWith(".md")) {
    const raw = fs.readFileSync("./post/" + file, "utf8");
    const { data, content } = matter(raw);
    const cleanText = content.trim().replace(/\n/g, " ");
    const match = cleanText.match(/^(.{50,300}?\.)/); // minimum 50 caractères, jusqu’au 1er point
    const excerpt = match ? match[1] : cleanText.slice(0, 200);

    articles.push({
      id: data.id,
      title: data.title,
      date: data.date,
      image: "https://pastoa.github.io/actualites/" + data.image,
      slug: file.replace(".md", ""),
      excerpt: excerpt,
      content: content.trim() // ✅ le vrai contenu est bien là
    });
  }
});

articles.sort((a, b) => new Date(b.date) - new Date(a.date));
fs.writeFileSync("articles.json", JSON.stringify(articles, null, 2));
console.log("✅ articles.json généré avec contenu complet !");
