/* ════════════════════════════════════════════════════════
   components/membersModal.js — Modale de confirmation de
   suppression d'un membre (avec désinscription auto des matchs)
   ════════════════════════════════════════════════════════ */

/**
 * Ouvre la modale de confirmation avant de supprimer un membre.
 * Affiche le nombre de matchs dont il sera désinscrit.
 * @param {number} userId
 */
function confirmDeleteMember(userId) {
  const user = DB.users.find(x => x.id === userId);
  if (!user) return;

  const matchCount = DB.matches.filter(m => m.playerIds.includes(userId)).length;

  openModal(`
    <div class="modal-title" style="color:var(--red)">
      ${icon('user_x')} Supprimer ce membre ?
    </div>

    <!-- Aperçu du membre -->
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;
                padding:12px;background:var(--surface2);border-radius:var(--r-md)">
      ${avHTML(user, 'avatar-md')}
      <div>
        <div style="font-weight:600">${escHtml(user.name)}</div>
        <div style="font-size:12px;color:var(--txt3)">${escHtml(user.email)}</div>
      </div>
    </div>

    <p style="font-size:13px;color:var(--txt3)">
      Ce membre sera désinscrit de
      <strong>${matchCount} match${matchCount !== 1 ? 's' : ''}</strong>
      et son compte sera définitivement supprimé.
      Cette action est irréversible.
    </p>

    <div class="modal-footer">
      <button class="btn" onclick="closeModal()">Annuler</button>
      <button class="btn btn-delete"
              onclick="closeModal(); App.deleteMember(${userId})"
              style="gap:5px">
        ${icon('user_x')} Supprimer
      </button>
    </div>`);
}
