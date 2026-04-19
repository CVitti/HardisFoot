/* ════════════════════════════════════════════════════════
   components/matchCard.js — Carte d'un match individuel
   Utilisée dans la vue joueur ET dans la vue admin.
   ════════════════════════════════════════════════════════ */

/**
 * Génère le HTML d'une carte de match.
 * @param {object}  match    Objet match depuis DB.matches
 * @param {boolean} isAdmin  true = affiche les boutons de gestion admin
 * @returns {string} HTML de la carte
 */
function matchCardHTML(match, isAdmin) {
  const filled    = matchFilled(match);
  const pct       = Math.round(filled / CONFIG.MAX_PLAYERS * 100);
  const isFull    = filled >= CONFIG.MAX_PLAYERS;
  const isPast    = isMatchPast(match);
  const joined    = App.currentUser && match.playerIds.includes(App.currentUser.id);
  const fillCls   = progressFillClass(match);
  const pill      = placesPillInfo(match);

  // Badge de session (affiché seulement s'il y a plusieurs sessions ce jour)
  const sessionsOnDay = DB.matches.filter(x => x.date === match.date);
  const sessionTag    = sessionsOnDay.length > 1
    ? `<span class="match-session-tag">Session ${match.session}</span>`
    : '';

  return `
    <div class="match-card${isPast ? ' past' : ''}">

      <!-- En-tête : titre + badge places -->
      <div class="match-card-top">
        <div>
          <div class="match-title">${fmtDateLong(match.date)}${sessionTag}</div>
          <div class="match-sub">
            <div class="match-sub-item">${icon('clock')} ${match.time}</div>
            <div class="match-sub-item">${icon('pin')} ${escHtml(match.lieu)}</div>
          </div>
        </div>
        <div class="places-pill ${pill.cls}">${pill.ico}${pill.text}</div>
      </div>

      <!-- Description optionnelle -->
      ${match.description ? `<div class="match-desc">${escHtml(match.description)}</div>` : ''}

      <!-- Pied : avatars + barre de progression + action -->
      <div class="match-card-bottom">
        <div class="progress-wrap">
          ${avStackHTML(match)}
          <div class="progress-track">
            <div class="progress-fill ${fillCls}" style="width:${pct}%"></div>
          </div>
          <div class="progress-text">${filled}/${CONFIG.MAX_PLAYERS}</div>
        </div>
        ${isAdmin ? _adminButtons(match, isFull, isPast) : _playerButton(match, joined, isFull, isPast)}
      </div>

    </div>`;
}

/* ── Boutons admin ── */
function _adminButtons(match, isFull, isPast) {
  return `
    <div class="admin-btn-row">

      <!-- Gérer les joueurs (ouvre la modale players) -->
      <button class="btn btn-sm btn-players" onclick="openPlayersModal(${match.id})"
              title="Joueurs inscrits" style="gap:5px">
        ${icon('users')}<span>${matchFilled(match)}/${CONFIG.MAX_PLAYERS}</span>
      </button>

      <!-- Créer une 2e session (seulement si complet et pas passé) -->
      ${isFull && !isPast ? `
        <button class="btn btn-sm btn-session"
                onclick="App.duplicateMatch(${match.id})"
                title="Créer une session supplémentaire ce même jour"
                style="gap:5px">
          ${icon('copy')}<span>Session 2</span>
        </button>` : ''}

      <!-- Modifier -->
      <button class="btn btn-sm btn-edit" onclick="openMatchModal(${match.id})" style="gap:5px">
        ${icon('edit')}<span>Modifier</span>
      </button>

      <!-- Supprimer -->
      <button class="btn btn-sm btn-delete" onclick="confirmDeleteMatch(${match.id})" style="gap:5px">
        ${icon('trash')}<span>Supprimer</span>
      </button>

    </div>`;
}

/* ── Bouton joueur ── */
function _playerButton(match, joined, isFull, isPast) {
  if (isPast) return ''; // Aucun bouton sur un match passé

  if (joined) {
    return `
      <button class="btn btn-sm"
              style="border-color:var(--green);color:var(--green);white-space:nowrap"
              onclick="App.toggleJoin(${match.id})">
        ${icon('check')} Inscrit
      </button>`;
  }
  if (isFull) {
    return `<button class="btn btn-sm" disabled>Complet</button>`;
  }
  return `
    <button class="btn btn-sm btn-primary" onclick="App.toggleJoin(${match.id})">
      S'inscrire
    </button>`;
}
