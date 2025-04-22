function getArticleIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function formatDateFR(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

function renderArticle(article) {
  const titleEl = document.getElementById('article-title');
  const dateEl = document.getElementById('article-date');
  const imageEl = document.getElementById('article-image');
  const contentEl = document.getElementById('article-content');

  if (titleEl) titleEl.textContent = article.title;
  if (dateEl) dateEl.textContent = formatDateFR(article.date);
  if (imageEl) imageEl.src = article.image;
  if (contentEl) contentEl.innerHTML = article.content;
}

function renderRecentArticles(allArticles, currentId) {
  const recentArticlesContainer = document.getElementById("recent-articles-container");
  recentArticlesContainer.innerHTML = "";

  const recent = allArticles
    .filter(article => article.id !== currentId)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 2);

  recent.forEach(article => {
    const block = document.createElement("div");
    block.className = "recent-article";

    block.innerHTML = `
      <a href="article.html?id=${article.id}">
        <img src="${article.image}" alt="${article.title}">
        <h4>${article.title}</h4>
        <p class="date">${formatDateFR(article.date)}</p>
      </a>
    `;

    recentArticlesContainer.appendChild(block);
  });
}

fetch("articles.json")
  .then(response => response.json())
  .then(data => {
    const articleId = getArticleIdFromURL();
    const article = data.find(a => a.id === articleId);

    if (article) {
      renderArticle(article);
      renderRecentArticles(data, articleId);
    } else {
      document.querySelector("main").innerHTML = "<p>Article introuvable.</p>";
    }
  })
  .catch(error => console.error("Erreur de chargement des articles :", error));

