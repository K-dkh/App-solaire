# Compte rendu de réunion n°4

- **Projet :** App-solaire, application de calcul de rendement solaire
- **UCE :** Processus du développement logiciel (Master ILSEN, S1)
- **Date :** 06/11/2026
- **Type :** Séance d'équipe **[À confirmer après 19h]**
- **Participants :** Sheinez, Malikath, Dédé, Téo
- **Rédacteur :** Téo

---

## 1. Suivi des actions du compte rendu n°3

État de ces actions à confirmer en équipe à la prochaine séance.

- [ ] Clarifier avec le PO si le client doit retrouver ses données sur plusieurs appareils (web et mobile)
- [ ] Vérifier que les écrans de la maquette validée restent cohérents avec la réponse du PO sur les données
- [ ] Valider l'ADR-006, réviser l'ADR-005 et mettre à jour les fonctionnalités FCT-01 à 14 et FCT-26 à 28
- [ ] Prévoir comment tester l'application sur iOS (Mac, ou Expo sur un iPhone)
- [ ] Mettre à jour l'ADR-001 (version web) et prévoir la déclinaison web de la maquette
- [ ] Préparer les questions pour la prochaine réunion avec le PO

## 2. Travail réalisé pendant la séance

L'équipe travaille sur le projet uniquement pendant les séances de TP.

### 2.1 Backlog et sprints

- Mise à jour de la [liste des fonctionnalités](../CahierDesCharges/liste-fonctionnalites.md) (v0.5).
- Création des 28 fonctionnalités sous forme de tickets GitHub (#5 à #32), avec user story, critères d'acceptation, priorité et estimation.
- Organisation du [Project « Scrum »](https://github.com/users/K-dkh/projects/3) : 28 tickets, 11 dans le Sprint 1 et 17 dans le backlog.

| Sprint | Début | Contenu |
|---|---|---|
| Sprint 1 | 06/11/2026 | 11 fonctionnalités indispensables (M), estimées à 53,5 h |
| Sprint 2 | 13/11/2026 | À planifier |
| Sprint 3 | 20/11/2026 | À planifier |

### 2.2 Dépôt

- Récupération sur `main` du contenu de `develop` : compte rendu n°3 et ADR ([PR #33](https://github.com/K-dkh/App-solaire/pull/33) et [PR #34](https://github.com/K-dkh/App-solaire/pull/34)).
- Abandon de la branche `develop`. Chacun travaille sur sa branche (`Front`, `api`, `back`) à partir de `main` (ADR-004 mis à jour).
- Suppression du dossier de comptes rendus en doublon.
- Ajout du lien de la maquette dans le compte rendu n°3.
- Mise à jour de `Front`, `api` et `back` à partir de `main`.
- Fermeture des tickets de test #1 à #4.
- Ajout du README et d'une première version de l'intégration continue (GitHub Actions).

### 2.3 Documentation

- Passage du [cahier des charges](../CahierDesCharges/cahier-des-charges.md) en v0.2, avec les réponses du compte rendu n°3.
- Correction du compte rendu n°3 : numéros de fonctionnalités et tableau de la section 3.
- Clarification du statut de l'ADR-006 : principe confirmé par le PO, stockage local encore à confirmer.

### 2.4 Tests

- Rédaction de la [stratégie de test](../Tests/strategie-de-test.md), avec une proposition de Definition of Done.
- Rédaction du [plan de test du Sprint 1](../Tests/plan-de-test-sprint-1.md) : 46 cas de test (15 unitaires, 11 d'intégration, 20 de recette), non exécutés tant que le code n'existe pas.

## 3. Échanges avec le PO

Aucun échange avec le PO pour le moment. **[À confirmer après 19h : ajouter ici les réponses du PO s'il y en a.]**

## 4. Décisions prises

- Abandon de `develop` au profit de `main` et des branches `Front`, `api` et `back` (ADR-004).
- Autres décisions éventuelles à confirmer en équipe à la prochaine séance.

## 5. Points à clarifier

| Point | Pourquoi | À voir avec |
|---|---|---|
| Comptes utilisateurs | FCT-01 et FCT-02 (Sprint 1) prévoient un compte serveur, alors que l'ADR-006 prévoit un stockage local sans compte. | Équipe, PO |
| Plusieurs appareils | La décision du compte rendu n°3 reste à prendre. | PO |
| Plafond de 15 h | Par personne ou pour toute l'équipe ? Le Sprint 1 est estimé à 53,5 h et l'équipe ne travaille que pendant les séances. | PO |
| Puissance crête | Saisie par panneau ou pour toute l'installation ? Le plan de test suppose par panneau. | Sheinez, Malikath, Dédé |
| Dossiers du code | L'intégration continue suppose `api/`, `back/` et `front/`, à confirmer. | Équipe |
| Accès de l'enseignant | Le Project « Scrum » est privé : l'enseignant doit pouvoir le consulter. | Dédé |

## 6. Prochaines étapes

- [ ] Donner à l'enseignant l'accès au Project « Scrum » (Dédé)
- [ ] Assigner les tickets du Sprint 1 (Tous)
- [ ] Valider la Definition of Done (Tous)
- [ ] Confirmer les noms des dossiers du code, puis les reporter dans l'intégration continue (Tous, Téo)
- [ ] Poser au PO les questions de la section 5 (Téo)
- [ ] Adapter le contenu du Sprint 1 selon les réponses du PO (Tous)