/* ════════════════════════════════════════════════════════
   components/matchModal.js — Modale création / édition
   d'un match et modale de confirmation de suppression
   ════════════════════════════════════════════════════════ */

/**
 * Ouvre la modale de création (matchId = null) ou d'édition d'un match.
 * @param {number|null} matchId
 */
function openMatchModal(matchId) {
  const match  = matchId !== null ? DB.matches.find(x => x.id === matchId) : null;
  const isEdit = !!match;

  openModal(`
    <div class="modal-title">${isEdit ? 'Modifier le match' : 'Nouveau match'}</div>

    <!-- Date -->
    <div class="form-group">
      <label class="form-label">Date du match (jeudi)</label>
      <input id="f-date" type="date" value="${isEdit ? match.date : nextAvailableThursday()}">
      <div class="form-hint">Le titre sera automatiquement la date sélectionnée.</div>
    </div>

    <!-- Heure -->
    <div class="form-group">
      <label class="form-label">Heure</label>
      <input id="f-time" type="time" value="${isEdit ? match.time : CONFIG.MATCH_TIME}">
    </div>

    <!-- Lieu (modifiable ponctuellement) -->
    <div class="form-group">
      <label class="form-label">Lieu</label>
      <input id="f-lieu" value="${isEdit ? escHtml(match.lieu) : CONFIG.LIEU_DEFAUT}"
             placeholder="${CONFIG.LIEU_DEFAUT}">
      <div class="form-hint">Modifiable ponctuellement si le lieu change.</div>
    </div>

    <!-- Description -->
    <div class="form-group">
      <label class="form-label">Note / description <span style="color:var(--txt3)">(optionnel)</span></label>
      <input id="f-desc"
             value="${isEdit && match.description ? escHtml(match.description) : ''}"
             placeholder="ex : Crampons requis, présence obligatoire…">
    </div>

    <div class="modal-footer">
      <button class="btn" onclick="closeModal()">Annuler</button>
      <button class="btn btn-primary" onclick="saveMatch(${matchId})">
        ${isEdit ? 'Enregistrer' : 'Créer le match'}
      </button>
    </div>`);
}

/**
 * Lit le formulaire de la modale et enregistre le match
 * (création ou mise à jour selon matchId).
 * @param {number|null} matchId
 */
function saveMatch(matchId) {
  const date        = document.getElementById('f-date').value;
  const time        = document.getElementById('f-time').value;
  const lieu        = document.getElementById('f-lieu').value.trim() || CONFIG.LIEU_DEFAUT;
  const description = document.getElementById('f-desc').value.trim();

  if (!date) { toast('La date est requise.', 'error'); return; }
  if (!time) { toast('L\'heure est requise.', 'error'); return; }

  closeModal();

  if (matchId !== null) {
    // Mise à jour
    App.updateMatch(matchId, { date, time, lieu, description });
  } else {
    // Création — calcule le numéro de session pour ce jour
    const existing = DB.matches.filter(m => m.date === date);
    const session  = existing.length === 0
      ? 1
      : Math.max(...existing.map(m => m.session || 1)) + 1;

    App.createMatch({ date, time, lieu, session, description });
  }
}

/**
 * Ouvre la modale de confirmation avant suppression d'un match.
 * @param {number} matchId
 */
function confirmDeleteMatch(matchId) {
  const match = DB.matches.find(x => x.id === matchId);
  if (!match) return;

  const count = matchFilled(match);

  openModal(`
    <div class="modal-title" style="color:var(--red)">
      ${icon('warn')} Supprimer ce match ?
    </div>
    <p style="font-size:14px;color:var(--txt2);margin-bottom:8px">
      <strong>${fmtDateLong(match.date)}</strong> à ${match.time}
    </p>
    <p style="font-size:13px;color:var(--txt3)">
      ${count} joueur${count !== 1 ? 's' : ''} inscrit${count !== 1 ? 's' : ''}
      ${count > 0 ? 'seront désinscrits.' : '.'} Action irréversible.
    </p>
    <div class="modal-footer">
      <button class="btn" onclick="closeModal()">Annuler</button>
      <button class="btn btn-delete"
              onclick="closeModal(); App.deleteMatch(${matchId})"
              style="gap:5px">
        ${icon('trash')} Supprimer
      </button>
    </div>`);
}
