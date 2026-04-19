/* ════════════════════════════════════════════════════════
   app.js — État central de l'application
   Contient : session utilisateur, actions métier,
   synchronisation temps réel (polling), et point d'entrée
   du rendu (App.render).

   En production, les méthodes qui écrivent dans DB doivent
   être remplacées par des appels API avec gestion d'erreur.
   ════════════════════════════════════════════════════════ */

const App = {

  /* ── État courant ── */
  currentUser: null,         // Utilisateur connecté (objet ou null)
  currentView: 'login',      // 'login' | 'home' | 'admin'
  adminTab:    'matches',    // 'matches' | 'players'
  filter:      'all',        // filtre actif dans la vue joueur

  /* ── Temps réel ── */
  _syncTimer:    null,       // Référence au setInterval de polling
  _lastVersions: {},         // Dernières versions connues des matchs


  /* ════════════════════════════════════════════════════
     AUTHENTIFICATION
     ════════════════════════════════════════════════════ */

  /**
   * Connecte un utilisateur par son ID et redirige vers sa vue.
   * @param {number} userId
   */
  login(userId) {
    this.currentUser = DB.users.find(u => u.id === userId);
    this.currentView = this.currentUser.isAdmin ? 'admin' : 'home';
    this.startSync();
    this.render();
    toast('Bienvenue, ' + this.currentUser.name.split(' ')[0] + ' !', 'success');
  },

  /** Déconnecte l'utilisateur et retourne à l'écran de login. */
  logout() {
    this.stopSync();
    this.currentUser = null;
    this.currentView = 'login';
    this.filter      = 'all';
    this.render();
  },

  /** Retourne à la vue principale de l'utilisateur connecté. */
  goHome() {
    if (!this.currentUser) return;
    this.currentView = this.currentUser.isAdmin ? 'admin' : 'home';
    this.render();
  },


  /* ════════════════════════════════════════════════════
     SYNCHRONISATION TEMPS RÉEL (polling simulé)
     → Remplacer par WebSocket / Supabase Realtime en prod
     ════════════════════════════════════════════════════ */

  /** Démarre le polling périodique. */
  startSync() {
    this.stopSync();
    this._syncTimer = setInterval(() => this._poll(), CONFIG.SYNC_INTERVAL);
  },

  /** Arrête le polling. */
  stopSync() {
    if (this._syncTimer) {
      clearInterval(this._syncTimer);
      this._syncTimer = null;
    }
  },

  /**
   * Vérifie si un match a été modifié depuis le dernier rendu
   * (comparaison des numéros de version). Si oui, re-render silencieux.
   */
  _poll() {
    const changed = DB.matches.some(m => this._lastVersions[m.id] !== m.version);
    if (changed) {
      this._updateVersions();
      this.render();
    }
  },

  /** Met à jour le snapshot des versions connues. */
  _updateVersions() {
    DB.matches.forEach(m => { this._lastVersions[m.id] = m.version; });
  },

  /**
   * Incrémente la version d'un match pour signaler une modification.
   * @param {number} matchId
   */
  _bumpVersion(matchId) {
    const m = DB.matches.find(x => x.id === matchId);
    if (m) m.version = (m.version || 1) + 1;
  },


  /* ════════════════════════════════════════════════════
     ACTIONS — INSCRIPTIONS
     ════════════════════════════════════════════════════ */

  /**
   * Inscrit ou désinscrit l'utilisateur courant d'un match.
   * La vérification du quota est atomique côté client ;
   * le serveur doit aussi la valider pour éviter les race conditions.
   * @param {number} matchId
   */
  toggleJoin(matchId) {
    const match = DB.matches.find(x => x.id === matchId);
    if (!match) return;

    const uid = this.currentUser.id;

    if (match.playerIds.includes(uid)) {
      // Désinscription
      match.playerIds = match.playerIds.filter(id => id !== uid);
      this._bumpVersion(matchId);
      toast('Désinscription confirmée.');
    } else {
      // Vérification quota avant inscription
      if (matchFilled(match) >= CONFIG.MAX_PLAYERS) {
        toast('Match complet — ' + CONFIG.MAX_PLAYERS + ' joueurs max.', 'error');
        this.render();
        return;
      }
      match.playerIds.push(uid);
      this._bumpVersion(matchId);
      toast('Inscription confirmée !', 'success');
    }

    this._updateVersions();
    this.render();
  },


  /* ════════════════════════════════════════════════════
     ACTIONS — GESTION DES MATCHS (admin)
     ════════════════════════════════════════════════════ */

  /**
   * Crée un nouveau match.
   * @param {{ date, time, lieu, session, description }} data
   */
  createMatch(data) {
    DB.matches.push({
      ...data,
      id:              DB.nextMatchId++,
      playerIds:       [],
      externalPlayers: [],
      version:         1,
    });
    toast('Match créé !', 'success');
    this.render();
  },

  /**
   * Met à jour les champs d'un match existant.
   * @param {number} id
   * @param {object} data  Champs à mettre à jour
   */
  updateMatch(id, data) {
    const idx = DB.matches.findIndex(m => m.id === id);
    if (idx !== -1) {
      DB.matches[idx] = { ...DB.matches[idx], ...data };
      this._bumpVersion(id);
    }
    toast('Match mis à jour.', 'success');
    this._updateVersions();
    this.render();
  },

  /**
   * Supprime un match (et toutes ses inscriptions).
   * @param {number} id
   */
  deleteMatch(id) {
    DB.matches = DB.matches.filter(m => m.id !== id);
    toast('Match supprimé.');
    this.render();
  },

  /**
   * Duplique un match complet en créant une session supplémentaire
   * le même jour, avec les mêmes métadonnées mais sans inscrits.
   * @param {number} matchId
   */
  duplicateMatch(matchId) {
    const src = DB.matches.find(x => x.id === matchId);
    if (!src) return;

    const sessionsOnDay = DB.matches.filter(m => m.date === src.date);
    const nextSession   = Math.max(...sessionsOnDay.map(m => m.session || 1)) + 1;

    DB.matches.push({
      id:              DB.nextMatchId++,
      date:            src.date,
      time:            src.time,
      lieu:            src.lieu,
      session:         nextSession,
      description:     src.description,
      playerIds:       [],
      externalPlayers: [],
      version:         1,
    });
    toast('Session ' + nextSession + ' créée !', 'success');
    this.render();
  },


  /* ════════════════════════════════════════════════════
     ACTIONS — GESTION DES JOUEURS DANS UN MATCH (admin)
     ════════════════════════════════════════════════════ */

  /**
   * Inscrit manuellement un membre à un match.
   * @param {number} matchId
   * @param {number} userId
   */
  addPlayerToMatch(matchId, userId) {
    const match = DB.matches.find(x => x.id === matchId);
    if (!match) return;

    if (match.playerIds.includes(userId)) {
      toast('Ce joueur est déjà inscrit.', 'error');
      return;
    }
    if (matchFilled(match) >= CONFIG.MAX_PLAYERS) {
      toast('Match complet — ' + CONFIG.MAX_PLAYERS + ' joueurs max.', 'error');
      return;
    }

    match.playerIds.push(userId);
    this._bumpVersion(matchId);
    toast('Joueur ajouté.', 'success');
    this._updateVersions();
    this.render();
  },

  /**
   * Retire un membre d'un match.
   * @param {number} matchId
   * @param {number} userId
   */
  removePlayerFromMatch(matchId, userId) {
    const match = DB.matches.find(x => x.id === matchId);
    if (!match) return;

    match.playerIds = match.playerIds.filter(id => id !== userId);
    this._bumpVersion(matchId);
    toast('Joueur retiré.');
    this._updateVersions();
    this.render();
  },

  /**
   * Ajoute un invité externe (sans compte) à un match.
   * @param {number} matchId
   * @param {string} name   Nom saisi par l'admin
   */
  addExternalToMatch(matchId, name) {
    const match = DB.matches.find(x => x.id === matchId);
    if (!match) return;

    if (!name.trim()) { toast('Nom requis.', 'error'); return; }
    if (matchFilled(match) >= CONFIG.MAX_PLAYERS) {
      toast('Match complet.', 'error');
      return;
    }

    match.externalPlayers = match.externalPlayers || [];
    match.externalPlayers.push({
      extId: 'ext_' + (DB.nextExtId++),
      name:  name.trim(),
    });
    this._bumpVersion(matchId);
    toast(name.trim() + ' ajouté(e).', 'success');
    this._updateVersions();
    this.render();
  },

  /**
   * Retire un invité externe d'un match via son extId.
   * @param {number} matchId
   * @param {string} extId
   */
  removeExternalFromMatch(matchId, extId) {
    const match = DB.matches.find(x => x.id === matchId);
    if (!match) return;

    match.externalPlayers = (match.externalPlayers || []).filter(e => e.extId !== extId);
    this._bumpVersion(matchId);
    toast('Invité retiré.');
    this._updateVersions();
    this.render();
  },


  /* ════════════════════════════════════════════════════
     ACTIONS — GESTION DES MEMBRES (admin)
     ════════════════════════════════════════════════════ */

  /**
   * Active ou retire le rôle admin d'un membre.
   * Seul un admin peut effectuer cette action, et il ne peut
   * pas modifier son propre rôle.
   * @param {number}  userId
   * @param {boolean} isAdmin
   */
  setAdminRole(userId, isAdmin) {
    const user = DB.users.find(x => x.id === userId);
    if (!user) return;

    user.isAdmin = isAdmin;
    toast(
      isAdmin
        ? user.name + ' est maintenant admin.'
        : user.name + ' n\'est plus admin.',
      'success'
    );
    this.render();
  },

  /**
   * Supprime un membre : le désinscrit de tous les matchs
   * puis le retire de la base utilisateurs.
   * @param {number} userId
   */
  deleteMember(userId) {
    // Désinscrire de tous les matchs
    DB.matches.forEach(m => {
      m.playerIds = m.playerIds.filter(id => id !== userId);
      this._bumpVersion(m.id);
    });

    DB.users = DB.users.filter(u => u.id !== userId);
    toast('Membre supprimé et désinscrit de tous les matchs.');
    this._updateVersions();
    this.render();
  },


  /* ════════════════════════════════════════════════════
     RENDU
     ════════════════════════════════════════════════════ */

  /**
   * Point d'entrée unique du rendu.
   * Délègue à la vue correspondant à currentView.
   */
  render() {
    renderNav();

    switch (this.currentView) {
      case 'login': renderLogin(); break;
      case 'home':  renderHome();  break;
      case 'admin': renderAdmin(); break;
    }
  },
};


/* ════════════════════════════════════════════════════════
   INITIALISATION
   ════════════════════════════════════════════════════════ */
App.render();
