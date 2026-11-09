# Compte rendu de réunion n°5

- **Projet :** App-solaire, application de calcul de rendement solaire
- **UCE :** Processus du développement logiciel (Master ILSEN, S1)
- **Date :** 09/11/2026
- **Type :** Séance de TP, fin du Sprint 3, démo au Product Owner
- **Participants :** Sheinez, Malikath, Dédé, Téo
- **Rédacteur :** Téo

---

## 1. Suivi des actions du compte rendu n°4

- [x] Assigner les tickets du Sprint 1 (Tous)
- [x] Confirmer les noms des dossiers du code : `front/` et `api/`. La CI ne lance pas encore les tests de l'API, qui utilise Gradle et pas Maven ([#45](https://github.com/K-dkh/App-solaire/issues/45)).
- [x] Adapter le contenu des sprints : replanification en section 2.4

## 2. Travail réalisé

### 2.1 Application (front)

- Navigation par onglets, écran d'accueil, saisie de l'installation en 3 étapes et fiche de l'installation, d'après la maquette validée ([PR #36](https://github.com/K-dkh/App-solaire/pull/36)).
- Installation enregistrée sur l'appareil, coordonnées arrondies à environ 1 km (RGPD). Rendement calculé sur l'appareil quand l'API ne répond pas.
- Dépendances `expo-font` et `expo-asset` ajoutées : sans elles, l'application risquait de planter en dehors d'Expo Go.

### 2.2 API

- Création d'une installation avec ses informations financières, validation des valeurs et calcul de l'investissement net ([PR #39](https://github.com/K-dkh/App-solaire/pull/39)) : FCT-07, FCT-08 et FCT-10.
- CORS autorisé pour la version web de l'application.

### 2.3 Tests

- 160 tests automatisés du front (Jest et React Native Testing Library), couverture d'environ 97 % ([PR #38](https://github.com/K-dkh/App-solaire/pull/38)).
- La CI lance le lint, la vérification TypeScript et les tests du front, avec un seuil de couverture minimal.
- Mise à jour de la [stratégie de test](../Tests/strategie-de-test.md) (v0.2) et du [plan de test](../Tests/plan-de-test-sprint-1.md) : cas exécutés et anomalies.
- 3 anomalies ouvertes : formulaire vide au rechargement ([#43](https://github.com/K-dkh/App-solaire/issues/43)), icônes lues par les lecteurs d'écran ([#44](https://github.com/K-dkh/App-solaire/issues/44)), tests de l'API non lancés par la CI ([#45](https://github.com/K-dkh/App-solaire/issues/45)).

### 2.4 Gestion de projet

- Le tableau a été comparé au code fusionné. Les statuts ont été corrigés : FCT-08 était fermé alors qu'une adresse n'est pas encore convertie en coordonnées.
- Les sprints ont été recalés sur les vraies séances : Sprint 1 le 13/10, Sprint 2 le 06/11, Sprint 3 le 09/11.
- Capacité : une séance de 3 h par sprint pour 4 personnes, soit 12 h par sprint.
- L'estimation v0.5 (137 h) dépassait cette capacité d'environ 4 fois. Toutes les fonctionnalités ont été ré-estimées avec l'IA (28 h) : [liste des fonctionnalités v0.6](../CahierDesCharges/liste-fonctionnalites.md).
- Suivi des heures et du budget dans le [Project « Scrum »](https://github.com/users/K-dkh/projects/3).
- Le pilotage du projet a ses propres tickets (préfixe `SP`).
- Une vue par sprint a été ajoutée au tableau et les vues inutiles ont été supprimées.

## 3. Échanges avec le PO

- **Démo du Sprint 3 :** le PO est satisfait.
- **Nouvelle demande :** ajouter une **page de connexion sécurisée**.
- **Suite du projet :** relier l'application à l'API, puis finaliser le projet au Sprint 4, qui est le sprint final.

## 4. Décisions prises

- **Sprint 4 = sprint final**, avec la démo finale et la rétrospective. Ce qui n'y entre pas restera en backlog et sera présenté comme perspectives.
- **Connexion sécurisée** : FCT-01 (créer un compte) et FCT-02 (se connecter) entrent dans le Sprint 4, avec les critères de sécurité ajoutés à [#6](https://github.com/K-dkh/App-solaire/issues/6) :
  - mots de passe hachés avec BCrypt ;
  - jeton JWT à durée limitée ;
  - message d'erreur générique ;
  - jeton gardé dans le coffre sécurisé du téléphone.
- **ADR-006 à réviser** : la connexion demandée par le PO suppose des comptes côté serveur, alors que l'ADR-006 prévoyait des données uniquement sur l'appareil.
- Les tickets non terminés et non prioritaires retournent dans le backlog : FCT-08 (adresse → coordonnées), FCT-13 (modification) et les anomalies #43 et #44.

## 5. Contenu du Sprint 4 (sprint final)

| Ticket | Contenu |
|---|---|
| [#5](https://github.com/K-dkh/App-solaire/issues/5) FCT-01 | Créer un compte (mot de passe haché, consentement RGPD) |
| [#6](https://github.com/K-dkh/App-solaire/issues/6) FCT-02 | Page de connexion sécurisée, déconnexion |
| [#50](https://github.com/K-dkh/App-solaire/issues/50) S4-01 | Relier le front à l'API : installations, calculs, jeton de connexion |
| [#21](https://github.com/K-dkh/App-solaire/issues/21), [#22](https://github.com/K-dkh/App-solaire/issues/22), [#27](https://github.com/K-dkh/App-solaire/issues/27), [#28](https://github.com/K-dkh/App-solaire/issues/28) | Calculs de l'API : rendement, production, économies, délai de rentabilité |
| [#29](https://github.com/K-dkh/App-solaire/issues/29) FCT-25 | Tableau de bord alimenté par l'API |
| [#45](https://github.com/K-dkh/App-solaire/issues/45) | Lancer les tests de l'API dans la CI |
| [#48](https://github.com/K-dkh/App-solaire/issues/48) | Présentation finale, rétrospective, rendu |
| [#51](https://github.com/K-dkh/App-solaire/issues/51) SP4 | Pilotage : démo au PO, compte rendu n°6, tableau, révision de l'ADR-006, export |

## 6. Points à clarifier

| Point | Pourquoi | À voir avec |
|---|---|---|
| Date du Sprint 4 | Le tableau place le Sprint 4 à partir du 10/11 en attendant la date de la séance. | PO |
| Données sur le serveur | Avec des comptes, les installations doivent-elles être enregistrées par l'API ou rester sur l'appareil ? Cette réponse décide de la révision de l'ADR-006. | PO, équipe |
| Plafond de 15 h | Fixé au compte rendu n°2. Avec un Sprint 4, chaque personne fait 18 h de séance. | PO |

## 7. Prochaines étapes

- [ ] Réviser l'ADR-006 après la décision sur les données
- [ ] Définir le contrat de l'API pour la connexion et les calculs
- [ ] Préparer la présentation finale et la rétrospective
