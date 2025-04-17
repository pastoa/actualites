const postsFolder = 'post/';
const maxArticlesPerPage = 10; // 1 Une + 9 secondaires

// Liste des fichiers .md à charger
const postFiles = [
  'article1.md',
  'article2.md',
  'article3.md',
  'article4.md',
  'article5.md',
  'article6.md',
  'article7.md',
  'article8.md',
  'article9.md',
  'article10.md',
  'article11.md',
  'article12.md',
];

// Lecture et parsing des fichiers Markdown avec frontmatter YAML
function parseMarkdown(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return null;

  const meta = {};
  match[1].split('\n').forEach(line => {
    const [key, ...rest] = line.split(':');
    if (key && rest) meta[key.trim()] = rest.join(':').trim();
  });

  meta.content = match[2].trim();
  meta.dateObj = new Date(meta.date);
  return meta;
}

// Injecter l’actu de une
function renderActuUne(article) {
  const une = document.getElementById('actu-une');
  une.innerHTML = `
    <div class="image">
      <img src="${article.image}" alt="${article.title}">
    </div>
    <div class="texte">
      <h2>${article.title}</h2>
      <p class="date">${article.date}</p>
      <p>${article.summary}</p>
      <a class="btn" href="#">LIRE LA SUITE</a>
    </div>
  `;
}

// Injecter les 9 articles suivants
function renderArticlesSecondaires(articles) {
  const liste = document.getElementById('liste-actus');
  liste.innerHTML = '';
  articles.forEach(article => {
    const div = document.createElement('div');
    div.className = 'carte-article';
    div.innerHTML = `
      <img src="${article.image}" alt="${article.title}">
      <h3>${article.title}</h3>
      <p class="date">${article.date}</p>
      <p>${article.summary}</p>
      <a class="btn" href="#">LIRE LA SUITE</a>
    `;
    liste.appendChild(div);
  });
}

// Fonction pour formater la date en FR
    function formatDate(dateString) {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    }

// Afficher la pagination
function renderPagination(currentPage, totalPages) {
  const pag = document.getElementById('pagination');
  pag.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const link = document.createElement('a');
    link.className = 'page' + (i === currentPage ? ' active' : '');
    link.textContent = i;
    link.href = '#';
    link.onclick = (e) => {
      e.preventDefault();
      loadPage(i);
    };
    pag.appendChild(link);
  }
}

// Charger et afficher la page n
async function loadPage(page = 1) {
  const articles = [];

  for (const file of postFiles) {
    try {
      const res = await fetch(`${postsFolder}${file}`);
      const txt = await res.text();
      const data = parseMarkdown(txt);
      if (data) articles.push(data);
    } catch (e) {
      console.warn(`Erreur de chargement de ${file}`, e);
    }
  }

  // Trier par date
  articles.sort((a, b) => b.dateObj - a.dateObj);

  const totalPages = Math.ceil(articles.length / maxArticlesPerPage);
  const start = (page - 1) * maxArticlesPerPage;

  const pageArticles = articles.slice(start, start + maxArticlesPerPage);

  const une = pageArticles[0];
  const secondaires = pageArticles.slice(1, maxArticlesPerPage);

  renderActuUne(une);
  renderArticlesSecondaires(secondaires);
  renderPagination(page, totalPages);
}

document.addEventListener('DOMContentLoaded', () => {
  loadPage(1);
});
