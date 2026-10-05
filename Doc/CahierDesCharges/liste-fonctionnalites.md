# Liste des fonctionnalités : App-solaire

- **Version :** 0.2 (ébauche)
- **Date :** 05/10/2026
- **Source :** [Cahier des charges](cahier-des-charges.md), section 4
- **Stack :** application mobile React Native, API REST Spring

> Les fonctionnalités sont regroupées par **epic** (grand domaine fonctionnel). Chaque ligne indique l'exigence du cahier des charges qu'elle couvre et sa priorité MoSCoW (**M** = indispensable, **S** = important, **C** = souhaitable). Les éléments marqués **[À valider PO]** dépendent d'une réponse du Product Owner.
>
> **Estimation :** charge en **jours-homme** (une personne pendant une journée), à la demi-journée près. Elle inclut le développement API et mobile, les tests et la revue de code. Ce sont des estimations initiales à réviser en équipe (planning poker).

---

## Epic 1 : Compte utilisateur

| ID | Fonctionnalité | Description | Exigence | Priorité | Estimation (j) |
|---|---|---|---|---|---|
| FCT-01 | Inscription | Créer un compte avec e-mail et mot de passe, et accepter les conditions d'utilisation (consentement RGPD). | F-01 | M | 2 |
| FCT-02 | Connexion / déconnexion | Se connecter avec ses identifiants et rester connecté entre deux ouvertures de l'app. | F-01 | M | 1,5 |
| FCT-03 | Mot de passe oublié | Réinitialiser son mot de passe par e-mail. | F-01 | C | 1,5 |
| FCT-04 | Gestion du profil | Consulter et modifier ses informations personnelles. | F-02 | S | 1 |
| FCT-05 | Suppression du compte | Supprimer son compte et toutes ses données (droit à l'effacement). | F-02 | S | 1 |
| FCT-06 | Export des données | Télécharger ses données personnelles (droit d'accès RGPD). | F-02 | C | 1 |
| | | | | **Total epic** | **8** |

## Epic 2 : Installation photovoltaïque

| ID | Fonctionnalité | Description | Exigence | Priorité | Estimation (j) |
|---|---|---|---|---|---|
| FCT-10 | Création d'une installation | Saisir la localisation (adresse ou géolocalisation), le nombre de panneaux, le type, la puissance crête, la surface, l'orientation et l'inclinaison. | F-10 | M | 2,5 |
| FCT-11 | Choix du type de panneau | Sélectionner un type de panneau dans une liste (monocristallin, polycristallin, couche mince…) qui préremplit ses caractéristiques. | F-10 | S | 1 |
| FCT-12 | Informations financières | Saisir le coût de l'installation et le prix du kWh acheté. | F-11 | M | 0,5 |
| FCT-13 | Tarif de rachat | Saisir le tarif de revente du surplus d'électricité. **[À valider PO]** | F-11 | C | 0,5 |
| FCT-14 | Fiche installation | Consulter le récapitulatif de son installation. | F-10 | M | 1 |
| FCT-15 | Modification d'une installation | Modifier les informations de son installation. | F-12 | S | 1 |
| FCT-16 | Plusieurs installations | Ajouter plusieurs installations et passer de l'une à l'autre. **[À valider PO]** | F-13 | C | 1,5 |
| | | | | **Total epic** | **8** |

## Epic 3 : Météo et ensoleillement

| ID | Fonctionnalité | Description | Exigence | Priorité | Estimation (j) |
|---|---|---|---|---|---|
| FCT-20 | Récupération automatique | L'API récupère l'ensoleillement et la météo pour la localisation de l'installation via une API externe (Open-Meteo, PVGIS). **[À valider PO]** | F-20 | M | 2 |
| FCT-21 | Mise en cache | Les dernières données météo sont conservées pour rester consultables si l'API externe est indisponible. | NF-06 | S | 1 |
| FCT-22 | Écran météo | Afficher la météo et l'ensoleillement du jour et des prochains jours. | F-21 | S | 1,5 |
| FCT-23 | Saisie manuelle | Saisir ou corriger des données météo à la main. **[À valider PO]** | F-22 | C | 1 |
| | | | | **Total epic** | **5,5** |

## Epic 4 : Production et rendement

| ID | Fonctionnalité | Description | Exigence | Priorité | Estimation (j) |
|---|---|---|---|---|---|
| FCT-30 | Calcul du rendement | Calculer et afficher le rendement des panneaux (%) à partir de la puissance crête et de la surface. | F-30 | M | 0,5 |
| FCT-31 | Production estimée | Calculer la production estimée en kWh par jour, par mois et par an. | F-31 | M | 2 |
| FCT-32 | Simulation de production | Générer un historique de production simulé pour l'installation. | F-31 | M | 1,5 |
| FCT-33 | Graphiques de production | Afficher la production sous forme de graphiques avec choix de la période (jour, mois, année). | F-32 | S | 2 |
| FCT-34 | Prévision de production | Afficher la production prévue pour les prochains jours d'après les prévisions météo. | F-33 | S | 1 |
| | | | | **Total epic** | **7** |

## Epic 5 : Consommation, économies et rentabilité

| ID | Fonctionnalité | Description | Exigence | Priorité | Estimation (j) |
|---|---|---|---|---|---|
| FCT-40 | Données de consommation | Obtenir la consommation électrique, simulée ou saisie par l'utilisateur. **[À valider PO]** | F-40 | M | 1,5 |
| FCT-41 | Suivi de consommation | Afficher la consommation et la comparer à la production. | F-40 | S | 1,5 |
| FCT-42 | Calcul des économies | Calculer les économies réalisées (en €) sur une période. | F-41 | M | 1 |
| FCT-43 | Délai de rentabilité | Calculer et afficher en combien de temps l'installation est rentabilisée. | F-42 | M | 0,5 |
| FCT-44 | Tableau de bord | Écran d'accueil récapitulatif : production, consommation, économies, rentabilité. | F-43 | S | 2 |
| | | | | **Total epic** | **6,5** |

## Epic 6 : Espace entreprise

| ID | Fonctionnalité | Description | Exigence | Priorité | Estimation (j) |
|---|---|---|---|---|---|
| FCT-50 | Simulation pour un prospect | Un conseiller saisit une installation fictive et obtient la production et la rentabilité prévues. **[À valider PO]** | F-50 | S | 2 |
| FCT-51 | Catalogue des panneaux | Un administrateur ajoute, modifie ou supprime des types de panneaux et leurs caractéristiques. **[À valider PO]** | F-51 | C | 2 |
| FCT-52 | Rôles utilisateurs | Distinguer les rôles client, conseiller et administrateur, avec des droits différents. **[À valider PO]** | F-50, F-51 | S | 1,5 |
| | | | | **Total epic** | **5,5** |

---

## Proposition de MVP

Version minimale à viser pour les premiers sprints, avec uniquement les fonctionnalités **M** (**16,5 jours**) :

1. **Compte :** inscription, connexion (FCT-01, FCT-02) : 3,5 j
2. **Installation :** création, informations financières, fiche (FCT-10, FCT-12, FCT-14) : 4 j
3. **Météo :** récupération automatique (FCT-20) : 2 j
4. **Production :** rendement, production estimée, simulation (FCT-30, FCT-31, FCT-32) : 4 j
5. **Rentabilité :** consommation, économies, délai de rentabilité (FCT-40, FCT-42, FCT-43) : 3 j

Les calculs (FCT-30, FCT-31, FCT-42, FCT-43) peuvent être développés et testés côté API avant que les écrans mobiles soient prêts. C'est un bon candidat pour le Sprint 1, avec une démo possible au PO dès la séance suivante.

---

## Récapitulatif

| Epic | M | S | C | Total | Estimation (j) |
|---|---|---|---|---|---|
| 1. Compte utilisateur | 2 | 2 | 2 | 6 | 8 |
| 2. Installation | 3 | 2 | 2 | 7 | 8 |
| 3. Météo | 1 | 2 | 1 | 4 | 5,5 |
| 4. Production et rendement | 3 | 2 | 0 | 5 | 7 |
| 5. Consommation et rentabilité | 3 | 2 | 0 | 5 | 6,5 |
| 6. Espace entreprise | 0 | 2 | 1 | 3 | 5,5 |
| **Total** | **12** | **12** | **6** | **30** | **40,5** |

**Charge par priorité :** M = 16,5 j · S = 16,5 j · C = 7,5 j
