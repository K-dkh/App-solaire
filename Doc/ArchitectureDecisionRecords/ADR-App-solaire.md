# Architecture Decision Records : App-solaire

Un ADR (Architecture Decision Record) documente une décision importante : le contexte, le choix fait, les alternatives écartées et les conséquences. Statuts possibles : **Proposé**, **Accepté**, **Remplacé**.


---

## ADR-001 : React Native pour l'application mobile

- **Statut :** Accepté
- **Date :** 05/10/2026

**Contexte.** Le client veut une application mobile destinée à ses clients particuliers. La plateforme cible (Android, iOS ou les deux). L'équipe a une petite capacité de développement.

**Décision.** Développer l'application avec **React Native** (JavaScript/TypeScript).

**Justification.**
- Une seule base de code pour Android et iOS, donc moins de travail qu'un développement natif double.
- Écosystème React large : composants, bibliothèques de graphiques (utiles pour les courbes de production), nombreuses ressources.
- Itérations rapides en développement, adaptées à des sprints courts.

**Alternatives écartées.**
- Natif (Kotlin / Swift) : deux bases de code à maintenir, trop coûteux pour l'équipe.
- Flutter : pertinent, mais écarté au profit de React que l'équipe connaît. 
- Application web uniquement : ne correspond pas à la demande du client.


---

## ADR-002 : Spring Boot pour l'API REST

- **Statut :** Accepté
- **Date :** 05/10/2026

**Contexte.** L'application a besoin d'un back-end qui expose des données photovoltaïques (simulées dans le cadre du projet), gère les comptes, réalise les calculs (rendement, production, économies, rentabilité) et protège les données clients (RGPD).

**Décision.** Développer l'API avec **Spring Boot** (Java), exposée en **REST**.

**Justification.**
- Framework mature, avec Spring Security pour l'authentification et la protection des données.
- Spring Data simplifie l'accès à la base de données.
- Bonne testabilité (JUnit, MockMvc), utile pour les rapports de tests demandés.
- Les calculs métier peuvent être développés et testés côté API avant que les écrans mobiles soient prêts.

**Alternatives écartées.**
- Node.js / Express : plus léger, mais moins de structure imposée et moins d'outils de sécurité intégrés.
- Django : bon candidat, mais l'équipe vise Java. 


---

## ADR-003 : GitHub et GitHub Projects comme outil central

- **Statut :** Accepté
- **Date :** 05/10/2026

**Contexte.** Le sujet impose un backlog Scrum visible par l'enseignant (GitHub Projects ou Trello) et demande des livrables variés (code, documentation, comptes rendus, backlog).

**Décision.** Utiliser **GitHub** pour le code, la documentation et les comptes rendus, et **GitHub Projects** pour le backlog et le suivi des sprints.

**Justification.**
- Un seul outil regroupe tout le travail : le PO a une vision globale du projet.
- Les issues du board sont liées au code (commits, pull requests).
- Accès simple pour l'enseignant (collaborateur sur le dépôt).
- Gratuit.

**Alternatives écartées.**
- Trello : bon pour le backlog, mais séparé du code, donc un outil de plus à synchroniser.
- Jira : plus complet, mais trop lourd pour ce projet.

**Conséquences.** L'équipe dépend de GitHub. Les exports restent possibles dans des formats ouverts pour le rendu.

---

## ADR-004 : Stratégie de branches `main` / `develop`

- **Statut :** Accepté
- **Date :** 05/10/2026

**Contexte.** Quatre personnes travaillent en parallèle sur l'API, le mobile et la documentation.

**Décision.** `main` contient la version stable et démontrable ; `develop` sert d'intégration. Le travail se fait sur des branches par fonctionnalité fusionnées dans `develop`. Commentaires de code et messages de commit en **anglais**.

**Justification.**
- La démo au PO se fait toujours depuis une version stable (`main`).
- Les conflits sont limités en isolant chaque fonctionnalité.

**Alternatives écartées.** Travail direct sur `main` : risqué pour la démo.


---

## ADR-005 : Base de données relationnelle (PostgreSQL proposé)

- **Statut :** Proposé, à valider au sprint 1
- **Date :** 05/10/2026

**Contexte.** Le sprint 1 porte sur l'API et la base de données. Les données (utilisateurs, installations, production simulée, consommation) sont structurées et liées entre elles.

**Décision proposée.** Utiliser une base **relationnelle**, **PostgreSQL**.

**Justification.**
- Les données sont fortement relationnelles (utilisateur → installations → mesures).
- Bonne intégration avec Spring Data JPA.
- Compatible avec un hébergement cloud si le PO le demande.

**Alternatives.**
- MySQL / MariaDB : équivalent pour ce besoin.
- H2 en mémoire pour les tests et le développement local.
- Base NoSQL : peu justifiée ici.

