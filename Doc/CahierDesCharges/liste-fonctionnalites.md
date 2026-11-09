# Liste des fonctionnalités : App-solaire

- **Version :** 0.6
- **Date :** 09/11/2026 (v0.5 du 05/10/2026)
- **Source :** [Cahier des charges](cahier-des-charges.md), section 4
- **Stack :** application mobile React Native, back-end Spring

> Chaque ligne est une fonctionnalité concrète de l'application, telle que l'utilisateur la voit. Elle indique l'exigence du cahier des charges qu'elle couvre et sa priorité MoSCoW (**M** = indispensable, **S** = important, **C** = souhaitable). Les éléments marqués **[À valider PO]** dépendent d'une réponse du Product Owner.
>
> **Estimation :** en **heures-homme**, réparties selon l'organisation de l'équipe, **avec une utilisation intensive des LLM** (génération de code, de tests et de documentation). La colonne « Sans LLM » rappelle l'estimation initiale. Ce sont des estimations à réviser en équipe (planning poker).
>
> **Gain retenu par rapport à l'estimation sans LLM :**
> - **API** (Sheinez) : −45 %. Le code d'intégration et de calcul se génère bien, mais les formules et les appels à l'API météo doivent être vérifiés à la main.
> - **Appli** (Malikath, Dédé) : −55 %. Écrans, formulaires et CRUD Spring sont très répétitifs, donc faciles à générer.
> - **Tests & doc** (Téo) : −60 %. Les tests unitaires et la documentation se génèrent très bien à partir du code.
>
> Ces heures **incluent la relecture et la correction** du code généré : chaque membre doit comprendre ce qu'il livre et pouvoir l'expliquer en démo. Valeurs arrondies à la demi-heure (minimum 0,5 h).

## Répartition de l'équipe

