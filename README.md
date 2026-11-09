# App-solaire

Application de calcul de rendement solaire, réalisée dans le cadre de l'UCE *Processus du développement logiciel* (Master ILSEN, S1).

Le client, une entreprise qui installe des panneaux photovoltaïques, veut proposer à ses clients une application pour suivre la production de leurs panneaux, leur consommation, leurs économies et le délai de rentabilité de leur installation.

## État du projet

Sprint 3 en cours, à partir du 09/11/2026. Le front et l'api sont sur le repertoire.

## Équipe

| Membre | Rôle |
|---|---|
| Sheinez | API de données photovoltaïques |
| Malikath | Application et back-end |
| Dédé | Application et front-end |
| Téo | Tests et documentation, Scrum Master |

Le Product Owner est l'enseignant.

## Technologies

- **Application :** React Native
- **Back-end et API :** Spring Boot
- **Services externes :** Open-Meteo et PVGIS

Les choix sont justifiés dans les [ADR](Doc/ArchitectureDecisionRecords/ADR-App-solaire.md).

## Suivi du projet

- [Backlog et sprints (GitHub Projects)](https://github.com/users/K-dkh/projects/3)
- [Tickets](https://github.com/K-dkh/App-solaire/issues)
- [Maquette (Figma)](https://www.figma.com/make/kqCy3LOk10zmk5JiGHlrFv/Portfolio-slideshow?t=ZQgTTKLCpxXcikmn-1)

## Documentation

| Document | Contenu |
|---|---|
| [Cahier des charges](Doc/CahierDesCharges/cahier-des-charges.md) | Besoins, contraintes et périmètre |
| [Liste des fonctionnalités](Doc/CahierDesCharges/liste-fonctionnalites.md) | Fonctionnalités, priorités et estimations |
| [Architecture Decision Records](Doc/ArchitectureDecisionRecords/ADR-App-solaire.md) | Décisions techniques et leur justification |
| [Stratégie de test](Doc/Tests/strategie-de-test.md) | Niveaux de test, outils et Definition of Done |
| [Plan de test du Sprint 1](Doc/Tests/plan-de-test-sprint-1.md) | Cas de test et valeurs de référence |

### Comptes rendus de réunion

1. [17/09/2026 : lancement avec le Product Owner](Doc/CompteRenduReunion/compte-rendu-2026-09-17.md)
2. [05/10/2026 : Sprint 0, cadrage](Doc/CompteRenduReunion/compte-rendu-2026-10-05.md)
3. [13/10/2026 : réunion avec le Product Owner](Doc/CompteRenduReunion/compte-rendu-2026-10-13.md)
4. [06/11/2026 : réunion avec le Product Owner](Doc/CompteRenduReunion/compte-rendu-2026-11-06.md)

## Organisation du dépôt

- `main` contient la version stable, utilisée pour les démos.
- `Front`, `api` et `back` sont les branches de travail. Elles sont fusionnées dans `main` par pull request.
- Les commentaires de code et les messages de commit sont en anglais.

Les tests automatiques sont lancés par la chaine CI sur chaque pull request\commit.
