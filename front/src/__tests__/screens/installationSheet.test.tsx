import { describe, expect, it } from '@jest/globals';
import { screen, userEvent } from '@testing-library/react-native';

import { loadInstallation } from '../../storage/installationStorage';
import { makeInstallation } from '../helpers/fixtures';
import { renderApp } from '../helpers/renderApp';

const user = userEvent.setup();

describe('Installation sheet (FCT-12, FCT-14)', () => {
  it('invites the user to describe an installation when there is none', async () => {
    await renderApp('/installation');

    expect(await screen.findByText('Aucune installation enregistrée sur cet appareil.')).toBeOnTheScreen();

    await user.press(screen.getByRole('button', { name: 'Décrire mon installation →' }));
    expect(screen).toHavePathname('/installation/setup');
  });

  it('TC-12-01 / TC-12-02: shows every characteristic with an explicit unit', async () => {
    await renderApp('/installation', { installation: makeInstallation() });

    expect(await screen.findByText('21,1 %')).toBeOnTheScreen();
    expect(screen.getByText('Valeur typique monocristallin : 21 %')).toBeOnTheScreen();
    const expected = [
      '12 rue des Lilas, Avignon',
      '43,95, 4,81',
      'Monocristallin',
      '10',
      '4 kWc',
      '19 m²',
      'Sud',
      '30°',
      '9 000 €',
      '1 000 €',
      '8 000 €',
      '0,25 €/kWh',
    ];
    for (const value of expected) {
      expect(screen.getByText(value)).toBeOnTheScreen();
    }
  });

  it('says when the position is not known', async () => {
    await renderApp('/installation', { installation: makeInstallation({ coordinates: null }) });

    expect(await screen.findByText('Non renseignée')).toBeOnTheScreen();
  });

  it('TC-12-03: opens the edit screen', async () => {
    await renderApp('/installation', { installation: makeInstallation() });

    await user.press(await screen.findByRole('button', { name: /Modifier mon installation/ }));

    expect(await screen.findByText('Étape 1 sur 3 — Localisation')).toBeOnTheScreen();
    expect(screen).toHavePathname('/installation/setup');
  });

  describe('deletion', () => {
    it('asks for a confirmation and keeps the installation when cancelled', async () => {
      await renderApp('/installation', { installation: makeInstallation() });

      await user.press(await screen.findByRole('button', { name: /Supprimer mon installation/ }));
      expect(screen.getByText(/Cette action est irréversible/)).toBeOnTheScreen();
      await user.press(screen.getByRole('button', { name: 'Annuler' }));

      expect(screen.queryByText(/Cette action est irréversible/)).not.toBeOnTheScreen();
      await expect(loadInstallation()).resolves.not.toBeNull();
    });

    it('deletes the installation from the device and returns to the welcome screen', async () => {
      await renderApp('/installation', { installation: makeInstallation() });

      await user.press(await screen.findByRole('button', { name: /Supprimer mon installation/ }));
      await user.press(screen.getByRole('button', { name: /Confirmer la suppression/ }));

      expect(await screen.findByText('Suivez votre production solaire')).toBeOnTheScreen();
      expect(screen).toHavePathname('/');
      await expect(loadInstallation()).resolves.toBeNull();
    });
  });
});

describe('Profile (ADR-006)', () => {
  it('links to the setup when there is no installation', async () => {
    await renderApp('/profil');

    await user.press(await screen.findByText('Aucune installation'));

    expect(screen).toHavePathname('/installation/setup');
  });

  it('shows the installation and links to its sheet', async () => {
    await renderApp('/profil', { installation: makeInstallation() });

    expect(await screen.findByText('Ma maison')).toBeOnTheScreen();
    await user.press(screen.getByText('12 rue des Lilas, Avignon'));

    expect(screen).toHavePathname('/installation');
  });
});
