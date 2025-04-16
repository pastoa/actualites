const articlePaths = [
  "articles/article1.md", "articles/article2.md", "articles/article3.md",
  "articles/article4.md", "articles/article5.md", "articles/article6.md",
  "articles/article7.md", "articles/article8.md", "articles/article9.md",
  "articles/article10.md", "articles/article11.md"
];

const articlesPerPage = 10;
let currentPage = 1;

async function parseArticle(file) {
  const res = await fetch(file);
  const text = await res.text();
  const [, metaBlock, content] = text.split('---');

  const title = metaBlock.match(/title: "(.*?)"/)[1];
  const date = metaBlock.match(/date: "(.*?)"/)[1];
  const image = metaBlock.match(/image: "(.*?)"/)[1];
  const summary = content.trim().split("\n").slice(0, 5).join(" ");

  return { title, date: new Date(date), image, summary, file };
}

async function renderPage(page) {
  currentPage = page;

  const parsedArticles = await Promise.all(articlePaths.map(parseArticle));
  parsedArticles.sort((a, b) => b.date - a.date); // tri décroissant

  const start = (page - 1) * articlesPerPage;
  const pageArticles = parsedArticles.slice(start, start + articlesPerPage);

  const principale = pageArticles[0];
  const secondaires = pageArticles.slice(1, 10);

  const principaleHTML = `
    <img src="${principale.image}" alt="">
    <div class="texte">
      <h2>${principale.title}</h2>
      <p class="date">${principale.date.toLocaleDateString('fr-FR')}</p>
      <p>${principale.summary}</p>
      <a href="#" class="btn">LIRE LA SUITE</a>
    </div>
  `;
  document.getElementById("actu-principale").innerHTML = principaleHTML;

  const secondairesHTML = secondaires.map(article => `
    <div class="carte">
      <img src="${article.image}" alt="">
      <div class="contenu">
        <h3>${article.title}</h3>
        <p class="date">${article.date.toLocaleDateString('fr-FR')}</p>
        <p>${article.summary}</p>
        <a href="#" class="btn">LIRE LA SUITE</a>
      </div>
    </div>
  `).join("");

  document.getElementById("actus-secondaires").innerHTML = secondairesHTML;

  const totalPages = Math.ceil(parsedArticles.length / articlesPerPage);
  const paginationHTML = Array.from({ length: totalPages }, (_, i) => `
    <button onclick="renderPage(${i + 1})" class="${i + 1 === currentPage ? 'active' : ''}">
      ${i + 1}
    </button>
  `).join("");
  document.getElementById("pagination").innerHTML = paginationHTML;
}

window.onload = () => renderPage(1);

