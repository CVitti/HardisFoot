```
  ███╗   ███╗ █████╗ ████████╗ ██████╗██╗  ██╗    ██████╗  █████╗ ██╗   ██╗
  ████╗ ████║██╔══██╗╚══██╔══╝██╔════╝██║  ██║    ██╔══██╗██╔══██╗╚██╗ ██╔╝
  ██╔████╔██║███████║   ██║   ██║     ███████║    ██║  ██║███████║ ╚████╔╝
  ██║╚██╔╝██║██╔══██║   ██║   ██║     ██╔══██║    ██║  ██║██╔══██║  ╚██╔╝
  ██║ ╚═╝ ██║██║  ██║   ██║   ╚██████╗██║  ██║    ██████╔╝██║  ██║   ██║
  ╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝    ╚═════╝╚═╝  ╚═╝    ╚═════╝ ╚═╝  ╚═╝   ╚═╝
```
> ⚽ Inscription aux matchs de football du jeudi — simple, rapide, en temps réel.

---

## ◈ À PROPOS

**MatchDay** est un site web léger destiné aux membres d'un club de football amateur.
Il permet de consulter les matchs à venir, de s'inscrire en un clic, et donne aux
administrateurs un panneau complet pour organiser les sessions.

Pas de framework. Pas de build. Un seul `index.html` à ouvrir — c'est tout.

---

## ◈ FONCTIONNALITÉS

### Pour les joueurs
```
┌─────────────────────────────────────────────────────────┐
│  🟢  Connexion via compte Google                        │
│  👁  Bandeau "prochain match" avec compteur de places   │
│  ✅  Inscription / désinscription en un clic            │
│  🔄  Mise à jour en temps réel (polling toutes les 3s)  │
│  📋  Filtres : tous · places dispo · mes inscriptions   │
│  🕓  Matchs passés affichés séparément, en bas          │
└─────────────────────────────────────────────────────────┘
```

### Pour les admins
```
┌─────────────────────────────────────────────────────────┐
│  ➕  Créer un match (date auto → prochain jeudi libre)  │
│  ✏️   Modifier date, heure, lieu, description           │
│  🗑  Supprimer un match                                 │
│  👥  Gérer les joueurs inscrits par match               │
│  📋  Inscrire manuellement un membre                    │
│  🙋  Ajouter un invité externe (sans compte)            │
│  📄  Créer une 2e session si un match est complet       │
│  🛡  Accorder / retirer le rôle admin par toggle        │
│  🚫  Supprimer un membre (désinscrit de tous les matchs)│
└─────────────────────────────────────────────────────────┘
```

---

## ◈ RÈGLES MÉTIER

| Paramètre | Valeur |
|-----------|--------|
| 📅 Jour des matchs | **Jeudi** |
| 🕐 Heure | **12h15** |
| 👟 Lieu par défaut | **Stade Joseph Guetat, Seyssinet-Pariset** |
| 🪑 Joueurs max / match | **18** (membres + invités) |
| ⚠️ Seuil "presque complet" | **70 %** rempli |
| 🔄 Intervalle de sync | **3 secondes** |

> Tous ces paramètres sont centralisés dans `js/config.js` et modifiables en une ligne.

---

## ◈ CONNEXION (simulation)

La connexion Google est **simulée** côté client. En cliquant sur le bouton,
un sélecteur de profil apparaît avec les comptes définis dans `js/database.js`.

**En production**, remplacer `showAccountPicker()` dans `js/views/login.js`
par le flux OAuth 2.0 de Google Identity Services.

---

## ◈ TEMPS RÉEL

Le site simule la synchronisation entre utilisateurs via un **polling** toutes
les **3 secondes**. Chaque match porte un numéro de `version` qui s'incrémente
à chaque modification. Si un changement est détecté, la vue se rafraîchit
silencieusement.

```
Client A s'inscrit
  → match.version++
  → Client B poll (3s plus tard)
  → version différente détectée
  → re-render automatique ✓
```

**La vérification du quota (18 joueurs max) est effectuée avant chaque
inscription**, côté client. Le serveur devra aussi la valider pour éviter
les race conditions en production.

**En production**, remplacer le polling par :
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
- [Firebase Firestore](https://firebase.google.com/docs/firestore)
- WebSocket natif / Socket.io

---

## ◈ INTÉGRER UN VRAI BACKEND

Deux fichiers concentrent toute la logique de données :

**`js/database.js`** — Remplacer les tableaux statiques par des appels `fetch()`
```js
// Avant (simulation)
const DB = window._DB;

// Après (exemple avec une API REST)
async function getMatches() {
  const res = await fetch('/api/matches');
  return res.json();
}
```

**`js/app.js`** — Chaque méthode d'action (`createMatch`, `toggleJoin`…)
effectue aujourd'hui une mutation directe sur `DB`. Les remplacer par des
appels API asynchrones :
```js
// Avant
async toggleJoin(matchId) {
  match.playerIds.push(uid);   // mutation locale
}

// Après
async toggleJoin(matchId) {
  await fetch(`/api/matches/${matchId}/join`, { method: 'POST' });
  // Le polling (ou WebSocket) se chargera de mettre à jour la vue
}
```

---

## ◈ PERSONNALISATION

Tout se passe dans **`js/config.js`** :

```js
const CONFIG = Object.freeze({
  LIEU_DEFAUT:          'Stade Joseph Guetat, Seyssinet-Pariset',
  MAX_PLAYERS:          18,
  MATCH_TIME:           '12:15',
  MATCH_DAY_OF_WEEK:    4,      // 0 = dim, 1 = lun … 6 = sam
  SYNC_INTERVAL:        3000,   // ms
  ALMOST_FULL_THRESHOLD: 70,    // % de remplissage
});
```

Pour changer les couleurs, modifier les variables CSS dans **`css/tokens.css`**.

---

## ◈ STACK TECHNIQUE

```
Langage      HTML5 · CSS3 · JavaScript ES6+ (vanilla)
Fonts        Syne (titres) · DM Sans (corps) — Google Fonts
Icônes       SVG inline (js/utils/icons.js) — aucune dépendance externe
Auth         Google OAuth 2.0 (simulé — à intégrer en production)
Temps réel   Polling client (→ WebSocket / Supabase Realtime en prod)
Build        Aucun — fichiers statiques
```

---

## ◈ ROADMAP (suggestions)

```
[ ] Intégration Google OAuth réelle
[ ] Backend API (Node.js / Supabase / Firebase)
```