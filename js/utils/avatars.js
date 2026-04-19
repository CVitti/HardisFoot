/* ════════════════════════════════════════════════════════
   utils/avatars.js — Génération d'avatars et de piles
   d'avatars pour les membres et invités externes
   ════════════════════════════════════════════════════════ */

/** Palette de couleurs pour les avatars (fond, texte) */
const AV_COLORS = [
  ['#a3dfc0', '#127044'],
  ['#b5d4f4', '#0c447c'],
  ['#fac775', '#633806'],
  ['#f4c0d1', '#4b1528'],
  ['#c0dd97', '#173404'],
  ['#cecbf6', '#26215c'],
  ['#f5c4b3', '#4a1b0c'],
  ['#d3d1c7', '#3a3a38'],
  ['#ffe3b3', '#7a4e00'],
];

/**
 * Retourne la paire [couleur fond, couleur texte] pour un id donné.
 * @param {number} id
 * @returns {[string, string]}
 */
function avColor(id) {
  return AV_COLORS[Math.abs(id) % AV_COLORS.length];
}

/**
 * Génère le HTML d'un avatar (membre ou invité externe).
 * @param {{ id: number, avatar: string, external?: boolean }} user
 * @param {string} cls  Classe CSS de taille ('avatar-sm' | 'avatar-md')
 * @returns {string} HTML
 */
function avHTML(user, cls = 'avatar-sm') {
  if (user.external) {
    // Invités externes : couleur ambre fixe
    return `<div class="avatar ${cls}" style="background:#fdf0dc;color:#c97a10">${user.avatar || '?'}</div>`;
  }
  const [bg, fg] = avColor(user.id);
  return `<div class="avatar ${cls}" style="background:${bg};color:${fg}">${user.avatar}</div>`;
}

/**
 * Génère le HTML d'une pile d'avatars (membres + invités),
 * avec un "+N" si le nombre dépasse le maximum affiché.
 * @param {{ playerIds: number[], externalPlayers: object[] }} match
 * @param {number} max  Nombre maximum d'avatars visibles
 * @returns {string} HTML
 */
function avStackHTML(match, max = 5) {
  const members  = match.playerIds
    .map(id => DB.users.find(u => u.id === id))
    .filter(Boolean);

  const externals = (match.externalPlayers || []).map(e => ({
    ...e,
    external: true,
    avatar: (e.name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
  }));

  const all   = [...members, ...externals];
  const shown = all.slice(0, max);
  const total = all.length;

  let html = '<div class="av-stack">';
  shown.forEach(p => { html += avHTML(p, 'avatar-sm'); });
  if (total > max) {
    html += `<div class="avatar avatar-sm" style="background:var(--surface2);color:var(--txt3)">+${total - max}</div>`;
  }
  return html + '</div>';
}
