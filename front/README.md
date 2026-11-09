# App-solaire — mobile & web app

React Native app (Expo SDK 58, Expo Router) for the App-solaire project.
One code base for Android, iOS and the web.

## Run it

```bash
npm install
cp .env.example .env        # then set the URL of the Spring API
npm run web                 # web version in the browser
npm start                   # then scan the QR code with Expo Go (Android / iOS)
```

On a phone, `EXPO_PUBLIC_API_URL` must use the computer's local IP address
(e.g. `http://192.168.1.20:8080`), not `localhost`.

## Checks (run before every pull request)

```bash
npm run typecheck       # TypeScript
npm run lint            # ESLint
npm test                # Jest tests
npm run test:coverage   # Jest tests with the coverage report (coverage/)
```

The same checks run on every pull request (GitHub Actions, job "Front checks").
The build fails if the coverage drops below the threshold set in `jest.config.js`.

## Structure

```
src/
  app/                    Screens (file-based routes, Expo Router)
    (tabs)/               Bottom tabs: Accueil, Production, Météo, Profil
    installation/setup    3-step installation setup (FCT-10, FCT-11, FCT-12)
    installation/index    Installation sheet (FCT-14)
  components/             UI building blocks matching the Figma mock-up
  context/                Installation state shared by every screen
  domain/                 Types, panel catalogue, calculations, validation (pure, unit-tested)
  hooks/useCalculations   Calls the API for production, savings and payback
  services/api.ts         HTTP client of the Spring API
  storage/                Local storage of the client's data (ADR-006)
  __tests__/              Jest tests, organised like src/ (see Doc/Tests/strategie-de-test.md)
    helpers/              Test data and renderApp(), which starts the whole app with mocked API
```

## Design decisions

- **Client data stays on the device (ADR-006).** No server account: the installation is
  saved locally (AsyncStorage, i.e. localStorage on the web). Encryption with a user PIN is
  still to do, once the PO answers the multi-device question.
- **Coordinates are rounded to ~1 km** before being stored (GDPR minimisation).
- **The API only computes.** The app sends the installation parameters (no name, no address)
  to `POST /api/v1/calculations`. If the API is down, the app still shows the panel yield,
  computed locally, and a warning banner.

## API contract expected by the app (provisional, to align with the Swagger doc)

`POST /api/v1/calculations`

```json
{
  "latitude": 43.95, "longitude": 4.81,
  "panelType": "monocrystalline", "panelCount": 10,
  "peakPowerWc": 4000, "surfaceM2": 19,
  "azimuthDeg": 180, "tiltDeg": 30,
  "costEur": 8900, "subsidiesEur": 0, "electricityPriceEurPerKwh": 0.22
}
```

Response (each field may be `null` until implemented):

```json
{ "yieldPct": 21.05, "annualProductionKwh": 4800, "annualSavingsEur": 1050, "paybackYears": 8.5 }
```

The API must allow CORS from the web app's origin (`http://localhost:8081` in development).
