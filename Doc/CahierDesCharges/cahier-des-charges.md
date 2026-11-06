# Cahier des charges : App-solaire

- **Projet :** App-solaire, application de calcul de rendement solaire
- **UCE :** Processus du développement logiciel (Master ILSEN, S1)
- **Version :** 0.2
- **Date :** 06/11/2026
- **Statut :** Brouillon, mis à jour après le compte rendu n°3. Certains points restent à valider avec le Product Owner
- **Auteurs :** Equipe Dev

> Les éléments marqués **[À valider PO]** sont des hypothèses de l'équipe qui doivent être confirmées lors d'une prochaine réunion.

## Historique des versions

| Version | Date | Modifications |
|---|---|---|
| 0.1 | 05/10/2026 | Ébauche initiale. |
| 0.2 | 06/11/2026 | Prise en compte du compte rendu n°3 : données clients chiffrées sur l'appareil (ADR-006), API externes (ADR-007), consommation simulée, version web, hébergement. |

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

- une application mobile et web destinée aux clients particuliers ;
- une API back-end qui fournit et calcule les données photovoltaïques, sans enregistrer de données clients (ADR-006) ;
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

Formule simplifiée, présentée au PO sans objection (compte rendu n°3) :

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

> La [liste des fonctionnalités](liste-fonctionnalites.md) et les tickets FCT-01 à FCT-06 décrivent encore des comptes sur un serveur. Ils seront alignés sur cette version après la réponse du PO sur le multi-appareil (section 10).

### 4.1 Profil utilisateur

| ID | Exigence | Priorité |
|---|---|---|
| F-01 | L'utilisateur peut créer un profil local protégé par un code, sans compte sur un serveur (ADR-006). **[À valider PO]** | M |
| F-02 | L'utilisateur peut modifier ou supprimer son profil et ses données, et les exporter dans un fichier chiffré (RGPD). | S |

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
| F-20 | L'application récupère automatiquement les données météo et d'ensoleillement pour la localisation de l'installation (Open-Meteo, ADR-007). | M |
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
| F-40 | L'utilisateur peut suivre sa consommation électrique (données simulées, car aucune API ne fournit la consommation réelle d'un foyer). | M |
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
| NF-02 | Plateformes | Application disponible sur Android, iOS et web. |
| NF-03 | Sécurité | Données clients chiffrées sur l'appareil, avec une clé protégée par le code de l'utilisateur et, sur téléphone, par le coffre sécurisé (Android Keystore, iOS Keychain). Communications chiffrées (HTTPS). Données accessibles uniquement au client : l'entreprise ne peut pas les lire. |
| NF-04 | RGPD | Données personnelles minimales, consentement explicite, droit d'accès et de suppression. L'entreprise ne conserve aucune donnée client. |
| NF-05 | Performance | Les calculs et l'affichage du tableau de bord prennent moins de 2 secondes. |
| NF-06 | Disponibilité | L'application reste consultable si l'API météo externe est indisponible (dernières données en cache). |
| NF-07 | Qualité | Code commenté en anglais, tests unitaires sur les calculs métier, intégration continue. |
| NF-08 | Maintenabilité | Architecture séparant front mobile, API et logique de calcul. |
| NF-09 | Langue | Interface en français. |

---

## 6. Architecture technique (envisagée)

```
┌──────────────────────┐   HTTPS / REST    ┌──────────────────────┐      ┌────────────────────┐
│ Application          │ ────────────────► │ API back-end         │ ───► │ Services externes  │
│ mobile et web        │ ◄──────────────── │ (calculs, données    │      │ (Open-Meteo, PVGIS)│
│ (données chiffrées   │                   │ simulées, catalogue, │      └────────────────────┘
│ sur l'appareil)      │                   │ cache)               │
└──────────────────────┘                   └──────────────────────┘
```

- **Front :** application mobile et web multiplateforme (**React Native**, ADR-001).
- **Back-end :** API REST (**Spring Boot**, ADR-002), qui n'enregistre aucune donnée client. Elle calcule à partir des paramètres reçus et appelle seule les services externes (ADR-007).
- **Données :** données clients stockées et chiffrées sur l'appareil (ADR-006). Production et consommation simulées. Le besoin d'une base de données côté API reste à réviser (ADR-005).
- **Hébergement :** aucun budget défini. L'API tourne en local ou sur un hébergement gratuit pour les démos.

---

## 7. Contraintes

- **Méthode :** Scrum, un sprint par séance de TP, avec une démo au PO à chaque séance.
- **Outils :** GitHub (code, documentation, comptes rendus) et GitHub Projects (backlog), accessibles à l'enseignant.
- **Conventions :** commentaires de code et messages de commit en anglais.
- **Réglementaire :** conformité RGPD.
- **Budget :** aucun coût supplémentaire pour les clients, aucun budget d'hébergement défini.
- **Organisation :** l'équipe travaille sur le projet uniquement pendant les séances de TP.
- **Délai :** livraison finale à la dernière séance de TP.

---

## 8. Hors périmètre

- Connexion à de vrais équipements (onduleurs, compteurs Linky).
- Vente, paiement ou devis en ligne.
- Gestion commerciale interne de l'entreprise (CRM, facturation).
- Application desktop **[À valider PO]**.
- Stockage des données clients sur un serveur et synchronisation automatique entre appareils **[À valider PO]**.

---

## 9. Livrables

- Code source de l'application mobile et de l'API, avec tests.
- Documentation technique et utilisateur en anglais.
- Cahier des charges (ce document) et justification des choix techniques.
- Artefacts Scrum : backlog, sprints, estimations, comptes rendus de réunions.
- Présentation finale : démo et rétrospective.

---

## 10. Questions pour le PO

### 10.1 Points traités (compte rendu n°3)

| Point | Réponse |
|---|---|
| Données clients | Chiffrées avec une clé, accessibles uniquement au client et non gérées par l'entreprise (confirmé par le PO). |
| Cloud et hébergement | Pas de coût supplémentaire pour les clients. Aucun budget défini : API en local ou hébergement gratuit pour les démos (à confirmer). |
| Météo | Récupération automatique via Open-Meteo, présentée sans objection. |
| Consommation | Données simulées, présentées sans objection. Les compteurs sont hors périmètre. |

### 10.2 Questions ouvertes

1. **Plusieurs appareils :** un client doit-il retrouver ses données sur le web et sur son téléphone ? Si oui, il faut un stockage chiffré sur un serveur, avec un petit coût d'hébergement.
2. **Charge :** le plafond de 15 h s'entend-il par personne ou pour toute l'équipe ?
3. **Types de panneaux :** lesquels doivent être pris en charge ?
4. **Utilisateurs :** l'application s'adresse-t-elle aussi aux prospects et aux conseillers de l'entreprise ?
5. **Revente :** faut-il gérer la revente du surplus d'électricité (tarif de rachat) dans le calcul des économies ?
6. **Multi-installations :** un client peut-il avoir plusieurs installations ?
7. **Météo manuelle :** l'utilisateur doit-il aussi pouvoir saisir la météo à la main ?
