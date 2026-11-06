# Plan de test : Sprint 1

- **Projet :** App-solaire
- **Sprint :** Sprint 1 (à partir du 06/11/2026)
- **Version :** 0.1
- **Date :** 06/11/2026
- **Responsable :** Téo (Tests & doc)
- **Source :** critères d'acceptation des 11 tickets du Sprint 1, [liste des fonctionnalités v0.5](../CahierDesCharges/liste-fonctionnalites.md)
- **Exécution :** aucun cas n'a encore été exécuté, car le code n'existe pas encore

**Niveaux :** U = unitaire, I = intégration, R = recette manuelle (voir la [stratégie de test](strategie-de-test.md)).

---

## 1. Points à trancher avant d'implémenter les tests

| # | Point | Tickets | À voir avec |
|---|---|---|---|
| 1 | **Comptes :** ces tickets demandent un compte, et un mot de passe haché côté Spring, alors que l'ADR-006 prévoit un stockage local sans compte serveur. Les cas de FCT-01 et FCT-02 suivent les tickets actuels et seront à réécrire si les tickets changent. | FCT-01, FCT-02 | Équipe, PO |
| 2 | **Puissance crête :** la valeur saisie est-elle celle d'un panneau ou de toute l'installation ? Ce plan suppose qu'elle est **par panneau**, comme la surface. | FCT-07, FCT-17, FCT-18 | Sheinez, Malikath, Dédé |
| 3 | **Arrondis :** ce plan suppose une tolérance de ±0,01 sur les valeurs calculées. | FCT-17, FCT-18, FCT-23, FCT-24 | Sheinez |
| 4 | **Revente :** le tarif de rachat dépend de FCT-11, qui n'est pas dans le Sprint 1. Le cas TC-23-02 est donc conditionnel. | FCT-23 | PO |

## 2. Valeurs de référence pour les calculs

Ces données servent uniquement aux tests : ce ne sont ni des tarifs ni des mesures réels.

### Rendement (FCT-17)

`Rendement (%) = Puissance crête (Wc) / (Surface (m²) × 1000) × 100`

| Puissance crête (Wc) | Surface (m²) | Rendement attendu (%) |
|---|---:|---:|
| 400 | 1,9 | 21,05 |
| 300 | 1,6 | 18,75 |

### Production (FCT-18)

`Production (kWh) = Puissance installée (kWc) × Irradiation (kWh/m²) × Coefficient de performance`

Installation de test : 8 panneaux de 400 Wc, soit **3,2 kWc**.

| Période | Irradiation (kWh/m²) | Coefficient | Production attendue (kWh) |
|---|---:|---:|---:|
| Année | 1200 | 0,75 | 2880 |
| Année | 1200 | 0,80 | 3072 |
| Année | 1200 | 0,85 | 3264 |
| Mois | 100 | 0,80 | 256 |
| Jour | 3,5 | 0,80 | 8,96 |

### Économies (FCT-23)

`Économies (€) = Énergie autoconsommée (kWh) × Prix du kWh acheté + Énergie revendue (kWh) × Tarif de rachat`

| Autoconsommée (kWh) | Prix (€/kWh) | Revendue (kWh) | Tarif (€/kWh) | Économies attendues (€) |
|---:|---:|---:|---:|---:|
| 2000 | 0,25 | – | – | 500 |
| 2000 | 0,25 | 1000 | 0,10 | 600 |
| 0 | 0,25 | – | – | 0 |

### Délai de rentabilité (FCT-24)

`Délai (années) = Coût de l'installation (€) / Économies annuelles (€/an)`

| Coût (€) | Économies annuelles (€/an) | Délai attendu |
|---:|---:|---|
| 9000 | 600 | 15 ans |
| 9000 | 800 | 11 ans et 3 mois |
| 9000 | 0 | Pas d'erreur, message « non calculable » |

## 3. Cas de test

### FCT-01 : Créer un compte ([#5](https://github.com/K-dkh/App-solaire/issues/5))

| ID | Niveau | Scénario | Résultat attendu |
|---|---|---|---|
| TC-01-01 | R | Ouvrir le formulaire d'inscription | E-mail, mot de passe et confirmation sont demandés |
| TC-01-02 | R | S'inscrire avec des données valides et les conditions acceptées | Le compte est créé |
| TC-01-03 | R | S'inscrire sans accepter les conditions | Inscription refusée, avec un message clair |
| TC-01-04 | I | S'inscrire avec un e-mail déjà utilisé | Inscription refusée, avec un message clair |
| TC-01-05 | I | S'inscrire avec un mot de passe trop faible | Inscription refusée, avec un message clair |
| TC-01-06 | I | Consulter le mot de passe stocké après inscription | Il est haché, jamais en clair |

### FCT-02 : Se connecter / se déconnecter ([#6](https://github.com/K-dkh/App-solaire/issues/6))

| ID | Niveau | Scénario | Résultat attendu |
|---|---|---|---|
| TC-02-01 | I | Se connecter avec des identifiants valides | Connexion réussie |
| TC-02-02 | I | Se connecter avec un e-mail inconnu, puis avec un mauvais mot de passe | Même message générique dans les deux cas |
| TC-02-03 | R | Fermer puis rouvrir l'application une fois connecté | L'utilisateur reste connecté |
| TC-02-04 | R | Se déconnecter, puis rouvrir l'application | La session est supprimée et l'écran de connexion s'affiche |

### FCT-07 : Déclarer son installation ([#11](https://github.com/K-dkh/App-solaire/issues/11))

