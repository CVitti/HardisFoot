/* ════════════════════════════════════════════════════════
   utils/dates.js — Fonctions utilitaires liées aux dates
   ════════════════════════════════════════════════════════ */

/**
 * Convertit une chaîne "YYYY-MM-DD" en objet Date (midi local,
 * pour éviter les décalages UTC).
 * @param {string} dateStr
 * @returns {Date}
 */
function toDateObj(dateStr) {
  return new Date(dateStr + 'T12:00:00');
}

/**
 * Indique si un match est passé (date+heure < maintenant).
 * @param {{ date: string, time: string }} match
 * @returns {boolean}
 */
function isMatchPast(match) {
  const [h, min] = match.time.split(':').map(Number);
  const d = new Date(match.date);
  d.setHours(h, min, 0, 0);
  return d < new Date();
}

/**
 * Formate une date au format long français.
 * Ex : "Jeudi 24 avril 2025"
 * @param {string} dateStr
 * @returns {string}
 */
function fmtDateLong(dateStr) {
  const d = toDateObj(dateStr);
  const s = d.toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Formate une date au format court français.
 * Ex : "jeu. 24 avr."
 * @param {string} dateStr
 * @returns {string}
 */
function fmtDateShort(dateStr) {
  return toDateObj(dateStr).toLocaleDateString('fr-FR', {
    weekday: 'short', day: 'numeric', month: 'short',
  });
}

/**
 * Retourne la date ISO (YYYY-MM-DD) du prochain jeudi disponible
 * (sans match de session 1 déjà planifié) à partir d'aujourd'hui.
 * @returns {string}
 */
function nextAvailableThursday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calcule combien de jours manquent avant le prochain jeudi
  const dayOfWeek = today.getDay();
  const daysUntil = (CONFIG.MATCH_DAY_OF_WEEK - dayOfWeek + 7) % 7 || 7;

  const d = new Date(today);
  d.setDate(d.getDate() + daysUntil);

  // Cherche un jeudi sans session 1 (max 52 semaines)
  for (let i = 0; i < 52; i++) {
    const dateStr = d.toISOString().split('T')[0];
    const hasSession1 = DB.matches.some(m => m.date === dateStr && m.session === 1);
    if (!hasSession1) return dateStr;
    d.setDate(d.getDate() + 7);
  }

  // Fallback : retourne quand même une date
  return d.toISOString().split('T')[0];
}
