import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render, screen, userEvent } from '@testing-library/react-native';
import { Text } from 'react-native';

import { ComingSoon } from '../../components/ComingSoon';
import {
  AlertBanner,
  BackHeader,
  ChipGroup,
  DestructiveButton,
  InputField,
  ListRow,
  LocationButton,
  PrimaryButton,
  ProgressBar,
  Screen,
  SecondaryButton,
  StatCard,
  StepProgress,
} from '../../components/ui';
import { colors } from '../../theme';

const user = userEvent.setup();

// Buttons with a Feather icon: the icon glyph is part of their accessible name, so they are found with a regex.

describe('Screen', () => {
  it('shows its content and its footer', async () => {
    await render(
      <Screen footer={<Text>Pied de page</Text>}>
        <Text>Contenu</Text>
      </Screen>,
    );

    expect(screen.getByText('Contenu')).toBeOnTheScreen();
    expect(screen.getByText('Pied de page')).toBeOnTheScreen();
  });
});

describe('BackHeader', () => {
  it('shows the title and goes back when the back button is pressed', async () => {
    const onBack = jest.fn();
    await render(<BackHeader title="Mon installation" onBack={onBack} />);

    await user.press(screen.getByRole('button', { name: 'Retour' }));

    expect(screen.getByText('Mon installation')).toBeOnTheScreen();
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('has no back button on a top-level screen', async () => {
    await render(<BackHeader title="Météo" />);

    expect(screen.queryByRole('button', { name: 'Retour' })).not.toBeOnTheScreen();
  });
});

describe('StepProgress', () => {
  it('tells the user which step they are on', async () => {
    await render(<StepProgress step={2} total={3} label="Caractéristiques" />);

    expect(screen.getByText('Étape 2 sur 3 — Caractéristiques')).toBeOnTheScreen();
  });
});

describe('PrimaryButton', () => {
  let onPress: jest.Mock;

  beforeEach(() => {
    onPress = jest.fn();
  });

  it('calls onPress when pressed', async () => {
    await render(<PrimaryButton title="Continuer →" onPress={onPress} />);

    await user.press(screen.getByRole('button', { name: 'Continuer →' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('cannot be pressed when disabled', async () => {
    await render(<PrimaryButton title="Continuer →" onPress={onPress} disabled />);

    const button = screen.getByRole('button', { name: 'Continuer →' });
    expect(button).toBeDisabled();
    await user.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('shows a spinner instead of the title and cannot be pressed while loading', async () => {
    await render(<PrimaryButton title="Enregistrer" onPress={onPress} loading />);

    expect(screen.queryByText('Enregistrer')).not.toBeOnTheScreen();
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    await user.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });
});

describe('SecondaryButton and DestructiveButton', () => {
  it('call onPress when pressed', async () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    await render(
      <>
        <SecondaryButton title="Modifier" icon="edit-2" onPress={onEdit} />
        <DestructiveButton title="Supprimer" onPress={onDelete} />
      </>,
    );

    await user.press(screen.getByRole('button', { name: /Modifier/ }));
    await user.press(screen.getByRole('button', { name: /Supprimer/ }));

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});

describe('LocationButton', () => {
  it('calls onPress when pressed', async () => {
    const onPress = jest.fn();
    await render(<LocationButton title="Utiliser ma position" onPress={onPress} />);

    await user.press(screen.getByRole('button', { name: /Utiliser ma position/ }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('cannot be pressed twice while the position is being read', async () => {
    await render(<LocationButton title="Utiliser ma position" onPress={jest.fn()} loading />);

    expect(screen.getByRole('button', { name: /Utiliser ma position/ })).toBeDisabled();
  });
});

describe('InputField', () => {
  it('is reachable by its label and sends what the user types', async () => {
    const onChangeText = jest.fn();
    await render(<InputField label="Surface (m²)" value="" onChangeText={onChangeText} placeholder="22" />);

    await user.type(screen.getByLabelText('Surface (m²)'), '19');

    expect(screen.getByPlaceholderText('22')).toBeOnTheScreen();
    expect(onChangeText).toHaveBeenLastCalledWith('9');
    expect(onChangeText).toHaveBeenCalledTimes(2);
  });

  it('shows its current value', async () => {
    await render(<InputField label="Surface (m²)" value="19" onChangeText={jest.fn()} />);

    expect(screen.getByLabelText('Surface (m²)')).toHaveDisplayValue('19');
  });

  it('shows the hint when there is no error', async () => {
    await render(<InputField label="Prix" value="" onChangeText={jest.fn()} hint="Indiqué sur votre facture." />);

    expect(screen.getByText('Indiqué sur votre facture.')).toBeOnTheScreen();
  });

  it('shows the error instead of the hint, with a red border', async () => {
    await render(
      <InputField label="Prix" value="-1" onChangeText={jest.fn()} hint="Indiqué sur votre facture." error="Le prix doit être positif." />,
    );

    expect(screen.getByText('Le prix doit être positif.')).toBeOnTheScreen();
    expect(screen.queryByText('Indiqué sur votre facture.')).not.toBeOnTheScreen();
    expect(screen.getByLabelText('Prix')).toHaveStyle({ borderColor: colors.red });
  });
});

describe('ChipGroup', () => {
  const OPTIONS = [
    { id: 'S', label: 'Sud' },
    { id: 'E', label: 'Est' },
  ];

  it('marks the selected option', async () => {
    await render(<ChipGroup label="Orientation" options={OPTIONS} value="S" onChange={jest.fn()} />);

    expect(screen.getByRole('radio', { name: 'Sud' })).toBeSelected();
    expect(screen.getByRole('radio', { name: 'Est' })).not.toBeSelected();
  });

  it('sends the id of the option the user picks', async () => {
    const onChange = jest.fn();
    await render(<ChipGroup label="Orientation" options={OPTIONS} value="S" onChange={onChange} />);

    await user.press(screen.getByRole('radio', { name: 'Est' }));

    expect(onChange).toHaveBeenCalledWith('E');
  });
});

describe('StatCard', () => {
  it('shows a value with its unit and label', async () => {
    await render(<StatCard icon="zap" label="Production estimée" value="4 800" unit="kWh / an" />);

    expect(screen.getByText('4 800')).toBeOnTheScreen();
    expect(screen.getByText('kWh / an')).toBeOnTheScreen();
    expect(screen.getByText('Production estimée')).toBeOnTheScreen();
  });
});

describe('ProgressBar', () => {
  it.each([
    [42, '42%'],
    [-10, '0%'],
    [150, '100%'],
  ])('fills %d %% of the bar as %s (kept between 0 and 100)', async (value, width) => {
    await render(<ProgressBar value={value} />);

    expect(screen.root?.children[0]).toHaveStyle({ width });
  });
});

describe('ListRow', () => {
  it('shows a label, a sub-label and a value', async () => {
    await render(<ListRow label="Surface" sublabel="Toutes les surfaces" right={<Text>19 m²</Text>} />);

    expect(screen.getByText('Surface')).toBeOnTheScreen();
    expect(screen.getByText('Toutes les surfaces')).toBeOnTheScreen();
    expect(screen.getByText('19 m²')).toBeOnTheScreen();
  });

  it('calls onPress when the row is pressed', async () => {
    const onPress = jest.fn();
    await render(<ListRow label="Mon installation" onPress={onPress} />);

    await user.press(screen.getByText('Mon installation'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

describe('AlertBanner', () => {
  it('shows a warning message', async () => {
    await render(<AlertBanner message="Serveur indisponible." />);

    expect(screen.getByText('Serveur indisponible.')).toHaveStyle({ color: colors.amberText });
  });

  it('shows an error message in red', async () => {
    await render(<AlertBanner message="Erreur." type="error" />);

    expect(screen.getByText('Erreur.')).toHaveStyle({ color: colors.red });
  });
});

describe('ComingSoon', () => {
  it('describes the feature and the sprint it is planned for', async () => {
    await render(<ComingSoon title="Météo" icon="sun" text="Prévisions à 7 jours." sprint="sprint 3" />);

    expect(screen.getByText('Météo')).toBeOnTheScreen();
    expect(screen.getByText('Prévisions à 7 jours.')).toBeOnTheScreen();
    expect(screen.getByText('Prévu au sprint 3')).toBeOnTheScreen();
  });
});
