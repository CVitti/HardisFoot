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
          
        <!-- Icône ballon de foot -->
        <div class="login-icon">
          ${icon('football_green')}      
        </div>
      
      <div class="login-title">Hardis Foot</div>
      <div class="login-sub">Connecte-toi pour t'inscrire aux matchs</div>
      
      <!-- Bouton de connexion -->
      <button class="btn-google" onclick="showAccountPicker()">
          ${icon('google_icon')} 
          Connexion avec Google
      </button>
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
    <button onclick="App.login(${u.id}); closeModal()" style="display:flex;align-items:center;gap:12px;padding:11px 14px; border-radius:var(--r-md);border:1px solid var(--border-md); background:var(--surface);cursor:pointer;text-align:left; 
            font-family:var(--fb);transition:background .15s;width:100%" onmouseover="this.style.background='var(--surface2)'" onmouseout="this.style.background='var(--surface)'">
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
      Sélectionnez un profil de connexion
    </p>
    <div style="display:flex;flex-direction:column;gap:8px">
      ${usersHTML}
    </div>
    <div class="modal-footer">
      <button class="btn" onclick="closeModal()">Annuler</button>
    </div>`
  );
}
    