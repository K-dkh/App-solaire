# Stratégie de test : App-solaire

- **Projet :** App-solaire, application de calcul de rendement solaire
- **Version :** 0.2
- **Date :** 09/11/2026
- **Responsable :** Téo (Tests & doc)
- **Statut :** Proposition, à valider par l'équipe

Ce document répond au point « stratégie de test, outils, Definition of Done » du [compte rendu n°2](../CompteRenduReunion/compte-rendu-2026-10-05.md). Les cas de test du sprint en cours sont dans le [plan de test du Sprint 1](plan-de-test-sprint-1.md).

---

## 1. Objectifs

- Vérifier que chaque fonctionnalité respecte les critères d'acceptation de son ticket.
- Garantir l'exactitude des calculs (rendement, production, économies, rentabilité), qui sont la valeur principale de l'application.
- Démontrer au PO, à chaque sprint, ce qui fonctionne et ce qui ne fonctionne pas encore.

## 2. Niveaux de test

| Niveau | Ce qui est vérifié | Outils | Exécution |
|---|---|---|---|
| **Unitaire (U)** | Formules de calcul et règles de validation, sans réseau ni base de données | JUnit 5 (API Spring), Jest (React Native) | Automatique |
| **Composant et écran (C)** | Composants et écrans de l'application, parcours dans le vrai routeur Expo, API et GPS simulés | Jest, React Native Testing Library | Automatique |
| **Intégration (I)** | Routes de l'API, formats de réponse, codes d'erreur, cache, avec services externes simulés | Spring Boot Test et MockMvc | Automatique |
| **Recette (R)** | Parcours réel de l'utilisateur dans l'application | Scénarios manuels du plan de test | Manuelle, avant chaque démo |

JUnit et MockMvc viennent de l'ADR-002. Jest est utilisé pour le front depuis le Sprint 1 (section 6).

## 3. Règles

- **Services externes :** Open-Meteo et PVGIS sont simulés dans les tests automatiques, pour que le résultat ne dépende ni du réseau ni de la météo du jour.
- **Valeurs de référence :** les résultats attendus des calculs sont fixés dans le plan de test, à partir des formules des tickets, et non recopiés depuis le résultat du code.
- **Code généré par LLM :** les tests générés sont relus. Chaque résultat attendu doit pouvoir être justifié sans exécuter le code.
- **Anomalies :** une anomalie devient une issue GitHub avec le label `bug` et la référence du cas de test.

## 4. Definition of Done (proposition)

Un ticket passe à **Done** dans le Project « Scrum » lorsque :

- [ ] tous ses critères d'acceptation sont vérifiés ;
- [ ] ses cas de test sont exécutés et réussis, ou leurs anomalies sont tracées et acceptées par l'équipe ;
- [ ] les tests automatiques passent ;
- [ ] le code est fusionné par une pull request relue par une autre personne, qui référence le ticket (`Closes #X`) ;
- [ ] les commentaires de code et les messages de commit sont en anglais ;
- [ ] la documentation concernée est à jour ;
- [ ] la fonctionnalité peut être montrée en démo au PO.

## 5. Suivi

- **À chaque démo :** un rapport de test indique les cas exécutés, réussis et échoués, ainsi que les anomalies ouvertes.
- **Intégration continue :** les tests automatiques sont lancés sur chaque pull request et sur `main` avec GitHub Actions (exigence NF-07). Voir la section 6 pour le front.

## 6. Tests du front (React Native)

### Outils

| Outil | Rôle |
|---|---|
| Jest (preset `jest-expo`) | Lance les tests et mesure la couverture |
| React Native Testing Library | Affiche les composants et simule les actions de l'utilisateur |
| `expo-router/testing-library` | Affiche l'application entière avec ses vraies routes |

### Organisation

Les tests sont dans `front/src/__tests__/`, rangés comme le code testé :

| Dossier | Ce qui est testé |
|---|---|
| `domain/` | Calculs, validation du formulaire, catalogue des panneaux |
| `storage/`, `services/` | Stockage local (ADR-006) et client de l'API |
| `hooks/`, `context/` | Appel de l'API et état partagé de l'installation |
| `components/` | Composants d'interface de la maquette |
| `screens/` | Parcours dans les écrans : accueil, saisie en 3 étapes, fiche, profil |
| `helpers/` | Données de test et démarrage de l'application, sans test |

L'API (`fetch`), le GPS (`expo-location`) et le stockage (`AsyncStorage`) sont simulés. Les noms de test citent l'identifiant du cas du [plan de test](plan-de-test-sprint-1.md) qu'ils vérifient (par exemple `TC-17-01`).

### Lancer les tests

```bash
cd front
npm test                 # tous les tests
npm run test:coverage    # avec le rapport de couverture (front/coverage/)
npm run lint             # ESLint
npm run typecheck        # TypeScript
```

### Intégration continue

Le job « Front checks » de `.github/workflows/ci.yml` lance le lint, la vérification TypeScript puis les tests avec couverture. Il échoue si un test échoue ou si la couverture passe sous le seuil de `front/jest.config.js` : 90 % des instructions et des lignes, 85 % des branches et des fonctions. Le rapport HTML de couverture est disponible dans les artefacts du job.

Au 09/11/2026 : 160 tests, couverture d'environ 97 % des instructions.
