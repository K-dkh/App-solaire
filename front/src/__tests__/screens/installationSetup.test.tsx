import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import * as Location from 'expo-location';
import { screen, userEvent } from '@testing-library/react-native';

import { loadInstallation } from '../../storage/installationStorage';
import { makeInstallation } from '../helpers/fixtures';
import { renderApp } from '../helpers/renderApp';

// The phone's GPS is simulated: each test decides what the permission and the position are.
jest.mock('expo-location', () => ({
  Accuracy: { Low: 2 },
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
}));
const requestPermission = jest.mocked(Location.requestForegroundPermissionsAsync);
const getPosition = jest.mocked(Location.getCurrentPositionAsync);

const user = userEvent.setup();

const continueButton = () => screen.getByRole('button', { name: 'Continuer →' });
const field = (label: string) => screen.getByLabelText(label);

async function fillStep1(address = '12 rue des Lilas, Avignon') {
  await user.type(await screen.findByLabelText("Adresse de l'installation"), address);
  await user.press(continueButton());
  await screen.findByText('Étape 2 sur 3 — Caractéristiques');
}

async function fillStep2(panelCount = '10') {
  await user.type(field('Nombre de panneaux'), panelCount);
  await user.press(continueButton());
  await screen.findByText('Étape 3 sur 3 — Finances');
}

