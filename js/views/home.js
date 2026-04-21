/* ════════════════════════════════════════════════════════
   views/home.js — Vue principale pour les joueurs
   Affiche le hero, les filtres et la liste des matchs.
   Les matchs passés sont masqués pour les joueurs :
   seuls les admins y ont accès (via views/admin.js).
   ════════════════════════════════════════════════════════ */

/**
 * Injecte la vue joueur dans #main.
 * Seuls les matchs à venir sont affichés.
 */
function renderHome() {
  const uid    = App.currentUser.id;
  const filter = App.filter;

  // Les joueurs ne voient que les matchs à venir (non passés)
  let matches = DB.matches
    .filter(m => !isMatchPast(m))
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  // Appliquer les filtres
  if (filter === 'open') {
    // Utilise matchMax(m) propre à chaque match
    matches = matches.filter(m => matchFilled(m) < matchMax(m));
  }
  if (filter === 'joined') {
    matches = matches.filter(m => m.playerIds.includes(uid));
  }

  // Chips de filtre
  const filters = [
    ['all',    `Tous (${DB.matches.filter(m => !isMatchPast(m)).length})`],
    ['open',   'Places disponibles'],
    ['joined', 'Mes inscriptions'],
  ];

  const filtersHTML = filters.map(([k, l]) =>
    `<div class="filter-chip${filter === k ? ' active' : ''}"
          onclick="App.filter = '${k}'; App.render()">${l}</div>`
  ).join('');

  const matchesHTML = matches.map(m => matchCardHTML(m, false)).join('');

  const emptyHTML = matches.length === 0
    ? `<div class="empty-state">${icon('football_black')}<div>Aucun match pour ce filtre.</div></div>`
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
      ${matchesHTML}
      ${emptyHTML}
    </div>`;
}
