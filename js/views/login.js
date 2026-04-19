/* ════════════════════════════════════════════════════════
   views/login.js — Vue de connexion (écran d'accueil)
   Affichée quand aucun utilisateur n'est connecté.
   ════════════════════════════════════════════════════════ */

/**
 * Injecte la vue de connexion dans #main.
 */
function renderLogin() {
  document.getElementById('main').innerHTML = `
    <div id="login-screen">
      <div class="login-box">

        <!-- Icône -->
        <div class="login-icon">
          <svg viewBox="0 0 32 32" fill="none" style="width:32px;height:32px">
            <circle cx="16" cy="16" r="12" stroke="#1a9e60" stroke-width="2"/>
            <path d="M16 7l2 6h6.5l-5 3.5 1.8 6L16 19l-5.3 3.5 1.8-6L7.5 13H14z"
                  fill="#1a9e60" opacity=".6"/>
          </svg>
        </div>

        <div class="login-title">MatchDay Football</div>
        <div class="login-sub">Connecte-toi pour t'inscrire aux matchs du jeudi</div>

        <!-- Bouton unique pour joueurs ET admins -->
        <button class="btn-google" onclick="showAccountPicker()">
          <svg style="width:20px;height:20px;flex-shrink:0" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          Connexion avec Google
        </button>

        <p style="font-size:12px;color:var(--txt3);margin-top:16px">
          Joueurs et admins utilisent le même bouton.<br>
          Le rôle est défini sur votre profil.
        </p>
      </div>
    </div>`;
}

/**
 * Affiche le sélecteur de compte (simulation de Google OAuth).
 * En production, remplacer par le vrai flux OAuth Google.
 */
function showAccountPicker() {
  const usersHTML = DB.users
    .filter(u => !u.external)
    .map(u => `
      <button onclick="App.login(${u.id}); closeModal()"
        style="display:flex;align-items:center;gap:12px;padding:11px 14px;
               border-radius:var(--r-md);border:1px solid var(--border-md);
               background:var(--surface);cursor:pointer;text-align:left;
               font-family:var(--fb);transition:background .15s;width:100%"
        onmouseover="this.style.background='var(--surface2)'"
        onmouseout="this.style.background='var(--surface)'">
        ${avHTML(u, 'avatar-md')}
        <div style="flex:1;min-width:0">
          <div style="font-size:14px;font-weight:500;color:var(--txt)">${escHtml(u.name)}</div>
          <div style="font-size:12px;color:var(--txt3)">${escHtml(u.email)}</div>
        </div>
        ${u.isAdmin ? `<span class="badge badge-admin">${icon('shield')} Admin</span>` : ''}
      </button>`)
    .join('');

  openModal(`
    <div class="modal-title">Choisir un compte</div>
    <p style="font-size:13px;color:var(--txt2);margin-bottom:16px">
      Simulation de connexion Google — sélectionnez un profil
    </p>
    <div style="display:flex;flex-direction:column;gap:8px">
      ${usersHTML}
    </div>
    <div class="modal-footer">
      <button class="btn" onclick="closeModal()">Annuler</button>
    </div>`);
}