describe('Installation setup (FCT-10, FCT-11, FCT-12)', () => {
  beforeEach(() => {
    requestPermission.mockReset();
    getPosition.mockReset();
  });

  describe('step 1: location (FCT-08)', () => {
    it('cannot continue without an address or a position', async () => {
      await renderApp('/installation/setup');

      expect(await screen.findByText('Étape 1 sur 3 — Localisation')).toBeOnTheScreen();
      expect(continueButton()).toBeDisabled();
    });

    it('continues once an address is typed', async () => {
      await renderApp('/installation/setup');

      await fillStep1();

      expect(screen.getByLabelText('Nombre de panneaux')).toBeOnTheScreen();
    });

    it('TC-08-01: uses the position of the phone, rounded to ~1 km', async () => {
      requestPermission.mockResolvedValueOnce({ status: 'granted' } as Location.LocationPermissionResponse);
      getPosition.mockResolvedValueOnce({
        coords: { latitude: 43.949317, longitude: 4.805528 },
      } as Location.LocationObject);
      await renderApp('/installation/setup');

      await user.press(await screen.findByRole('button', { name: /Utiliser ma position/ }));

      expect(await screen.findByText('Position enregistrée : 43,95, 4,81 (arrondie à ~1 km).')).toBeOnTheScreen();
      expect(screen.getByRole('button', { name: /Mettre à jour ma position/ })).toBeOnTheScreen();
      expect(continueButton()).toBeEnabled();
    });

    it('TC-08-02: lets the user type an address when the permission is refused', async () => {
      requestPermission.mockResolvedValueOnce({ status: 'denied' } as Location.LocationPermissionResponse);
      await renderApp('/installation/setup');

      await user.press(await screen.findByRole('button', { name: /Utiliser ma position/ }));

      expect(await screen.findByText('Autorisation refusée : saisissez plutôt votre adresse.')).toBeOnTheScreen();
      expect(getPosition).not.toHaveBeenCalled();
      expect(continueButton()).toBeDisabled();
      expect(field("Adresse de l'installation")).toBeOnTheScreen();
    });

    it('does not crash when the position cannot be read', async () => {
      requestPermission.mockResolvedValueOnce({ status: 'granted' } as Location.LocationPermissionResponse);
      getPosition.mockRejectedValueOnce(new Error('Location unavailable'));
      await renderApp('/installation/setup');

      await user.press(await screen.findByRole('button', { name: /Utiliser ma position/ }));

      expect(await screen.findByText('Position indisponible : saisissez plutôt votre adresse.')).toBeOnTheScreen();
    });
  });

  describe('step 2: characteristics (FCT-11)', () => {
    it('pre-fills the peak power and the surface from the panel type and count', async () => {
      await renderApp('/installation/setup');
      await fillStep1();

      await user.type(field('Nombre de panneaux'), '10');

      // 10 monocrystalline panels of 400 Wc and 1.9 m².
      expect(field('Puissance crête (kWc)')).toHaveDisplayValue('4');
      expect(field('Surface (m²)')).toHaveDisplayValue('19');
      expect(screen.getByText('21,1 %')).toBeOnTheScreen();
    });

    it('updates the pre-filled values when another panel type is chosen', async () => {
      await renderApp('/installation/setup');
      await fillStep1();
      await user.type(field('Nombre de panneaux'), '12');

      await user.press(screen.getByRole('radio', { name: 'Polycristallin' }));

      // 12 polycrystalline panels of 300 Wc and 1.75 m².
      expect(screen.getByRole('radio', { name: 'Polycristallin' })).toBeSelected();
      expect(field('Puissance crête (kWc)')).toHaveDisplayValue('3,6');
      expect(field('Surface (m²)')).toHaveDisplayValue('21');
    });

    it('offers the orientations of the mock-up, south by default', async () => {
      await renderApp('/installation/setup');
      await fillStep1();

      expect(screen.getByRole('radio', { name: 'Sud' })).toBeSelected();
      for (const orientation of ['Sud-Est', 'Sud-Ouest', 'Est', 'Ouest']) {
        expect(screen.getByRole('radio', { name: orientation })).not.toBeSelected();
      }
      // A north-facing roof is not worth equipping.
      expect(screen.queryByRole('radio', { name: 'Nord' })).not.toBeOnTheScreen();
    });

    it('TC-07-02 / TC-07-04: shows the errors and stays on the step', async () => {
      await renderApp('/installation/setup');
      await fillStep1();
      await user.type(field('Nombre de panneaux'), '10');
      await user.clear(field('Inclinaison (°)'));
      await user.type(field('Inclinaison (°)'), '91');
      await user.clear(field('Surface (m²)'));
      await user.type(field('Surface (m²)'), '0');

      await user.press(continueButton());

      expect(screen.getByText("L'inclinaison doit être inférieur ou égal à 90.")).toBeOnTheScreen();
      expect(screen.getByText('La surface doit être strictement positif.')).toBeOnTheScreen();
      expect(screen.getByText('Étape 2 sur 3 — Caractéristiques')).toBeOnTheScreen();
    });

    it('hides the error of a field as soon as the user corrects it', async () => {
      await renderApp('/installation/setup');
      await fillStep1();
      await user.press(continueButton());
      expect(screen.getByText('Le nombre de panneaux est obligatoire et doit être un nombre.')).toBeOnTheScreen();

      await user.type(field('Nombre de panneaux'), '1');

      expect(screen.queryByText('Le nombre de panneaux est obligatoire et doit être un nombre.')).not.toBeOnTheScreen();
    });

    it('goes back to the previous step', async () => {
      await renderApp('/installation/setup');
      await fillStep1();

      await user.press(screen.getByRole('button', { name: 'Retour' }));

      expect(screen.getByText('Étape 1 sur 3 — Localisation')).toBeOnTheScreen();
      expect(field("Adresse de l'installation")).toHaveDisplayValue('12 rue des Lilas, Avignon');
    });
  });

  describe('step 3: finances (FCT-10)', () => {
    it('TC-10-02: refuses a negative cost', async () => {
      await renderApp('/installation/setup');
      await fillStep1();
      await fillStep2();
      await user.type(field("Coût d'installation (€)"), '-9000');
      await user.type(field("Prix de l'électricité (€/kWh)"), '0,25');

      await user.press(screen.getByRole('button', { name: 'Enregistrer mon installation' }));

      expect(screen.getByText('Le coût doit être strictement positif.')).toBeOnTheScreen();
      await expect(loadInstallation()).resolves.toBeNull();
    });

    it('TC-07-05: saves the installation on the device and returns to the dashboard', async () => {
      await renderApp('/installation/setup');
      await fillStep1();
      await fillStep2();
      await user.type(field("Coût d'installation (€)"), '9 000');
      await user.type(field('Aides perçues (€, facultatif)'), '1000');
      await user.type(field("Prix de l'électricité (€/kWh)"), '0,25');

      await user.press(screen.getByRole('button', { name: 'Enregistrer mon installation' }));

      expect(await screen.findByText('8 000 € investis (aides déduites)')).toBeOnTheScreen();
      expect(screen).toHavePathname('/');
      await expect(loadInstallation()).resolves.toMatchObject({
        name: 'Mon installation',
        address: '12 rue des Lilas, Avignon',
        panelType: 'monocrystalline',
        panelCount: 10,
        peakPowerWc: 4000,
        surfaceM2: 19,
        orientation: 'S',
        tiltDeg: 30,
        costEur: 9000,
        subsidiesEur: 1000,
        electricityPriceEurPerKwh: 0.25,
      });
    });
  });

  describe('editing (TC-10-03)', () => {
    it('starts from the saved values and keeps the same installation', async () => {
      const saved = makeInstallation({ costEur: 9000 });
      // Real path: the sheet is opened first, so the installation is already loaded.
      // Known issue: opened directly at start-up, the form stays empty (see the Sprint 1 test plan).
      await renderApp('/installation', { installation: saved });
      await user.press(await screen.findByRole('button', { name: /Modifier mon installation/ }));

      expect(await screen.findByLabelText("Adresse de l'installation")).toHaveDisplayValue(saved.address);
      await user.press(continueButton());
      expect(await screen.findByLabelText('Nombre de panneaux')).toHaveDisplayValue('10');
      await user.press(continueButton());
      await user.clear(await screen.findByLabelText("Coût d'installation (€)"));
      await user.type(field("Coût d'installation (€)"), '10000');
      await user.press(screen.getByRole('button', { name: 'Enregistrer les modifications' }));

      expect(await screen.findByText('Investissement net')).toBeOnTheScreen();
      expect(screen).toHavePathname('/installation');
      const updated = await loadInstallation();
      expect(updated).toMatchObject({ id: saved.id, createdAt: saved.createdAt, costEur: 10000 });
    });
  });
});
