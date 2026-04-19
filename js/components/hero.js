/* ════════════════════════════════════════════════════════
   components/hero.js — Bandeau "prochain match" en hero
   Affiché en haut de la vue joueur ET de la vue admin.
   ════════════════════════════════════════════════════════ */

/**
 * Génère le HTML du bandeau hero montrant le prochain match à venir.
 * Inclut un bouton d'inscription rapide pour les joueurs.
 * @returns {string} HTML du bandeau
 */
function renderHero() {
  // Récupère le prochain match à venir (non passé, trié par date)
  const upcoming = DB.matches
    .filter(m => !isMatchPast(m))
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  const next = upcoming[0];

  // Aucun match à venir
  if (!next) {
    return `
      <div class="hero">
        <div class="hero-inner">
          <div class="hero-none">Aucun match à venir pour le moment.</div>
        </div>
      </div>`;
  }

  const filled    = matchFilled(next);
  const remaining = matchRemaining(next);
  const isFull    = remaining <= 0;
  const uid       = App.currentUser?.id;
  const joined    = uid && next.playerIds.includes(uid);

  // Indique si plusieurs sessions existent ce jour
  const sessionsOnDay = DB.matches.filter(m => m.date === next.date).length;
  const sessionLabel  = sessionsOnDay > 1 ? ` · Session ${next.session}` : '';

  // Couleur du compteur selon la criticité
  const spotsColor = isFull ? '#fca5a5' : remaining <= 4 ? '#fcd34d' : '#fff';

  // Bouton d'action pour les joueurs (non affiché pour les admins)
  let ctaBtn = '';
  if (App.currentUser && !App.currentUser.isAdmin) {
    if (joined) {
      ctaBtn = `
        <button class="btn"
          style="background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.35);color:#fff;font-weight:600"
          onclick="App.toggleJoin(${next.id})">
          ${icon('check')} Inscrit — Cliquer pour se désinscrire
        </button>`;
    } else if (isFull) {
      ctaBtn = `
        <button class="btn" disabled
          style="background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);color:rgba(255,255,255,.6)">
          Match complet
        </button>`;
    } else {
      ctaBtn = `
        <button class="btn btn-primary"
          style="background:#fff;color:var(--green-dark);border-color:#fff;font-weight:600"
          onclick="App.toggleJoin(${next.id})">
          S'inscrire maintenant
        </button>`;
    }
  }

  return `
    <div class="hero">
      <div class="hero-inner">
        <div class="hero-label">⚽ Prochain match${sessionLabel}</div>
        <div class="hero-title">${fmtDateLong(next.date)}</div>
        <div class="hero-meta">
          <div class="hero-meta-item">${icon('clock')} ${next.time}</div>
          <div class="hero-meta-item">${icon('pin')} ${escHtml(next.lieu)}</div>
        </div>

        <!-- Compteur de places -->
        <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap">
          <div class="hero-spots">
            <div>
              <div class="hero-spots-num" style="color:${spotsColor}">
                ${isFull ? '0' : remaining}
              </div>
              <div class="hero-spots-lbl">
                place${remaining !== 1 ? 's' : ''} disponible${remaining !== 1 ? 's' : ''}
              </div>
            </div>
            <div class="hero-spots-divider"></div>
            <div>
              <div class="hero-spots-num">${filled}</div>
              <div class="hero-spots-lbl">inscrit${filled !== 1 ? 's' : ''} / ${CONFIG.MAX_PLAYERS}</div>
            </div>
          </div>

          ${next.description
            ? `<div style="font-size:13px;opacity:.85;max-width:300px">${escHtml(next.description)}</div>`
            : ''}
        </div>

        ${ctaBtn ? `<div class="hero-cta">${ctaBtn}</div>` : ''}
      </div>
    </div>`;
}
