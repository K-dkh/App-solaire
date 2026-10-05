# Cahier des charges : App-solaire

- **Projet :** App-solaire, application de calcul de rendement solaire
- **UCE :** Processus du développement logiciel (Master ILSEN, S1)
- **Version :** 0.1 (ébauche)
- **Date :** 05/10/2026
- **Statut :** Brouillon, à valider avec le Product Owner
- **Auteurs :** _à compléter_

> Les éléments marqués **[À valider PO]** sont des hypothèses de l'équipe qui doivent être confirmées lors d'une prochaine réunion.

---

## 1. Présentation du projet

### 1.1 Contexte

Le client est une entreprise qui installe des panneaux photovoltaïques et les vend à des particuliers. Pour se démarquer de la concurrence, elle souhaite proposer à ses clients une **application mobile** leur permettant de suivre la production de leurs panneaux, leur consommation et les économies réalisées.

### 1.2 Objectifs

| Pour qui | Objectif |
|---|---|
| Entreprise | Disposer d'un argument commercial supplémentaire pour augmenter les ventes de panneaux. |
| Entreprise | Réaliser des calculs prévisionnels de production pour ses clients et prospects. |
| Client final | Suivre la production et le rendement de son installation. |
| Client final | Connaître ses économies et le délai de rentabilité de son investissement. |

### 1.3 Périmètre

Le projet couvre :

- une application mobile destinée aux clients particuliers ;
- une API back-end qui fournit et calcule les données photovoltaïques ;
- des données de production et de consommation **simulées** dans le cadre du projet.

Hors périmètre (voir section 8) : connexion à de vrais onduleurs ou compteurs, paiement, gestion commerciale de l'entreprise.

---

## 2. Utilisateurs cibles

| Profil | Description | Besoins principaux |
|---|---|---|
| **Client particulier** | Propriétaire d'une installation vendue par l'entreprise. Pas forcément à l'aise avec la technique. | Interface simple, chiffres compréhensibles (kWh, €, années). |
| **Prospect** **[À valider PO]** | Particulier qui envisage d'acheter des panneaux. | Simuler la production et la rentabilité avant achat. |
| **Entreprise (conseiller / administrateur)** **[À valider PO]** | Employé de l'entreprise. | Faire des estimations pour un client, gérer les types de panneaux disponibles. |

---

## 3. Notions métier

### 3.1 Rendement d'un panneau

Le rendement correspond à la part de l'énergie lumineuse reçue que le panneau convertit en électricité.

```
Rendement (%) = (Puissance crête en Wc / (Surface en m² × 1000)) × 100
```

Le facteur 1000 correspond à l'irradiance de référence de 1000 W/m² (conditions standard de test, STC).
Exemple : un panneau de 400 Wc pour 1,9 m² a un rendement d'environ 21 %.

### 3.2 Production estimée

Formule simplifiée envisagée **[À valider PO]** :

```
Production (kWh) = Puissance crête installée (kWc) × Irradiation (kWh/m²) × Coefficient de performance
```

- **Irradiation :** dépend de la localisation, de la période et de la météo.
- **Coefficient de performance** (≈ 0,75 à 0,85) : pertes liées à la température, à l'onduleur, aux câbles, à l'orientation et à l'inclinaison.

### 3.3 Économies et rentabilité

```
Économies (€)         = Énergie autoconsommée (kWh) × Prix du kWh acheté
                        + Énergie revendue (kWh) × Tarif de rachat
Délai de rentabilité  = Coût de l'installation (€) / Économies annuelles (€/an)
```

### 3.4 Paramètres influençant les calculs

- Localisation géographique de l'installation
- Orientation des panneaux (sud, est, ouest, nord) et inclinaison
- Type de panneau (monocristallin, polycristallin, couche mince…)
- Données météo (ensoleillement, couverture nuageuse, température)

---

## 4. Besoins fonctionnels

Priorités selon la méthode MoSCoW : **M** = Must (indispensable), **S** = Should (important), **C** = Could (souhaitable), **W** = Won't (pas pour cette version).

### 4.1 Compte utilisateur

| ID | Exigence | Priorité |
|---|---|---|
| F-01 | L'utilisateur peut créer un compte et se connecter. | M |
| F-02 | L'utilisateur peut modifier ou supprimer son compte et ses données (RGPD). | S |

### 4.2 Installation

| ID | Exigence | Priorité |
|---|---|---|
| F-10 | L'utilisateur peut renseigner son installation : localisation, nombre de panneaux, type de panneau, puissance crête, surface, orientation, inclinaison. | M |
| F-11 | L'utilisateur peut renseigner le coût de son installation et le prix de son électricité. | M |
| F-12 | L'utilisateur peut modifier les informations de son installation. | S |
| F-13 | L'utilisateur peut gérer plusieurs installations. **[À valider PO]** | C |

### 4.3 Météo

| ID | Exigence | Priorité |
|---|---|---|
| F-20 | L'application récupère automatiquement les données météo et d'ensoleillement pour la localisation de l'installation. **[À valider PO]** | M |
| F-21 | L'utilisateur peut consulter la météo et l'ensoleillement prévus. | S |
| F-22 | L'utilisateur peut saisir manuellement des données météo. **[À valider PO]** | C |

### 4.4 Production et rendement

