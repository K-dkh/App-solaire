# Compte rendu de réunion n°3

- **Projet :** App-solaire, application de calcul de rendement solaire
- **UCE :** Processus du développement logiciel (Master ILSEN, S1)
- **Date :** 13/10/2026
- **Type :** Réunion avec le Product Owner
- **Participants :** Product Owner, équipe projet : Sheinez, Dede, Malikath
- **Absent :** Teo
- **Rédacteur :** Dede

---

## 1. Suivi des actions du compte rendu n°2

- [x] Désigner le Scrum Master : Teo
- [x] Faire valider par le PO les points ouverts (voir section 3)
- [x] Valider ou changer le choix de la base de données (ADR-005)
- [ ] Vérifier que l'enseignant a accès au dépôt et au GitHub Projects
- [x] Pousser sur le dépôt le compte rendu n°2 et le fichier ADR
- [x] Planifier le sprint 1 dans le backlog GitHub Projects



## 2. Avancement présenté au PO

- Document « Choix des API », rédigé par l'équipe pour validation par le PO
- Maquette de l'application, **validée par le PO**.
- Principe : l'application ne parle qu'à l'API de l'équipe, qui appelle les services externes. Cela protège les données des clients et permet d'afficher les dernières données si un service externe est indisponible.

| API | Rôle | Fonctionnalités | Coût |
|---|---|---|---|
| Open-Meteo (externe) | Météo actuelle, prévisions à 7 jours, rayonnement solaire du lieu | FCT-20, 22, 34 | Gratuite, usage non commercial, 10 000 appels par jour |
| PVGIS (Commission européenne) | Irradiation et production photovoltaïque estimées selon le lieu, l'orientation et l'inclinaison, avec historique | FCT-31, 32, vérification des calculs | Gratuite, limite de 30 appels par seconde |
| API App-solaire (Spring, développée par l'équipe) | Appels aux API externes avec cache, calculs, données simulées | FCT-30 à 32, 40 à 44 | Hébergement à définir |

**Décisions soumises au PO :** météo automatique via Open-Meteo ; consommation simulée (aucune API ne fournit la consommation réelle d'un foyer, compteurs hors périmètre) ; formule de production simplifiée ; usage non commercial d'Open-Meteo (une vraie commercialisation demanderait une offre payante) ; hébergement (prestataire et budget maximal, sinon l'API tourne en local ou sur un hébergement gratuit pour les démos).

Le PO n'a pas contesté ces choix. Il a ajouté que les données des clients doivent être chiffrées avec une clé et que l'entreprise ne doit pas les gérer (voir 4).

## 3. Réponses du PO aux points ouverts du compte rendu n°2

| Point | Réponse du PO |
|---|---|
| Cloud et hébergement | Pas de coût supplémentaire pour les clients et pas de gestion de leurs données par l'entreprise : protection par chiffrement avec une clé (voir 4). Aucun budget d'hébergement défini : l'API tourne en local ou gratuitement pour les démos. <!-- confirmer --> |
| Météo | Automatique via Open-Meteo, présenté sans objection 
| Consommation | Simulée : aucune API ne fournit la consommation réelle, les compteurs sont hors périmètre ||


## 4. Retours du PO et questions soulevées

### 4.1 Questions soulevées par le PO sur les comptes et les données

Le PO a demandé à l'équipe d'étudier les points suivants :

- Est-il intéressant de créer un compte utilisateur ?
- Faut-il stocker les données de l'utilisateur sur un serveur ?
- Les données des clients doivent être chiffrées.
- Plusieurs connexions sur un même compte : faut-il un mot de passe par compte, ou plusieurs ?

**Orientation exprimée par le PO.** L'entreprise propose une solution à ses clients et ne veut pas leur faire payer davantage. Elle ne souhaite donc pas prendre en charge la gestion de leurs données. Piste évoquée : utiliser une clé de chiffrement, ou un mécanisme équivalent.

### 4.2 Proposition de l'équipe (à confirmer avec le PO)

**Interprétation.** Le PO demande à la fois de chiffrer les données des clients avec une clé et d'éviter que l'entreprise gère ces données, pour ne pas augmenter le coût pour les clients. L'équipe comprend que les données doivent rester chez le client, chiffrées sur son appareil (téléphone ou navigateur), et ne pas être conservées par l'entreprise.

**Proposition.** Les données du client (profil, installations, consommation) sont stockées localement sur son appareil, chiffrées avec une clé protégée par un code de l'utilisateur. Sur le téléphone, la clé est aussi protégée par le coffre sécurisé (Android Keystore, iOS Keychain) ; sur le web, les données sont dans le navigateur, avec une protection moins forte. Une clé de récupération peut être proposée à l'utilisateur. La justification figure dans l'ADR-006.

**Réponses aux questions du PO.**
- *Est-il intéressant de créer un compte utilisateur ?* Un compte sur serveur n'est pas nécessaire : il est remplacé par un profil local protégé par un code.
- *Faut-il stocker les données sur un serveur ?* Non dans cette proposition.
- *Chiffrer les données clients ?* Oui, localement, avec une clé.
- *Plusieurs connexions sur un même compte, un mot de passe par compte ou plusieurs ?* Plusieurs personnes sur le même téléphone : un code par profil local. Plusieurs appareils pour un même client : impossible sans serveur.

**Ce que le client doit savoir.**
- Code oublié et clé de récupération perdue : les données sont perdues.
- Pas de « mot de passe oublié » par e-mail (FCT-03).
- Changement de téléphone : possible par export chiffré (FCT-06) puis import, pas par synchronisation automatique.

**Question posée au PO.** « Pouvez-vous confirmer que les données des clients doivent rester uniquement sur leur appareil, sans copie chez l'entreprise ? »

- **Réponse du PO :** « oui, que pour le client » 
- **Décision :** les données ne sont accessibles qu'au client ; l'entreprise ne peut pas les lire.

**À clarifier : plusieurs appareils (web et mobile).** L'application existant en version web et mobile, il faut savoir si un client doit retrouver les mêmes données sur les deux. Sinon, chaque appareil garde ses données et le client les transfère par export chiffré. Si oui, il faut un stockage de données chiffrées sur un serveur, dont l'entreprise n'a pas la clé, avec un petit coût d'hébergement.

- **Décision :** <!-- à convenir -->

### 4.3 Autres retours et nouvelles demandes

- Rien à signaler

## 5. Décisions prises

- Maquette de l'application : validée par le PO.
- Choix des API externes (Open-Meteo, PVGIS) et consommation simulée : présentés sans objection du PO. 
- Données des clients chiffrées avec une clé, accessibles uniquement au client et non gérées par l'entreprise (confirmé par le PO). Proposition de l'équipe : stockage local chiffré et API sans données clients (ADR-006). Le multi-appareil reste à clarifier.
- Démarrage du développement.

## 6. Prochaines étapes

- [ ] Clarifier avec le PO si le client doit retrouver ses données sur plusieurs appareils (web et mobile), avant de développer les comptes
- [ ] Vérifier que les écrans de la maquette validée (inscription, connexion, profil) restent cohérents avec la réponse du PO sur les données, et les adapter si besoin
- [ ] Valider l'ADR-006, réviser l'ADR-005 et mettre à jour les epics 1, 2 et 6 de la liste des fonctionnalités selon la réponse
- [ ] Prévoir comment tester l'application sur iOS (Mac, ou Expo sur un iPhone)
- [ ] Mettre à jour l'ADR-001 (version web) et prévoir la déclinaison web de la maquette (grands écrans)
- [ ] Préparer les questions pour la prochaine réunion avec le PO