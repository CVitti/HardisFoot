/* ════════════════════════════════════════════════════════
   components/nav.js — Barre de navigation
   ════════════════════════════════════════════════════════ */

/**
 * Met à jour la zone droite de la nav selon l'état de connexion.
 * Affiche : badge admin + avatar + nom + bouton déconnexion,
 * ou rien si l'utilisateur n'est pas connecté.
 */
function renderNav() {
  const el = document.getElementById('nav-right');
  if (!App.currentUser) { el.innerHTML = ''; return; }

  const u = App.currentUser;
  el.innerHTML = `
    <div class="nav-user">
      ${u.isAdmin ? `<span class="badge badge-admin">${icon('shield')} Admin</span>` : ''}
      ${avHTML(u, 'avatar-sm')}
      <span class="nav-user-name">${escHtml(u.name)}</span>
      <button class="btn btn-ghost btn-sm" onclick="App.logout()">Déconnexion</button>
    </div>`;
}
