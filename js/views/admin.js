/* ════════════════════════════════════════════════════════
   views/admin.js — Panneau d'administration
   Onglets : Matchs | Membres & rôles
   Les statistiques globales sont volontairement absentes :
   la vue individuelle de chaque match est suffisante.
   ════════════════════════════════════════════════════════ */

/**
 * Injecte la vue admin dans #main.
 */
function renderAdmin() {
  const tab = App.adminTab;

  document.getElementById('main').innerHTML = `
    ${renderHero()}

    <div class="page-header">
      <div class="page-title">Panneau admin</div>
      <div class="rt-indicator">
        <div class="rt-dot"></div>
        Inscriptions en temps réel
      </div>
    </div>

    <div class="page-content">

      <!-- Onglets -->
      <div class="tabs" style="margin-bottom:20px">
        <div class="tab-item${tab === 'matches' ? ' active' : ''}"
             onclick="App.adminTab = 'matches'; App.render()">
          Matchs
        </div>
        <div class="tab-item${tab === 'players' ? ' active' : ''}"
             onclick="App.adminTab = 'players'; App.render()">
          Membres &amp; rôles
        </div>
      </div>

      ${tab === 'matches' ? _renderAdminMatches() : _renderAdminMembers()}

    </div>`;
}

/* ────────────────────────────────────────────────────────
   Onglet Matchs
   ──────────────────────────────────────────────────────── */

/**
 * Génère la liste des matchs dans le panneau admin.
 * Matchs à venir en premier, matchs passés en bas avec séparateur.
 * @returns {string} HTML
 */
function _renderAdminMatches() {
  const future = DB.matches
    .filter(m => !isMatchPast(m))
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  const past = DB.matches
    .filter(m => isMatchPast(m))
    .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));

  const emptyHTML = future.length === 0 && past.length === 0
    ? `<div class="empty-state">${icon('football')}<div>Aucun match planifié.</div></div>`
    : '';

  const pastHTML = past.length > 0
    ? `<div class="past-separator">Matchs passés</div>${past.map(m => matchCardHTML(m, true)).join('')}`
    : '';

  return `
    <div class="section-bar">
      <div style="font-size:14px;color:var(--txt2)">
        ${DB.matches.length} match${DB.matches.length > 1 ? 's' : ''}
        · max ${CONFIG.MAX_PLAYERS} joueurs par session
      </div>
      <button class="btn btn-primary btn-sm"
              onclick="openMatchModal(null)" style="gap:5px">
        ${icon('plus')} Nouveau match
      </button>
    </div>
    ${emptyHTML}
    ${future.map(m => matchCardHTML(m, true)).join('')}
    ${pastHTML}`;
}

/* ────────────────────────────────────────────────────────
   Onglet Membres & rôles
   ──────────────────────────────────────────────────────── */

/**
 * Génère la liste des membres avec toggles admin et boutons suppression.
 * @returns {string} HTML
 */
function _renderAdminMembers() {
  const members = DB.users.filter(u => !u.external);
  const adminCount = members.filter(u => u.isAdmin).length;

  const rowsHTML = members.map(u => {
    const matchCount = DB.matches.filter(m => m.playerIds.includes(u.id)).length;
    const isSelf     = u.id === App.currentUser.id;

    return `
      <div class="player-row">
        <div class="player-row-left">
          ${avHTML(u, 'avatar-sm')}
          <div>
            <div class="player-name">
              ${escHtml(u.name)}
              ${isSelf ? '<span style="font-size:11px;color:var(--txt3)">(vous)</span>' : ''}
            </div>
            <div class="player-sub">
              ${escHtml(u.email)} · ${matchCount} match${matchCount !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
        <div class="player-row-right">
          ${u.isAdmin ? `<span class="badge badge-admin">${icon('shield')} Admin</span>` : ''}

          ${!isSelf ? `
            <!-- Toggle rôle admin -->
            <label class="toggle"
                   title="${u.isAdmin ? 'Retirer les droits admin' : 'Accorder les droits admin'}">
              <input type="checkbox"
                     ${u.isAdmin ? 'checked' : ''}
                     onchange="App.setAdminRole(${u.id}, this.checked)">
              <span class="toggle-slider"></span>
            </label>

            <!-- Supprimer le membre -->
            <button class="btn btn-xs btn-delete"
                    title="Supprimer ce membre"
                    onclick="confirmDeleteMember(${u.id})"
                    style="gap:4px">
              ${icon('user_x')}
            </button>
          ` : `<span style="font-size:12px;color:var(--txt3)">Non modifiable</span>`}
        </div>
      </div>`;
  }).join('');

  return `
    <div class="section-bar">
      <div style="font-size:14px;color:var(--txt2)">
        ${members.length} membre${members.length > 1 ? 's' : ''}
        · ${adminCount} admin${adminCount > 1 ? 's' : ''}
      </div>
    </div>

    <div class="card" style="padding:0 20px">
      ${rowsHTML}
    </div>

    <p style="font-size:12px;color:var(--txt3);margin-top:10px">
      Le toggle active ou retire le rôle admin.
      Vous ne pouvez pas modifier votre propre rôle.
      La suppression désinscrit le membre de tous les matchs.
    </p>`;
}
