/* ════════════════════════════════════════════════════════
   components/toast.js — Notifications éphémères (toasts)
   ════════════════════════════════════════════════════════ */

/** Durée d'affichage d'un toast en millisecondes */
const TOAST_DURATION = 3200;

/**
 * Affiche une notification éphémère en bas de l'écran.
 * @param {string} message  Texte à afficher
 * @param {string} type     'success' | 'error' | 'info' | '' (neutre)
 */
function toast(message, type = '') {
  const el = document.createElement('div');
  el.className = 'toast' + (type ? ' ' + type : '');
  el.textContent = message;

  document.getElementById('toasts').appendChild(el);
  setTimeout(() => el.remove(), TOAST_DURATION);
}