| Partie | Responsable(s) | Contenu |
|---|---|---|
| **API** | Sheinez | API de données photovoltaïques : météo et ensoleillement (API externe), données simulées de production et de consommation, calculs (rendement, production, économies, rentabilité). |
| **Appli** | Malikath, Dédé | Application React Native (écrans) et son back-end Spring (comptes, installations, appels à l'API). |
| **Tests & doc** | Téo | Tests (unitaires, intégration, recette), documentation technique et utilisateur. |

---

## Fonctionnalités

| ID | Fonctionnalité | Description | Exigence | Prio | API (h) | Appli (h) | Tests & doc (h) | Total (h) | Sans LLM (h) | **Révisé (h)** | **Sprint** |
|---|---|---|---|---|---|---|---|---|---|---|---|
| FCT-01 | Créer un compte | S'inscrire avec e-mail et mot de passe, et accepter les conditions d'utilisation (consentement RGPD). | F-01 | M | – | 4,5 | 1 | 5,5 | 13 | **1,5** | Sprint 4 |
| FCT-02 | Se connecter / se déconnecter | Se connecter avec ses identifiants et rester connecté entre deux ouvertures de l'app. | F-01 | M | – | 3,5 | 1 | 4,5 | 10 | **2** | Sprint 4 |
| FCT-03 | Réinitialiser son mot de passe | Recevoir un e-mail pour choisir un nouveau mot de passe. | F-01 | C | – | 3,5 | 1 | 4,5 | 10 | **1** | Backlog |
| FCT-04 | Modifier son profil | Consulter et modifier ses informations personnelles. | F-02 | S | – | 2,5 | 1 | 3,5 | 7 | **0,5** | Backlog |
| FCT-05 | Supprimer son compte | Supprimer son compte et toutes ses données (droit à l'effacement). | F-02 | S | – | 2,5 | 1 | 3,5 | 7 | **0,5** | Backlog |
| FCT-06 | Télécharger ses données | Exporter ses données personnelles (droit d'accès RGPD). | F-02 | C | – | 2,5 | 1 | 3,5 | 7 | **0,5** | Backlog |
| FCT-07 | Déclarer son installation | Saisir le nombre de panneaux, la puissance crête, la surface, l'orientation et l'inclinaison. | F-10 | M | – | 6,5 | 1,5 | 8 | 18 | **2** | Sprint 3 |
| FCT-08 | Localiser son installation | Indiquer l'emplacement par géolocalisation du téléphone ou par adresse. | F-10 | M | 1 | 2,5 | 1 | 4,5 | 9 | **1,5** | Sprint 3 (non terminée) |
| FCT-09 | Choisir son type de panneau | Sélectionner un type de panneau dans une liste (monocristallin, polycristallin, couche mince…) qui préremplit ses caractéristiques. | F-10 | S | 1,5 | 2 | 0,5 | 4 | 8 | **0,5** | Sprint 2 |
| FCT-10 | Renseigner les informations financières | Saisir le coût de l'installation et le prix du kWh acheté. | F-11 | M | – | 1,5 | 0,5 | 2 | 4 | **1** | Sprint 3 |
| FCT-11 | Renseigner son tarif de revente | Saisir le tarif de rachat du surplus d'électricité. **[À valider PO]** | F-11 | C | – | 1 | 0,5 | 1,5 | 3 | **0,5** | Backlog |
| FCT-12 | Consulter la fiche de son installation | Voir le récapitulatif de son installation. | F-10 | M | – | 2,5 | 1 | 3,5 | 7 | **0,5** | Sprint 3 |
| FCT-13 | Modifier son installation | Modifier les informations de son installation. | F-12 | S | – | 2,5 | 1 | 3,5 | 7 | **0,5** | Sprint 3 (non terminée) |
| FCT-14 | Gérer plusieurs installations | Ajouter plusieurs installations et passer de l'une à l'autre. **[À valider PO]** | F-13 | C | – | 3,5 | 1 | 4,5 | 10 | **1** | Backlog |
| FCT-15 | Consulter la météo et l'ensoleillement | Voir la météo et l'ensoleillement du jour et des prochains jours pour son installation (récupérés automatiquement, conservés en cache si le service météo est indisponible). **[À valider PO]** | F-20, F-21 | S | 5,5 | 2,5 | 1 | 9 | 19 | **1,5** | Backlog |
| FCT-16 | Saisir la météo manuellement | Saisir ou corriger des données météo à la main. **[À valider PO]** | F-22 | C | 1 | 2 | 0,5 | 3,5 | 7 | **0,5** | Backlog |
| FCT-17 | Voir le rendement de ses panneaux | Afficher le rendement (%) calculé à partir de la puissance crête et de la surface. | F-30 | M | 1 | 1 | 0,5 | 2,5 | 5 | **0,75** | Sprint 4 |
| FCT-18 | Voir sa production estimée | Afficher la production estimée en kWh par jour, par mois et par an. | F-31 | M | 5,5 | 2,5 | 1 | 9 | 18 | **1,5** | Sprint 4 |
| FCT-19 | Voir l'historique de production | Afficher la production passée (simulée) sous forme de graphiques, avec choix de la période. | F-31, F-32 | S | 3,5 | 4,5 | 1 | 9 | 18 | **1,5** | Backlog |
| FCT-20 | Voir la prévision de production | Afficher la production prévue pour les prochains jours d'après les prévisions météo. | F-33 | S | 2 | 2 | 1 | 5 | 10 | **1** | Backlog |
| FCT-21 | Suivre sa consommation | Afficher sa consommation électrique (simulée ou saisie). **[À valider PO]** | F-40 | M | 3,5 | 2,5 | 1 | 7 | 14 | **1,5** | Backlog |
| FCT-22 | Comparer production et consommation | Voir sur un même graphique ce que l'on produit et ce que l'on consomme. | F-40 | S | 1 | 2,5 | 1 | 4,5 | 10 | **1** | Backlog |
| FCT-23 | Voir ses économies | Afficher les économies réalisées (en €) sur une période. | F-41 | M | 2 | 1,5 | 1 | 4,5 | 9 | **1** | Sprint 4 |
| FCT-24 | Voir le délai de rentabilité | Afficher en combien de temps l'installation est rentabilisée. | F-42 | M | 1 | 1 | 0,5 | 2,5 | 5 | **0,5** | Sprint 4 |
| FCT-25 | Consulter le tableau de bord | Écran d'accueil récapitulatif : production, consommation, économies, rentabilité. | F-43 | S | – | 5,5 | 1 | 6,5 | 14 | **1** | Sprint 4 |
| FCT-26 | Simuler une installation pour un prospect | Un conseiller saisit une installation fictive et obtient la production et la rentabilité prévues. **[À valider PO]** | F-50 | S | 1 | 4,5 | 1 | 6,5 | 14 | **1,5** | Backlog |
| FCT-27 | Gérer le catalogue de panneaux | Un administrateur ajoute, modifie ou supprime des types de panneaux et leurs caractéristiques. **[À valider PO]** | F-51 | C | 1 | 4,5 | 1 | 6,5 | 14 | **1** | Backlog |
| FCT-28 | Gérer les accès par rôle | Distinguer les comptes client, conseiller et administrateur, avec des droits différents. **[À valider PO]** | F-50, F-51 | S | – | 3,5 | 1 | 4,5 | 10 | **1** | Backlog |
| | | | | **Total** | **30,5** | **81** | **25,5** | **137** | **287** | **28,75** | |

## Révision du 09/11/2026 : capacité réelle

Le sujet du TP prévoit **une séance de TP par sprint**. Le projet tient en **15 h par personne** (compte rendu n°2), soit 5 séances de 3 h : lancement (17/09), Sprint 0 de cadrage (05/10), puis **Sprint 1 (13/10), Sprint 2 (06/11), Sprint 3 (09/11) et Sprint 4 (sprint final)**. Chaque sprint offre **12 h**, soit 48 h pour les 4 sprints. L'estimation v0.5 (137 h, dont 53,5 h pour le MVP) dépassait donc 4 fois la capacité.

Le Sprint 2 a montré qu'avec un usage intensif de l'IA, une fonctionnalité de l'application prend de 0,5 à 2 h, relecture comprise. Toutes les fonctionnalités ont été ré-estimées sur cette base (colonne **Révisé**). La colonne **Sprint** indique le sprint où la fonctionnalité a été réalisée, ou celui où elle est prévue. « Backlog » signifie qu'elle n'a pas pu entrer dans les 4 sprints : elle fait partie des perspectives de la présentation finale. Les colonnes de la v0.5 sont conservées pour garder l'historique.

| | Heures |
|---|---:|
| Fonctionnalités (28) | 28,75 h |
| Pilotage du projet, tâches techniques et anomalies (tickets SP, S0, S4 et bugs) | 31,25 h |
| **Total du backlog** | **60 h** |
| Passé sur les 3 sprints (au 09/11) | 33 h |

| Priorité | Nb | Révisé (h) |
|---|---|---:|
| M | 11 | 13,75 |
| S | 11 | 10,5 |
| C | 6 | 4,5 |

FCT-01 et FCT-02 (comptes) entrent dans le Sprint 4 : le PO a demandé une page de connexion sécurisée le 09/11 (compte rendu n°5). L'ADR-006 (données uniquement sur l'appareil, sans compte serveur) doit donc être révisée.

Le suivi détaillé (heures passées par sprint, budget à 40 €/h, vues par sprint) est dans le [Project « Scrum »](https://github.com/users/K-dkh/projects/3).

---

## Proposition de MVP (v0.5)

Version minimale à viser pour les premiers sprints, avec uniquement les fonctionnalités **M** (**53,5 h**, contre 112 h sans LLM) :

- FCT-01, FCT-02 : créer un compte, se connecter
- FCT-07, FCT-08, FCT-10, FCT-12 : déclarer, localiser et consulter son installation, avec ses informations financières
- FCT-17, FCT-18 : voir le rendement et la production estimée
- FCT-21, FCT-23, FCT-24 : suivre sa consommation, voir ses économies et le délai de rentabilité

Les calculs côté API (FCT-17, FCT-18, FCT-23, FCT-24) peuvent être développés et testés avant que les écrans soient prêts. C'est un bon candidat pour le Sprint 1, avec une démo possible au PO dès la séance suivante.

---

## Récapitulatif (v0.5)

### Charge par priorité

| Priorité | Nb | API (h) | Appli (h) | Tests & doc (h) | Total (h) | Sans LLM (h) |
|---|---|---|---|---|---|---|
| M | 11 | 14 | 29,5 | 10 | 53,5 | 112 |
| S | 11 | 14,5 | 34,5 | 10,5 | 59,5 | 124 |
| C | 6 | 2 | 17 | 5 | 24 | 51 |
| **Total** | **28** | **30,5** | **81** | **25,5** | **137** | **287** |

Gain global : **150 h**, soit environ **−52 %**.

### Charge par personne

| Personne | Partie | Charge (h) | Sans LLM (h) |
|---|---|---|---|
| Sheinez | API | 30,5 | 57 |
| Malikath | Appli | ≈ 40,5 (moitié de 81) | ≈ 87,5 |
| Dédé | Appli | ≈ 40,5 (moitié de 81) | ≈ 87,5 |
| Téo | Tests & doc | 25,5 (hors documentation Scrum : comptes rendus, backlog, cahier des charges) | 55 |
