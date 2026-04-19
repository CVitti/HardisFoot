/* ════════════════════════════════════════════════════════
   components/modal.js — Système de modale générique
   Toutes les modales du site passent par ces fonctions.
   ════════════════════════════════════════════════════════ */

/**
 * Ouvre une modale avec le contenu HTML fourni.
 * Clique sur le fond = fermeture automatique.
 * @param {string}  html    Contenu HTML interne de la modale
 * @param {boolean} wide    Si true, utilise la variante large (.modal-box.wide)
 */
function openModal(html, wide = false) {
  const container = document.getElementById('modal-container');
  container.innerHTML = `
    <div class="modal-backdrop" id="modal-backdrop" onclick="handleBackdropClick(event)">
      <div class="modal-box${wide ? ' wide' : ''}">${html}</div>
    </div>`;
  document.body.style.overflow = 'hidden'; // Bloque le scroll de la page
}

/**
 * Ferme la modale ouverte et restaure le scroll.
 */
function closeModal() {
  document.getElementById('modal-container').innerHTML = '';
  document.body.style.overflow = '';
}

/**
 * Ferme la modale uniquement si le clic est sur le fond
 * (et non sur la boîte elle-même).
 * @param {MouseEvent} event
 */
function handleBackdropClick(event) {
  if (event.target.id === 'modal-backdrop') closeModal();
}
