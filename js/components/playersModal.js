/* ════════════════════════════════════════════════════════
   components/playersModal.js — Modale de gestion des
   joueurs inscrits à un match (membres + invités externes)
   ════════════════════════════════════════════════════════ */

/**
 * Point d'entrée : ouvre la modale pour un match donné.
 * @param {number} matchId
 */
function openPlayersModal(matchId) {
  renderPlayersModal(matchId);
}

/**
 * Construit et affiche la modale de gestion des joueurs.
 * Appelée aussi après chaque action (ajout / retrait) pour
 * rafraîchir le contenu sans fermer la modale.
 * @param {number} matchId
 */
function renderPlayersModal(matchId) {
  const match = DB.matches.find(x => x.id === matchId);
  if (!match) return;

  const members   = match.playerIds.map(id => DB.users.find(u => u.id === id)).filter(Boolean);
  const externals = match.externalPlayers || [];
  const max       = matchMax(match);
  const filled    = matchFilled(match);
  const remaining = matchRemaining(match);
  const isFull    = filled >= max;

  // Membres du club non encore inscrits à ce match
  const available = DB.users.filter(u => !u.external && !match.playerIds.includes(u.id));

  openModal(`
    <div class="modal-title">${icon('users')} Joueurs inscrits</div>

    <!-- Sous-titre : date et compteur -->
    <div style="font-size:13px;color:var(--txt3);margin-bottom:4px">
      ${fmtDateLong(match.date)} · ${match.time}
    </div>
    <div style="font-size:14px;font-weight:600;margin-bottom:14px;display:flex;align-items:center;gap:8px;
                color:${isFull ? 'var(--red)' : 'var(--txt2)'}">
      ${filled} / ${max} joueurs
      ${isFull
        ? '<span class="badge badge-full">Complet</span>'
        : `<span class="badge badge-open">${remaining} place${remaining > 1 ? 's' : ''}</span>`}
    </div>

    <!-- Liste des inscrits (scrollable) -->
    <div style="max-height:240px;overflow-y:auto;margin:0 -4px;padding:0 4px">
      ${members.length === 0 && externals.length === 0
        ? `<div style="font-size:13px;color:var(--txt3);padding:12px 0;text-align:center">
             Aucun joueur inscrit.
           </div>`
        : ''}

      <!-- Membres du club -->
      ${members.map((u, i) => `
        <div class="player-row">
          <div class="player-row-left">
            <span style="font-size:11px;color:var(--txt3);min-width:20px;text-align:right">${i + 1}.</span>
            ${avHTML(u, 'avatar-sm')}
            <div>
              <div class="player-name">${escHtml(u.name)}</div>
              <div class="player-sub">${escHtml(u.email)}</div>
            </div>
          </div>
          <button class="btn btn-xs btn-danger"
                  onclick="App.removePlayerFromMatch(${matchId}, ${u.id}); renderPlayersModal(${matchId})">
            Retirer
          </button>
        </div>`).join('')}

      <!-- Invités externes -->
      ${externals.map((e, i) => {
        const initials = (e.name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
        return `
        <div class="player-row">
          <div class="player-row-left">
            <span style="font-size:11px;color:var(--txt3);min-width:20px;text-align:right">
              ${members.length + i + 1}.
            </span>
            <div class="avatar avatar-sm" style="background:#fdf0dc;color:#c97a10"
                 title="${escHtml(e.name)}">${initials}</div>
            <div>
              <div class="player-name">${escHtml(e.name)}</div>
              <div class="player-sub player-external">Invité externe</div>
            </div>
          </div>
          <button class="btn btn-xs btn-danger"
                  onclick="App.removeExternalFromMatch(${matchId}, '${e.extId}'); renderPlayersModal(${matchId})">
            Retirer
          </button>
        </div>`;
      }).join('')}
    </div>

    <!-- Zone d'ajout (masquée si complet) -->
    ${!isFull ? `
      <div style="margin-top:16px;border-top:1px solid var(--border);padding-top:14px;display:flex;flex-direction:column;gap:12px">

        <!-- Ajouter un membre existant -->
        ${available.length > 0 ? `
          <div>
            <div class="form-label">Inscrire un membre du club</div>
            <div style="display:flex;gap:8px">
              <select id="add-member-sel" style="flex:1">
                ${available.map(u =>
                  `<option value="${u.id}">${escHtml(u.name)}${u.isAdmin ? ' (admin)' : ''}</option>`
                ).join('')}
              </select>
              <button class="btn btn-primary btn-sm"
                      onclick="doAddMember(${matchId})" style="gap:5px">
                ${icon('plus')} Ajouter
              </button>
            </div>
          </div>` : ''}

        <!-- Ajouter un invité externe (sans compte) -->
        <div>
          <div class="form-label">
            ${icon('person_add')} Inscrire un invité externe
            <span style="color:var(--txt3);font-weight:400">(sans compte)</span>
          </div>
          <div style="display:flex;gap:8px">
            <input id="ext-name-input" placeholder="Prénom Nom de l'invité" style="flex:1">
            <button class="btn btn-edit btn-sm"
                    onclick="doAddExternal(${matchId})" style="gap:5px">
              ${icon('plus')} Ajouter
            </button>
          </div>
          <div class="form-hint">Géré uniquement par les admins.</div>
        </div>

      </div>`

    /* Match complet */
    : `<div style="margin-top:12px;padding:10px 14px;background:var(--red-light);
                   border-radius:var(--r-md);font-size:13px;color:var(--red)">
         Match complet — limite de ${max} joueur${max > 1 ? 's' : ''} atteinte.
       </div>`}

    <div class="modal-footer">
      <button class="btn" onclick="closeModal()">Fermer</button>
    </div>`, true); /* wide = true */
}

/* ── Handlers des boutons d'ajout ── */

/**
 * Ajoute le membre sélectionné dans le select au match,
 * puis rafraîchit la modale.
 * @param {number} matchId
 */
function doAddMember(matchId) {
  const sel = document.getElementById('add-member-sel');
  if (!sel) return;
  App.addPlayerToMatch(matchId, parseInt(sel.value));
  renderPlayersModal(matchId);
}

/**
 * Ajoute l'invité externe (nom saisi) au match,
 * puis rafraîchit la modale.
 * @param {number} matchId
 */
function doAddExternal(matchId) {
  const inp = document.getElementById('ext-name-input');
  if (!inp) return;
  const name = inp.value.trim();
  if (!name) { toast('Saisissez un nom.', 'error'); return; }
  App.addExternalToMatch(matchId, name);
  renderPlayersModal(matchId);
}
