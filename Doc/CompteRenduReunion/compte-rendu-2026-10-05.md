# Compte rendu de réunion n°2

- **Projet :** App-solaire, application de calcul de rendement solaire
- **UCE :** Processus du développement logiciel (Master ILSEN, S1)
- **Date :** 05/10/2026
- **Type :** Réunion d'équipe, Sprint 0 (cadrage)
- **Participants :** Sheinez, Malikath, Dédé, Téo
- **Rédacteur :** Téo

---

## 1. Travail réalisé

- Rédaction d'une ébauche du **cahier des charges** (v0.1) : contexte, utilisateurs, notions métier, exigences fonctionnelles et non fonctionnelles, architecture, contraintes, questions ouvertes pour le PO.
  → [cahier-des-charges.md](../CahierDesCharges/cahier-des-charges.md)
- Rédaction de la **liste des fonctionnalités** : 28 fonctionnalités concrètes de l'application, priorisées (MoSCoW) et estimées en heures.
  → [liste-fonctionnalites.md](../CahierDesCharges/liste-fonctionnalites.md)
- Proposition d'une **version minimale (MVP)** : les 11 fonctionnalités indispensables (compte, installation, rendement, production, consommation, économies, délai de rentabilité).

## 2. Décisions prises

### 2.1 Choix techniques

| Élément | Choix |
|---|---|
| Application mobile | React Native |
| Back-end | Spring |
| Gestion de projet | GitHub (code, documentation) et GitHub Projects (backlog) |

La justification détaillée des choix reste à rédiger. --TODO

### 2.2 Répartition du travail

| Partie | Responsable(s) | Contenu |
|---|---|---|
| **API** | Sheinez | API de données photovoltaïques : météo, données simulées, calculs (rendement, production, économies, rentabilité). |
| **Appli (back et front)** | Malikath, Dédé | Écrans React Native et back-end Spring (comptes, installations, appels à l'API). |
| **Tests et doc** | Téo | Tests, documentation technique et utilisateur, documentation Scrum. |

## 3. Estimation des charges

- Première estimation sans LLM : **287 h**, puis **137 h** en tenant compte d'une utilisation intensive des LLM.
- **Constat :** c'est encore beaucoup trop. Le projet doit tenir dans le temps des séances de TP, soit **15 h maximum**.
- **Conséquence :** il faut reprendre les estimations en partant de ce plafond, réduire le périmètre en conséquence et le faire valider par le PO.
  - Si le plafond s'entend par personne (environ 60 h pour l'équipe), seul le MVP (53,5 h) tient dans le temps disponible.
  - S'il s'entend pour toute l'équipe, il faudra réduire encore le MVP.

## 4. Points à clarifier

- Le plafond de 15 h : par personne ou pour toute l'équipe ?
- Questions ouvertes du cahier des charges (section 10) à poser au PO : cloud, source des données météo et de consommation, types de panneaux, utilisateurs cibles, revente du surplus, multi-installations.

## 5. Prochaine réunion : début du développement

### 5.1 Ordre du jour

1. **Validation du cahier des charges par le PO** : présentation de l'ébauche, réponses aux questions ouvertes, validation du périmètre réduit (MVP).
2. **Découpage de la conception** en trois volets :
   - **API** (Sheinez) : endpoints, modèle de données, formules de calcul.
   - **Développement de l'appli** (Malikath, Dédé) : écrans, navigation, back-end Spring.
   - **Tests** (Téo) : stratégie de test, outils, Definition of Done.
3. **Lancement du Sprint 1** : choix des fonctionnalités, création des tickets sur GitHub Projects.

### 5.2 À préparer avant la réunion

- [ ] Reprendre les estimations avec utilisation des LLM pour tenir dans **15 h maximum** et ajuster le périmètre (Tous)
- [ ] Vérifier s'il existe des **API externes pertinentes** pour le projet (Sheinez). Pistes :
  - **PVGIS** (Commission européenne) : estimation de production photovoltaïque et ensoleillement selon la localisation, gratuite.
  - **Open-Meteo** : prévisions météo et rayonnement solaire, gratuite pour un usage non commercial.
  - **API Adresse** (data.gouv.fr) : conversion d'une adresse en coordonnées GPS, gratuite.
  - Pour chacune, vérifier : conditions d'utilisation, limites d'appels, données disponibles, format des réponses.
- [ ] Rédiger la justification des choix techniques (Malikath, Dédé)
- [ ] Mettre à jour le cahier des charges et la liste des fonctionnalités après la reprise des estimations (Téo)
- [ ] Préparer la présentation du cahier des charges pour le PO (Téo)
