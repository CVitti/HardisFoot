/* ════════════════════════════════════════════════════════
   utils/dom.js — Helpers DOM et calculs liés aux matchs
   ════════════════════════════════════════════════════════ */

/* ────────────────────────────────────────────────────────
   Sécurité HTML
   ──────────────────────────────────────────────────────── */

/**
 * Échappe les caractères spéciaux HTML pour éviter les
 * injections XSS lors de l'interpolation de chaînes utilisateur.
 * @param {string} str
 * @returns {string}
 */
function escHtml(str) {
  return (str || '').replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;');
}


/* ────────────────────────────────────────────────────────
   Calculs liés aux matchs
   ──────────────────────────────────────────────────────── */

/**
 * Retourne le nombre total d'inscrits (membres + invités externes).
 * @param {{ playerIds: number[], externalPlayers: object[] }} match
 * @returns {number}
 */
function matchFilled(match) {
  return match.playerIds.length + (match.externalPlayers || []).length;
}

/**
 * Retourne le nombre de places restantes.
 * @param {object} match
 * @returns {number}
 */
function matchRemaining(match) {
  return CONFIG.MAX_PLAYERS - matchFilled(match);
}

/**
 * Indique si un joueur peut encore s'inscrire.
 * Cette vérification doit AUSSI être faite côté serveur.
 * @param {object} match
 * @returns {boolean}
 */
function canJoin(match) {
  return matchFilled(match) < CONFIG.MAX_PLAYERS;
}

/**
 * Retourne le libellé et la classe CSS du pill "places disponibles".
 * @param {object} match
 * @returns {{ cls: string, text: string, ico: string }}
 */
function placesPillInfo(match) {
  const filled    = matchFilled(match);
  const remaining = matchRemaining(match);
  const pct       = Math.round(filled / CONFIG.MAX_PLAYERS * 100);
  const isPast    = isMatchPast(match);
  const isFull    = remaining <= 0;
  const isAlmost  = !isFull && pct >= CONFIG.ALMOST_FULL_THRESHOLD;

  if (isPast)    return { cls: 'past',   text: 'Passé',    ico: icon('warn') };
  if (isFull)    return { cls: 'full',   text: 'Complet',  ico: '' };
  if (isAlmost)  return { cls: 'almost', text: `${remaining} place${remaining > 1 ? 's' : ''}`, ico: icon('warn') };
  return           { cls: 'open',   text: `${remaining} place${remaining > 1 ? 's' : ''}`, ico: '' };
}

/**
 * Retourne la classe CSS de remplissage de la barre de progression.
 * @param {object} match
 * @returns {string}
 */
function progressFillClass(match) {
  const pct  = Math.round(matchFilled(match) / CONFIG.MAX_PLAYERS * 100);
  const full = matchFilled(match) >= CONFIG.MAX_PLAYERS;
  if (full) return 'full';
  if (pct >= CONFIG.ALMOST_FULL_THRESHOLD) return 'almost';
  return '';
}
