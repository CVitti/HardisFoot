/* ════════════════════════════════════════════════════════
   database.js — Données en mémoire (simulation backend)

   En production, remplacer les lectures/écritures dans DB
   par des appels fetch() à une API REST ou des abonnements
   temps réel (Supabase, Firebase, WebSocket…).

   Structure d'un match :
     { id, date, time, lieu, session, maxPlayers, description,
       playerIds[], externalPlayers[], version }

   maxPlayers : capacité propre à chaque match (défaut : CONFIG.MAX_PLAYERS).
   Utiliser matchMax(match) plutôt que CONFIG.MAX_PLAYERS dans le code.

   Structure d'un utilisateur :
     { id, name, email, avatar, isAdmin, external }
   ════════════════════════════════════════════════════════ */

/* Stocké sur window pour persister entre les re-renders
   (simule un état partagé entre "onglets") */
if (!window._DB) {
  window._DB = {

    /* ── Membres du club ── */
    users: [
      { id: 1, name: 'Jean Martin',   email: 'jean@example.com',   avatar: 'JM', isAdmin: false, external: false },
      { id: 2, name: 'Sophie Dupont', email: 'sophie@example.com', avatar: 'SD', isAdmin: false, external: false },
      { id: 3, name: 'Admin Club',    email: 'admin@example.com',  avatar: 'AC', isAdmin: true,  external: false },
      { id: 4, name: 'Lucas Bernard', email: 'lucas@example.com',  avatar: 'LB', isAdmin: false, external: false },
      { id: 5, name: 'Emma Petit',    email: 'emma@example.com',   avatar: 'EP', isAdmin: false, external: false },
      { id: 6, name: 'Karim Ndiaye',  email: 'karim@example.com',  avatar: 'KN', isAdmin: false, external: false },
      { id: 7, name: 'Marc Lebrun',   email: 'marc@example.com',   avatar: 'ML', isAdmin: true,  external: false },
    ],

    /* ── Matchs planifiés ── */
    matches: [
      {
        id: 1, date: '2026-04-10', time: '12:15',
        lieu: 'Stade Joseph Guetat, Seyssinet-Pariset',
        session: 1, maxPlayers: 18, description: 'Match régulier.',
        playerIds: [1, 2, 4], externalPlayers: [], version: 1,
      },
      {
        id: 2, date: '2026-04-17', time: '12:15',
        lieu: 'Stade Joseph Guetat, Seyssinet-Pariset',
        session: 1, maxPlayers: 18, description: '',
        playerIds: [1, 2, 4, 5, 6], externalPlayers: [], version: 1,
      },
      {
        id: 3, date: '2027-04-24', time: '12:15',
        lieu: 'Stade Joseph Guetat, Seyssinet-Pariset',
        session: 1, maxPlayers: 18, description: 'Tournoi interne, présence souhaitée.',
        playerIds: [5, 6], externalPlayers: [], version: 1,
      },
      {
        id: 4, date: '2025-05-01', time: '12:15',
        lieu: 'Stade Joseph Guetat, Seyssinet-Pariset',
        session: 1, maxPlayers: 18, description: '',
        playerIds: [], externalPlayers: [], version: 1,
      },
    ],

    /* ── Séquences d'IDs ── */
    nextMatchId: 5,
    nextUserId:  8,
    nextExtId:   1,
  };
}

/** Référence courante vers la base de données partagée */
const DB = window._DB;