| ID | Exigence | Priorité |
|---|---|---|
| F-30 | L'application calcule le rendement des panneaux à partir de leurs caractéristiques. | M |
| F-31 | L'application calcule une production estimée (jour, mois, année) à partir de l'installation et de la météo. | M |
| F-32 | L'utilisateur visualise sa production sous forme de graphiques. | S |
| F-33 | L'application affiche une prévision de production pour les prochains jours. | S |

### 4.5 Consommation, économies et rentabilité

| ID | Exigence | Priorité |
|---|---|---|
| F-40 | L'utilisateur peut suivre sa consommation électrique (données simulées ou saisies). **[À valider PO]** | M |
| F-41 | L'application calcule les économies réalisées. | M |
| F-42 | L'application calcule le délai de rentabilité de l'installation. | M |
| F-43 | L'utilisateur visualise un tableau de bord récapitulatif : production, consommation, économies, rentabilité. | S |

### 4.6 Côté entreprise

| ID | Exigence | Priorité |
|---|---|---|
| F-50 | Un conseiller peut réaliser une simulation de production prévisionnelle pour un prospect. **[À valider PO]** | S |
| F-51 | Un administrateur peut gérer le catalogue des types de panneaux (caractéristiques, rendement). **[À valider PO]** | C |

---

## 5. Besoins non fonctionnels

| ID | Catégorie | Exigence |
|---|---|---|
| NF-01 | Ergonomie | Interface simple, compréhensible par un utilisateur non technique, unités explicites (kWh, €, années). |
| NF-02 | Plateformes | Application disponible sur Android et iOS **[À valider PO]**. |
| NF-03 | Sécurité | Mots de passe hachés, communications chiffrées (HTTPS), accès aux données limité à leur propriétaire. |
| NF-04 | RGPD | Données personnelles minimales, consentement explicite, droit d'accès et de suppression. |
| NF-05 | Performance | Les calculs et l'affichage du tableau de bord prennent moins de 2 secondes. |
| NF-06 | Disponibilité | L'application reste consultable si l'API météo externe est indisponible (dernières données en cache). |
| NF-07 | Qualité | Code commenté en anglais, tests unitaires sur les calculs métier, intégration continue. |
| NF-08 | Maintenabilité | Architecture séparant front mobile, API et logique de calcul. |
| NF-09 | Langue | Interface en français. |

---

## 6. Architecture technique (envisagée)

```
┌──────────────────┐      HTTPS / REST      ┌──────────────────┐      ┌──────────────────────┐
│ Application      │ ─────────────────────► │ API back-end     │ ───► │ API météo externe    │
│ mobile (client)  │ ◄───────────────────── │ (calculs, données│      │ (ex. Open-Meteo,     │
└──────────────────┘                        │  simulées)       │      │  PVGIS)              │
                                            └────────┬─────────┘      └──────────────────────┘
                                                     │
                                            ┌────────▼─────────┐
                                            │ Base de données  │
                                            └──────────────────┘
```

- **Front :** application mobile multiplateforme (technologie _à choisir et justifier_).
- **Back-end :** API REST (technologie _à choisir et justifier_).
- **Données :** base de données pour les comptes et les installations. Production et consommation simulées.
- **Hébergement :** service cloud envisagé, prestataire et coût **[À valider PO]**.

Les choix techniques seront justifiés dans un document séparé.

---

## 7. Contraintes

- **Méthode :** Scrum, un sprint par séance de TP, avec une démo au PO à chaque séance.
- **Outils :** GitHub (code, documentation, comptes rendus) et GitHub Projects (backlog), accessibles à l'enseignant.
- **Conventions :** commentaires de code et messages de commit en anglais.
- **Réglementaire :** conformité RGPD.
- **Budget :** coût d'un éventuel service cloud à évaluer.
- **Délai :** livraison finale à la dernière séance de TP.

---

## 8. Hors périmètre

- Connexion à de vrais équipements (onduleurs, compteurs Linky).
- Vente, paiement ou devis en ligne.
- Gestion commerciale interne de l'entreprise (CRM, facturation).
- Application web ou desktop **[À valider PO]**.

---

## 9. Livrables

- Code source de l'application mobile et de l'API, avec tests.
- Documentation technique et utilisateur.
- Cahier des charges (ce document) et justification des choix techniques.
- Artefacts Scrum : backlog, sprints, estimations, comptes rendus de réunions.
- Présentation finale : démo et rétrospective.

---

## 10. Questions ouvertes pour le PO

1. **Cloud :** quel prestataire, et qui prend en charge le coût ?
2. **Météo :** données récupérées automatiquement via une API, saisies par l'utilisateur, ou les deux ?
3. **Consommation :** d'où viennent les données (compteur, saisie manuelle, simulation) ?
4. **Plateformes :** Android, iOS ou les deux ?
5. **Types de panneaux :** lesquels doivent être pris en charge ?
6. **Utilisateurs :** l'application s'adresse-t-elle aussi aux prospects et aux conseillers de l'entreprise ?
7. **Revente :** faut-il gérer la revente du surplus d'électricité (tarif de rachat) dans le calcul des économies ?
8. **Multi-installations :** un client peut-il avoir plusieurs installations ?

---

## Historique des versions

| Version | Date | Auteur | Modifications |
|---|---|---|---|
| 0.1 | 05/10/2026 | _à compléter_ | Ébauche initiale à partir du compte rendu n°1 |
