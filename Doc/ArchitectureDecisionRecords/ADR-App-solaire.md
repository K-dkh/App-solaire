# Architecture Decision Records : App-solaire

Un ADR (Architecture Decision Record) documente une décision importante : le contexte, le choix fait, les alternatives écartées et les conséquences. Statuts possibles : **Proposé**, **Accepté**, **Remplacé**.


---

## ADR-001 : React Native pour l'application 

- **Statut :** Accepté
- **Date :** 05/10/2026

**Contexte.** Le client veut une application mobile destinée à ses clients particuliers. La plateforme cible (Android, iOS ou les deux). L'équipe a une petite capacité de développement.

**Décision.** Développer l'application avec **React Native** (JavaScript/TypeScript).

**Justification.**
- Une seule base de code pour Android, iOS et le web, donc moins de travail qu'un développement natif double.
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

- **Statut :** Proposé, à réviser selon l'ADR-006 (la base ne contiendrait plus de données clients)
- **Date :** 13/10/2026

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

---

## ADR-006 : Données clients chiffrées sur l'appareil du client, API sans données clients

- **Statut :** Proposé par le PO et validé
- **Date :** 13/10/2026

**Contexte.** Le PO demande que les données des clients soient chiffrées avec une clé et que l'entreprise ne les gère pas, pour ne pas augmenter le coût pour les clients. Le plan présenté prévoyait des comptes et des installations stockés par l'API.

**Décision proposée.** Les données du client (profil, installations, consommation) sont stockées **localement sur son appareil** (téléphone ou navigateur), chiffrées avec une clé protégée par un code de l'utilisateur (et, sur le téléphone, par le coffre sécurisé). Une clé de récupération peut être proposée. Il n'y a pas de compte sur un serveur. L'API Spring **n'enregistre aucune donnée client** : elle calcule à partir des paramètres reçus, appelle Open-Meteo et PVGIS avec cache, et fournit les données simulées et le catalogue de panneaux.

**Justification.**
- Répond à la demande du PO : l'entreprise ne détient pas les données de ses clients.
- Aucun coût d'hébergement de données à répercuter sur les clients.
- Conformité RGPD simplifiée : une fuite côté API ne révèle aucune donnée de client.

**Alternatives écartées.**
- Comptes et données sur serveur, chiffrés par l'API (plan initial) : permet le multi-appareil, mais l'entreprise détient les données et la clé et doit les héberger. À reprendre si le PO accepte que l'API stocke des données chiffrées.
- Serveur avec chiffrement côté client : complexe, hébergement nécessaire, calculs côté API difficiles.

---

## ADR-007 : Open-Meteo et PVGIS, appelés uniquement par l'API de l'équipe

- **Statut :** Validé
- **Date :** 13/10/2026

**Contexte.** L'application a besoin de la météo, de l'ensoleillement et d'estimations de production selon le lieu, l'orientation et l'inclinaison.

**Décision proposée.** Utiliser **Open-Meteo** pour la météo actuelle, les prévisions à 7 jours et le rayonnement solaire, et **PVGIS** (Commission européenne) pour l'irradiation et la production estimées, avec historique, et pour vérifier les calculs de l'équipe. L'application ne parle qu'à l'API de l'équipe, qui appelle ces services et met leurs données en cache.

**Justification.**
- Les deux services sont gratuits pour ce projet (d'après le document des API : Open-Meteo à 10 000 appels par jour pour un usage non commercial, PVGIS limité à 30 appels par seconde) <!-- vérifier les conditions à jour -->.
- Les clés et les appels externes restent côté API : les données des clients ne transitent pas vers l'extérieur depuis l'appareil.
- Le cache permet d'afficher les dernières données si un service est indisponible.

**Alternatives écartées.**
- Saisie manuelle de la météo : moins fiable, moins agréable à utiliser.
- Appels directs depuis l'application : exposent davantage l'application et empêchent le cache partagé.

