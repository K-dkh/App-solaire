
# Compte rendu de réunion n°2
 
- **Projet :** App-solaire, application de calcul de rendement solaire
- **UCE :** Processus du développement logiciel (Master ILSEN, S1)
- **Date :** 05/10/2026 
- **Type :** Réunion avec le Product Owner
- **Participants :** Product Owner, équipe projet : Sheinez, Malikath, Dédé, Téo 
- **Rédacteur :** Dede
 
---
 
## 1. Suivi des actions du compte rendu n°2
 
- [x] Choisir la stack technique (langage, framework, outils) et justifier les choix
- [x] Créer le backlog sur GitHub Projects (user stories, priorités)
- [x] Rédiger le cahier des charges
- [x] Préparer les questions pour la prochaine réunion avec le PO
**Livrables associés :**
 
- Justification des choix : [ADR-App-solaire.md](ADR-App-solaire.md)
- Cahier des charges : [cahier-des-charges.md](cahier-des-charges.md)
- Liste des fonctionnalités (v0.3, 30 fonctionnalités, 283,5 h estimées) : liste-des-fonctionnalites.md
- Backlog : GitHub Projects <!-- lien du board à compléter -->
## 2. Décisions prises
 
| Sujet | Décision | Justification |
|---|---|---|
| Application mobile | React Native | ADR-001 |
| API | Spring Boot (REST) | ADR-002 |
| Outil de collaboration | GitHub (code, documentation, comptes rendus) et GitHub Projects (backlog, sprints) | ADR-003 |
| Branches | `main` (stable) et `develop` (intégration) | ADR-004 |
| Base de données | PostgreSQL proposé, à valider au sprint 1 | ADR-005 |
 
## 3. Organisation de l'équipe
 
| Membre | Responsabilité |
|---|---|
| Sheinez | API |
| Malikath, Dédé | Application mobile |
| Téo | Tests et documentation |
| <!-- à désigner --> | Scrum Master |
 
## 4. Budget
 
- Hypothèse retenue : **moyenne de 40 /h** <!-- unité et devise à confirmer avec le PO -->.
| Périmètre | Charge | Coût à 40 /h |
|---|---|---|
| MVP (fonctionnalités M) | 115,5 h | 4 620 |
| M + S | 231 h | 9 240 |
| Total (M + S + C) | 283,5 h | 11 340 |
 

## 5. Planification des sprints
 
| Sprint | Objectif | Statut |
|---|---|---|
| Sprint 0 | Gestion de projet, cahier des charges, backlog, technologie | Terminé |
| Sprint 1 | Développement de l'API et de la base de données | À venir |

 
**Piste notée pour le développement :** s'appuyer sur des API standard pour le simulateur de panneaux (PVGIS, Open-Meteo), après avoir vérifié qu'elles existent et conviennent. <!-- à confirmer -->
 
Chaque sprint sera organisé par fonctionnalité (cas d'usage) à partir de la liste des fonctionnalités.
 
## 6. Points restant à clarifier avec le PO
 
Ces points restent ouverts pour la prochaine réunion.
 
- **Cloud :** quel prestataire, et qui prend en charge le coût ?
- **Météo :** API externe automatique, saisie manuelle, ou les deux ? (FCT-20, FCT-23)
- **Consommation :** compteur, saisie manuelle ou simulation ? (FCT-40)
- **Types de panneaux** à prendre en charge ? (FCT-11, FCT-51)
- **Budget :** le taux de 40 /h est-il bien en euros par heure, et y a-t-il un plafond ?
## 7. Prochaines étapes
 
- [ ] Désigner le Scrum Master
- [ ] Planifier le sprint 1 : choisir les stories, les estimer, créer les issues dans GitHub Projects
- [ ] Faire valider par le PO les points ouverts de la section 6
- [ ] Valider ou changer le choix de la base de données (ADR-005)
- [ ] Vérifier que l'enseignant a accès au dépôt et au GitHub Projects
- [ ] Pousser sur le dépôt ce compte rendu et le fichier ADR