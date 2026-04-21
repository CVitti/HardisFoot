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
  const max     = matchMax(match);
  const filled  = matchFilled(match);
  const pct     = Math.round(filled / max * 100);
  const isFull  = filled >= max;
  const isPast  = isMatchPast(match);
  const joined  = App.currentUser && match.playerIds.includes(App.currentUser.id);
  const fillCls = progressFillClass(match);
  const pill    = placesPillInfo(match);

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
        <div class="places-pill ${pill.cls}">${pill.text}</div>
      </div>

      <!-- Description optionnelle -->
      ${match.description ? `<div class="match-desc">${escHtml(match.description)}</div>` : ''}

      <!-- Pied : avatars + barre de progression + actions -->
      <div class="match-card-bottom">
        <div class="progress-wrap">
          ${avStackHTML(match)}
          <div class="progress-track">
            <div class="progress-fill ${fillCls}" style="width:${pct}%"></div>
          </div>
          <div class="progress-text">${filled}/${max}</div>
        </div>
        ${isAdmin ? _adminButtons(match, joined, isFull, isPast) : _playerButton(match, joined, isFull, isPast)}
      </div>

    </div>`;
}

/* ── Boutons admin : icônes compactes + bouton inscription ── */
function _adminButtons(match, joined, isFull, isPast) {
  return `
    <div class="admin-btn-row">

      <!-- Gérer les joueurs inscrits -->
      <button class="btn btn-sm btn-players btn-icon"
              onclick="openPlayersModal(${match.id})"
              title="Gérer les joueurs (${matchFilled(match)}/${matchMax(match)})">
        ${icon('users')}
      </button>

      <!-- Créer une 2e session (seulement si complet et pas passé) -->
      ${isFull && !isPast ? `
        <button class="btn btn-sm btn-session btn-icon"
                onclick="App.duplicateMatch(${match.id})"
                title="Créer une session supplémentaire ce même jour">
          ${icon('copy')}
        </button>` : ''}

      <!-- Modifier -->
      <button class="btn btn-sm btn-edit btn-icon"
              onclick="openMatchModal(${match.id})"
              title="Modifier ce match">
        ${icon('edit')}
      </button>

      <!-- Supprimer -->
      <button class="btn btn-sm btn-delete btn-icon"
              onclick="confirmDeleteMatch(${match.id})"
              title="Supprimer ce match">
        ${icon('trash')}
      </button>

      <!-- Séparateur visuel -->
      ${!isPast ? `<div style="width:1px;height:24px;background:var(--border-md);margin:0 2px;align-self:center"></div>` : ''}

      <!-- Inscription de l'admin (comme n'importe quel joueur) -->
      ${!isPast ? _playerButton(match, joined, isFull, isPast) : ''}

    </div>`;
}

/* ── Bouton inscription joueur (partagé admin + joueur) ── */
function _playerButton(match, joined, isFull, isPast) {
  if (isPast) return '';

  if (joined) {
    return `
      <button class="btn btn-sm" style="border-color:var(--green);color:var(--green);white-space:nowrap" onclick="App.toggleJoin(${match.id})" title="Cliquer pour se désinscrire">
         Inscrit
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
