import { describe, expect, it } from '@jest/globals';
import { screen, userEvent } from '@testing-library/react-native';

import { makeInstallation } from '../helpers/fixtures';
import { renderApp } from '../helpers/renderApp';

const user = userEvent.setup();

describe('Home dashboard (FCT-44)', () => {
  describe('without installation', () => {
    it('welcomes the user and explains that the data stays on the device', async () => {
      await renderApp('/');

      expect(await screen.findByText('Suivez votre production solaire')).toBeOnTheScreen();
      expect(screen.getByText('Vos données restent sur votre appareil.')).toBeOnTheScreen();
    });

    it('does not call the API', async () => {
      const { fetchMock } = await renderApp('/');

      await screen.findByText('Suivez votre production solaire');
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('opens the installation setup', async () => {
      await renderApp('/');

      await user.press(await screen.findByRole('button', { name: 'Décrire mon installation →' }));

      expect(await screen.findByText('Étape 1 sur 3 — Localisation')).toBeOnTheScreen();
      expect(screen).toHavePathname('/installation/setup');
    });
  });

  describe('with an installation', () => {
    it('shows the installation name, its city and its peak power', async () => {
      await renderApp('/', { installation: makeInstallation() });

      expect(await screen.findByText('Ma maison')).toBeOnTheScreen();
      expect(screen.getByText('Avignon · 4 kWc')).toBeOnTheScreen();
    });

    it('shows the results of the API with their units', async () => {
      await renderApp('/', { installation: makeInstallation() });

      expect(await screen.findByText('4 800')).toBeOnTheScreen();
      expect(screen.getByText('kWh / an')).toBeOnTheScreen();
      expect(screen.getByText('1 050')).toBeOnTheScreen();
      expect(screen.getByText('€ / an')).toBeOnTheScreen();
      expect(screen.getByText('8,5')).toBeOnTheScreen();
      expect(screen.getByText('8 ans et 6 mois')).toBeOnTheScreen();
    });

    it('shows the net investment, subsidies deducted', async () => {
      await renderApp('/', { installation: makeInstallation({ costEur: 9000, subsidiesEur: 1000 }) });

      expect(await screen.findByText('8 000 € investis (aides déduites)')).toBeOnTheScreen();
    });

    it('sends the installation to the API', async () => {
      const { fetchMock } = await renderApp('/', { installation: makeInstallation() });

      await screen.findByText('4 800');
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:8080/api/v1/calculations');
    });

    it('still shows the yield computed on the device when the API is down', async () => {
      await renderApp('/', { installation: makeInstallation({ peakPowerWc: 4000, surfaceM2: 19 }), api: 'offline' });

      expect(
        await screen.findByText('Serveur de calcul indisponible : seules les valeurs calculées sur l’appareil sont affichées.'),
      ).toBeOnTheScreen();
      expect(screen.getByText('21,1')).toBeOnTheScreen();
      expect(screen.getAllByText('—')).toHaveLength(3);
      expect(screen.getByText('Le délai de rentabilité s’affichera dès que l’API répondra.')).toBeOnTheScreen();
    });

    it('opens the installation sheet', async () => {
      await renderApp('/', { installation: makeInstallation() });

      await user.press(await screen.findByText('Voir la fiche de mon installation →'));

      expect(await screen.findByText('Caractéristiques')).toBeOnTheScreen();
      expect(screen).toHavePathname('/installation');
    });
  });
});

describe('Tab bar', () => {
  it('offers the four tabs of the mock-up', async () => {
    await renderApp('/');

    await screen.findByText('Suivez votre production solaire');
    for (const tab of ['Accueil', 'Production', 'Météo', 'Profil']) {
      expect(screen.getByRole('button', { name: new RegExp(tab) })).toBeOnTheScreen();
    }
  });

  it.each([
    ['/production', 'Graphiques de production par jour, mois et année'],
    ['/meteo', 'prévisions à 7 jours'],
  ])('%s shows a placeholder until its sprint', async (url, text) => {
    await renderApp(url);

    expect(await screen.findByText(new RegExp(text))).toBeOnTheScreen();
    expect(screen.getByText('Prévu au sprint 3')).toBeOnTheScreen();
  });
});
