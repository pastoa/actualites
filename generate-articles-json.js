const fs = require("fs");
const path = require("path");

const articlesDir = path.join(__dirname, "post");
const output = [];

fs.readdirSync(articlesDir)
  .filter(file => file.endsWith(".md"))
  .forEach(file => {
    try {
      const filePath = path.join(articlesDir, file);
      const content = fs.readFileSync(filePath, "utf-8");
      const [ , frontmatter, body ] = content.split("---");

      if (!frontmatter || !body) {
        throw new Error(`Format YAML invalide dans ${file}`);
      }

      const meta = {};
      frontmatter.trim().split("\n").forEach(line => {
        const [key, ...rest] = line.split(":");
        meta[key.trim()] = rest.join(":").trim().replace(/^"|"$/g, "");
      });

      const excerpt = body.trim().split("\n").slice(0, 5).join(" ");
      const slug = file.replace(".md", "");

      output.push({
        title: meta.title,
        date: meta.date,
        image: `https://pastoa.github.io/actualites/${meta.image}`,
        slug,
        excerpt,
        content: body.trim() // ✅ contenu complet de l’article
      });
    } catch (error) {
      console.error(`❌ Erreur dans le fichier ${file}: ${error.message}`);
      process.exit(1);
    }
  });

output.sort((a, b) => new Date(b.date) - new Date(a.date));

fs.writeFileSync("articles.json", JSON.stringify(output, null, 2));
console.log("✅ Fichier articles.json généré avec contenu complet !");