| ID | Niveau | Scénario | Résultat attendu |
|---|---|---|---|
| TC-07-01 | R | Ouvrir le formulaire | Nombre de panneaux, puissance crête (Wc), surface (m²), orientation et inclinaison (°) sont présents |
| TC-07-02 | U | Saisir une valeur nulle ou négative pour le nombre, la puissance ou la surface | Valeur refusée, avec un message clair |
| TC-07-03 | U | Saisir une inclinaison de 0° et de 90° | Valeurs acceptées |
| TC-07-04 | U | Saisir une inclinaison de -1° et de 91° | Valeurs refusées, avec un message clair |
| TC-07-05 | R | Enregistrer, fermer puis rouvrir l'application | L'installation est conservée et rattachée au bon utilisateur |

### FCT-08 : Localiser son installation ([#12](https://github.com/K-dkh/App-solaire/issues/12))

| ID | Niveau | Scénario | Résultat attendu |
|---|---|---|---|
| TC-08-01 | R | Toucher « Utiliser ma position » et accepter l'autorisation | La position du téléphone est récupérée |
| TC-08-02 | R | Toucher « Utiliser ma position » et refuser l'autorisation | Pas de plantage, la saisie d'une adresse reste possible |
| TC-08-03 | I | Saisir une adresse valide (service externe simulé) | L'adresse est convertie en latitude et longitude |
| TC-08-04 | I | Saisir une adresse introuvable (service externe simulé) | Message d'erreur clair, pas de coordonnées enregistrées |
| TC-08-05 | R | Enregistrer puis rouvrir l'installation | Les coordonnées sont conservées |

### FCT-10 : Renseigner les informations financières ([#14](https://github.com/K-dkh/App-solaire/issues/14))

| ID | Niveau | Scénario | Résultat attendu |
|---|---|---|---|
| TC-10-01 | R | Ouvrir le formulaire | Coût (€) et prix du kWh acheté (€/kWh) sont présents |
| TC-10-02 | U | Saisir une valeur négative | Valeur refusée, avec un message clair |
| TC-10-03 | R | Enregistrer, rouvrir, modifier puis enregistrer à nouveau | Les valeurs sont conservées, puis mises à jour |

### FCT-12 : Consulter la fiche de son installation ([#16](https://github.com/K-dkh/App-solaire/issues/16))

| ID | Niveau | Scénario | Résultat attendu |
|---|---|---|---|
| TC-12-01 | R | Ouvrir la fiche d'une installation complète | Les caractéristiques, la localisation et les informations financières s'affichent |
| TC-12-02 | R | Lire les valeurs affichées | Les unités sont explicites (Wc, m², °, €) |
| TC-12-03 | R | Toucher le bouton de modification | L'écran de modification s'ouvre |

### FCT-17 : Voir le rendement de ses panneaux ([#21](https://github.com/K-dkh/App-solaire/issues/21))

| ID | Niveau | Scénario | Résultat attendu |
|---|---|---|---|
| TC-17-01 | U | Calculer avec 400 Wc et 1,9 m² | 21,05 % |
| TC-17-02 | U | Calculer avec 300 Wc et 1,6 m² | 18,75 % |
| TC-17-03 | I | Appeler le calcul avec une surface nulle | Erreur claire, pas de division par zéro |
| TC-17-04 | R | Consulter le rendement dans l'application | La valeur s'affiche en % |

### FCT-18 : Voir sa production estimée ([#22](https://github.com/K-dkh/App-solaire/issues/22))

| ID | Niveau | Scénario | Résultat attendu |
|---|---|---|---|
| TC-18-01 | U | Calculer sur un an avec les coefficients 0,75, 0,80 et 0,85 | 2880, 3072 et 3264 kWh |
| TC-18-02 | U | Calculer sur un mois et sur un jour | 256 et 8,96 kWh |
| TC-18-03 | U | Utiliser un coefficient hors de l'intervalle 0,75 à 0,85 | Valeur refusée |
| TC-18-04 | I | Changer la localisation, l'orientation ou l'inclinaison (irradiation simulée) | Le résultat tient compte du changement |
| TC-18-05 | R | Consulter la production dans l'application | Les valeurs par jour, mois et an s'affichent en kWh |

### FCT-21 : Suivre sa consommation ([#25](https://github.com/K-dkh/App-solaire/issues/25))

| ID | Niveau | Scénario | Résultat attendu |
|---|---|---|---|
| TC-21-01 | I | Demander la consommation simulée sur une période | Une réponse couvre la période demandée, en kWh |
| TC-21-02 | I | Demander une période invalide (fin avant le début) | Erreur claire |
| TC-21-03 | R | Choisir une période dans l'application | La consommation de cette période s'affiche en kWh |

### FCT-23 : Voir ses économies ([#27](https://github.com/K-dkh/App-solaire/issues/27))

| ID | Niveau | Scénario | Résultat attendu |
|---|---|---|---|
| TC-23-01 | U | Calculer avec 2000 kWh autoconsommés à 0,25 €/kWh | 500 € |
| TC-23-02 | U | Ajouter 1000 kWh revendus à 0,10 €/kWh (si FCT-11 est validée) | 600 € |
| TC-23-03 | U | Calculer avec 0 kWh autoconsommé | 0 € |
| TC-23-04 | R | Choisir une période dans l'application | Les économies de cette période s'affichent en € |

### FCT-24 : Voir le délai de rentabilité ([#28](https://github.com/K-dkh/App-solaire/issues/28))

| ID | Niveau | Scénario | Résultat attendu |
|---|---|---|---|
| TC-24-01 | U | Calculer avec 9000 € et 600 €/an | 15 ans |
| TC-24-02 | U | Calculer avec 9000 € et 800 €/an | 11 ans et 3 mois |
| TC-24-03 | U | Calculer avec des économies nulles | Pas d'erreur, résultat « non calculable » |
| TC-24-04 | R | Consulter le délai dans l'application | La valeur s'affiche en années et en mois |
