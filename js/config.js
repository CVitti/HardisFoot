/* ════════════════════════════════════════════════════════
   config.js — Constantes de configuration globales
   Modifier ces valeurs pour adapter le site au club.
   ════════════════════════════════════════════════════════ */

const CONFIG = Object.freeze({
  /** Lieu par défaut de tous les matchs (modifiable ponctuellement par un admin) */
  LIEU_DEFAUT: 'Stade Joseph Guetat, Seyssinet-Pariset',

  /** Nombre maximum de joueurs par match (membres + invités externes) */
  MAX_PLAYERS: 18,

  /** Heure des matchs (format HH:MM) — chaque jeudi */
  MATCH_TIME: '12:15',

  /** Jour de la semaine des matchs (0 = dim, 4 = jeudi) */
  MATCH_DAY_OF_WEEK: 4,

  /** Intervalle de polling en ms pour simuler le temps réel */
  SYNC_INTERVAL: 3000,

  /** Seuil (en %) au-delà duquel le match est considéré "presque complet" */
  ALMOST_FULL_THRESHOLD: 70,
});
