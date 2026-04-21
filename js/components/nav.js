/* ════════════════════════════════════════════════════════
   components/nav.js — Barre de navigation
   ════════════════════════════════════════════════════════ */

/**
 * Met à jour la zone droite de la nav selon l'état de connexion.
 * Affiche : badge admin + avatar + nom + bouton déconnexion,
 * ou rien si l'utilisateur n'est pas connecté.
 */
function renderNavBar() {
  const el = document.getElementById('navbar');

  el.innerHTML = `
    <div class="nav-logo" onclick="App.goHome()">
      <div class="nav-logo-ball">
        ${icon('football_black')}
      </div>
      Hardis Foot
    </div>
    <!-- Injecté par renderNav() -->
    <div class="nav-right" id="navbar-right"></div>`;

    renderNavUser()
}

function renderNavUser() {
  const el = document.getElementById('navbar-right');
  if (!App.currentUser) { el.innerHTML = ''; return; }

  const u = App.currentUser;
  el.innerHTML = `
    <div class="nav-user">
      ${u.isAdmin ? `<span class="badge badge-admin">Admin</span>` : ''}
      ${avHTML(u, 'avatar-sm')}
      <span class="nav-user-name">${escHtml(u.name)}</span>
      <button class="btn btn-ghost btn-sm" onclick="App.logout()">Déconnexion</button>
    </div>`;
}
