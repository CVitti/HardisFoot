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
   Capacité d'un match
   ──────────────────────────────────────────────────────── */

/**
 * Retourne le nombre maximum de joueurs pour un match donné.
 * Utilise match.maxPlayers s'il est défini, sinon la valeur
 * globale CONFIG.MAX_PLAYERS (18 par défaut).
 * @param {object} match
 * @returns {number}
 */
function matchMax(match) {
  return (match.maxPlayers && match.maxPlayers > 0)
    ? match.maxPlayers
    : CONFIG.MAX_PLAYERS;
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
 * Retourne le nombre de places restantes pour ce match.
 * @param {object} match
 * @returns {number}
 */
function matchRemaining(match) {
  return matchMax(match) - matchFilled(match);
}

/**
 * Indique si un joueur peut encore s'inscrire à ce match.
 * Cette vérification doit AUSSI être faite côté serveur.
 * @param {object} match
 * @returns {boolean}
 */
function canJoin(match) {
  return matchFilled(match) < matchMax(match);
}

/**
 * Retourne le libellé et la classe CSS du pill "places disponibles".
 * @param {object} match
 * @returns {{ cls: string, text: string, ico: string }}
 */
function placesPillInfo(match) {
  const max       = matchMax(match);
  const filled    = matchFilled(match);
  const remaining = max - filled;
  const pct       = Math.round(filled / max * 100);
  const isPast    = isMatchPast(match);
  const isFull    = remaining <= 0;
  const isAlmost  = !isFull && pct >= CONFIG.ALMOST_FULL_THRESHOLD;

  if (isPast)   return { cls: 'past',   text: 'Expiré' };
  if (isFull)   return { cls: 'full',   text: 'Complet' };
  if (isAlmost) return { cls: 'almost', text: `${remaining} place${remaining > 1 ? 's' : ''}`};
  return          { cls: 'open',   text: `${remaining} place${remaining > 1 ? 's' : ''}` };
}

/**
 * Retourne la classe CSS de remplissage de la barre de progression.
 * @param {object} match
 * @returns {string}
 */
function progressFillClass(match) {
  const max  = matchMax(match);
  const pct  = Math.round(matchFilled(match) / max * 100);
  const full = matchFilled(match) >= max;
  if (full) return 'full';
  if (pct >= CONFIG.ALMOST_FULL_THRESHOLD) return 'almost';
  return '';
}
