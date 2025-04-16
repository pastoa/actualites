async function loadArticles() {
  const container = document.getElementById("articles");
  const files = ["articles/article1.md", "articles/article2.md"];

  for (const file of files) {
    const response = await fetch(file);
    const text = await response.text();

    const meta = text.match(/---([\s\S]*?)---/)[1];
    const content = text.split('---')[2].trim();

    const title = meta.match(/title: "(.*?)"/)[1];
    const date = meta.match(/date: "(.*?)"/)[1];
    const image = meta.match(/image: "(.*?)"/)[1];

    const article = document.createElement("div");
    article.className = "article";
    article.innerHTML = `
      <img src="\${image}" alt="">
      <h2>\${title}</h2>
      <p><em>\${date}</em></p>
      <p>\${content.substring(0, 150)}...</p>
      <a href="#">Lire la suite</a>
    `;
    container.appendChild(article);
  }
}
window.onload = loadArticles;
