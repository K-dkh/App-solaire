# Compte rendu de réunion n°1

- **Projet :** App-solaire, application de calcul de rendement solaire
- **UCE :** Processus du développement logiciel (Master ILSEN, S1)
- **Date :** 05/10/2026
- **Type :** Réunion de lancement avec le Product Owner
- **Participants :** Product Owner, équipe projet  
- **Rédacteur :** Theo

---

## 1. Cadre du TP

- Application de la méthode agile **Scrum** au travail de groupe.
- Choix libre du langage, du framework et des outils, **à justifier**.
- Commentaires dans le code et messages de commit **en anglais**.
- Documentation du projet, avec une réunion avec le Product Owner à chaque séance pour comprendre et analyser le besoin.
- Backlog Scrum visible par l'enseignant (GitHub Projects ou Trello).
- Rédaction d'un cahier des charges.

## 2. Contexte et besoin du client

Le client est une entreprise qui installe des panneaux photovoltaïques et les vend à des particuliers. Elle souhaite une **application mobile** permettant à ses clients de suivre leur consommation et le rendement de leurs panneaux. L'application doit servir de critère de vente supplémentaire.

**Enjeux :**

- **Pour l'entreprise :** un argument commercial en plus, donc davantage de ventes de panneaux.
- **Pour le client final :** suivre ses économies et savoir en combien de temps son investissement est rentabilisé.

## 3. Notion de rendement

Le rendement d'un panneau solaire correspond à la part de l'énergie lumineuse du soleil que le panneau convertit en électricité ou en chaleur. Il varie selon le type de panneau.

```
Rendement (%) = (Puissance crête en Wc / (Surface en m² × 1000)) × 100
```

Le facteur 1000 correspond à l'irradiance de référence de 1000 W/m² (conditions standard de test).
Exemple : un panneau de 400 Wc pour 1,9 m² a un rendement d'environ 21 %.

**Paramètres pris en compte par l'application :**

- Géolocalisation (lieu de l'installation)
- Orientation des panneaux (sud, est, ouest, nord)
- Type de panneau
- Données météo

## 4. Fonctionnalités identifiées

### Côté client

- Renseigner les informations de son installation.
- Consulter et saisir des données météo, qui influencent le rendement et les calculs.
- Suivre sa consommation et le rendement de ses panneaux.
- Visualiser sa production, ses économies et le délai de rentabilité de son installation.

### Côté entreprise

- Réaliser des calculs prévisionnels de production à partir de la météo.
- Adapter les calculs au type de panneau.

## 5. Architecture technique envisagée

- **Front :** application mobile destinée aux clients.
- **Back-end :** API fournissant des données photovoltaïques (simulées dans le cadre du projet).
- **Hébergement :** service cloud envisagé pour sécuriser les données clients, avec un coût supplémentaire à évaluer.

## 6. Contraintes

- Sécurité et protection des données clients, conformité à la réglementation (RGPD).
- Coût d'un éventuel service cloud.

## 7. Concurrence

- Hellio, guide solaire sur le rendement des panneaux : <https://particulier.hellio.com/guide-solaire/tag/rendement-dun-panneau-solaire>

## 8. Gestion de projet

- GitHub comme outil central : code, documentation, comptes rendus et collaboration au même endroit.
- Backlog et suivi Scrum sur **GitHub Projects**, accessible à l'enseignant pour qu'il ait une vision globale du projet.
- Dépôt : `K-dkh/App-solaire` (branches `main` et `develop`).

## 9. Points à clarifier avec le PO

- **Cloud :** quel prestataire, et qui prend en charge le coût ?
- **Météo :** données récupérées automatiquement via une API, saisies par l'utilisateur, ou les deux ?
- **Consommation :** d'où viennent les données (compteur, saisie manuelle, simulation) ?
- **Plateformes cibles :** Android, iOS ou les deux ?
- **Types de panneaux :** lesquels doivent être pris en charge ?

## 10. Prochaines étapes

- [ ] Choisir la stack technique (langage, framework, outils) et justifier les choix
- [ ] Créer le backlog sur GitHub Projects (user stories, priorités)
- [ ] Rédiger le cahier des charges
- [ ] Préparer les questions pour la prochaine réunion avec le PO
