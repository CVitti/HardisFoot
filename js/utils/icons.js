/* ════════════════════════════════════════════════════════
   utils/icons.js — Bibliothèque d'icônes SVG inline
   Ajouter une entrée ici pour introduire une nouvelle icône.
   ════════════════════════════════════════════════════════ */

const ICONS = {
  pin: `<svg viewBox="0 0 16 16" fill="none">
    <path d="M8 1.5C5.5 1.5 3.5 3.5 3.5 6c0 3.5 4.5 8.5 4.5 8.5S12.5 9.5 12.5 6c0-2.5-2-4.5-4.5-4.5z"
          stroke="currentColor" stroke-width="1.2"/>
    <circle cx="8" cy="6" r="1.5" stroke="currentColor" stroke-width="1.2"/>
  </svg>`,

  clock: `<svg viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="5.5" stroke="currentColor" stroke-width="1.2"/>
    <path d="M8 5.5V8l2 1.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
  </svg>`,

  users: `<svg viewBox="0 0 16 16" fill="none">
    <circle cx="6" cy="5" r="2" stroke="currentColor" stroke-width="1.2"/>
    <path d="M2 13c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
    <circle cx="11.5" cy="5" r="1.5" stroke="currentColor" stroke-width="1.2"/>
    <path d="M14 13c0-1.7-1.1-3.1-2.5-3.7" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
  </svg>`,

  edit: `<svg viewBox="0 0 16 16" fill="none">
    <path d="M11 2l3 3-8 8H3v-3l8-8z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>
  </svg>`,

  trash: `<svg viewBox="0 0 16 16" fill="none">
    <path d="M3 5h10M6 5V3h4v2M13 5l-1 8H4L3 5"
          stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  plus: `<svg viewBox="0 0 16 16" fill="none">
    <path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,

  check: `<svg viewBox="0 0 16 16" fill="none">
    <path d="M3 8l4 4 6-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  shield: `<svg viewBox="0 0 16 16" fill="none">
    <path d="M8 2l5 2v3.5c0 3-2.2 5-5 6-2.8-1-5-3-5-6V4l5-2z"
          stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>
  </svg>`,

  copy: `<svg viewBox="0 0 16 16" fill="none">
    <rect x="5" y="5" width="8" height="9" rx="1.5" stroke="currentColor" stroke-width="1.2"/>
    <path d="M3 11V3.5A1.5 1.5 0 014.5 2H11" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
  </svg>`,

  user_x: `<svg viewBox="0 0 16 16" fill="none">
    <circle cx="6" cy="5" r="2" stroke="currentColor" stroke-width="1.2"/>
    <path d="M2 13c0-2.2 1.8-4 4-4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
    <path d="M11 9.5l3 3M14 9.5l-3 3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
  </svg>`,

  football: `<svg viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.4"/>
    <path d="M10 4l1.5 4.5H16l-3.5 2.5 1.2 4L10 12.5 6.3 15l1.2-4L4 8.5h4.5z"
          fill="currentColor" opacity=".35"/>
  </svg>`,

  warn: `<svg viewBox="0 0 16 16" fill="none">
    <path d="M8 2L14.5 13H1.5L8 2z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M8 6v3M8 11v.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
  </svg>`,

  person_add: `<svg viewBox="0 0 16 16" fill="none">
    <circle cx="6" cy="5" r="2" stroke="currentColor" stroke-width="1.2"/>
    <path d="M2 13c0-2.2 1.8-4 4-4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
    <path d="M12 9v4M10 11h4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
  </svg>`,
};

/**
 * Retourne le SVG inline d'une icône.
 * @param {string} name  Clé dans ICONS
 * @returns {string} SVG HTML ou chaîne vide si introuvable
 */
function icon(name) {
  return ICONS[name] || '';
}
