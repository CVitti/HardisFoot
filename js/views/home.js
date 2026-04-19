/* ════════════════════════════════════════════════════════
   views/home.js — Vue principale pour les joueurs
   Affiche le hero, les filtres et la liste des matchs.
   ════════════════════════════════════════════════════════ */

/**
 * Injecte la vue joueur dans #main.
 * Sépare les matchs à venir et les matchs passés.
 * Les matchs passés sont affichés en bas avec un séparateur visuel.
 */
function renderHome() {
  const uid    = App.currentUser.id;
  const filter = App.filter;

  // Trier : à venir (chrono asc) et passés (chrono desc, plus récent en premier)
  let future = DB.matches
    .filter(m => !isMatchPast(m))
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  let past = DB.matches
    .filter(m => isMatchPast(m))
    .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));

  // Appliquer les filtres
  if (filter === 'open') {
    future = future.filter(m => matchFilled(m) < CONFIG.MAX_PLAYERS);
    past   = []; // Les matchs passés ne sont jamais "ouverts"
  }
  if (filter === 'joined') {
    future = future.filter(m => m.playerIds.includes(uid));
    past   = past.filter(m => m.playerIds.includes(uid));
  }

  // Chips de filtre avec compteurs
  const totalFuture = DB.matches.filter(m => !isMatchPast(m)).length;
  const filters = [
    ['all',    `Tous (${DB.matches.length})`],
    ['open',   'Places disponibles'],
    ['joined', 'Mes inscriptions'],
  ];

  const filtersHTML = filters.map(([k, l]) =>
    `<div class="filter-chip${filter === k ? ' active' : ''}"
          onclick="App.filter = '${k}'; App.render()">${l}</div>`
  ).join('');

  // Contenu des matchs
  const futureHTML = future.map(m => matchCardHTML(m, false)).join('');
  const pastHTML   = past.length > 0
    ? `<div class="past-separator">Matchs passés</div>${past.map(m => matchCardHTML(m, false)).join('')}`
    : '';
  const emptyHTML  = future.length === 0 && past.length === 0
    ? `<div class="empty-state">${icon('football')}<div>Aucun match pour ce filtre.</div></div>`
    : '';

  document.getElementById('main').innerHTML = `
    ${renderHero()}

    <div class="page-header">
      <div class="rt-indicator">
        <div class="rt-dot"></div>
        Inscriptions en temps réel
      </div>
    </div>

    <div class="page-content">
      <div class="filter-bar">${filtersHTML}</div>
      ${futureHTML}
      ${pastHTML}
      ${emptyHTML}
    </div>`;
}
