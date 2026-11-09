import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';

import {
  BackHeader,
  Card,
  DestructiveButton,
  ListRow,
  PrimaryButton,
  Screen,
  SecondaryButton,
  SectionTitle,
} from '../../components/ui';
import { useInstallation } from '../../context/InstallationContext';
import { computeNetCost, computeYieldPct, formatNumber } from '../../domain/calculations';
import { getOrientationLabel, getPanelType } from '../../domain/panelTypes';
import { colors, MARGIN } from '../../theme';

function Value({ children, color = colors.dark }: { children: string; color?: string }) {
  return <Text style={[styles.value, { color }]}>{children}</Text>;
}

/** Installation summary sheet (FCT-14). */
export default function InstallationSheetScreen() {
  const router = useRouter();
  const { installation, remove } = useInstallation();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));

  if (!installation) {
    return (
      <Screen footer={<PrimaryButton title="Décrire mon installation →" onPress={() => router.replace('/installation/setup')} />}>
        <BackHeader title="Mon installation" onBack={goBack} />
        <Text style={styles.empty}>Aucune installation enregistrée sur cet appareil.</Text>
      </Screen>
    );
  }

  const panel = getPanelType(installation.panelType);
  const yieldPct = computeYieldPct(installation.peakPowerWc, installation.surfaceM2);
  const position = installation.coordinates
    ? `${formatNumber(installation.coordinates.latitude, 2)}, ${formatNumber(installation.coordinates.longitude, 2)}`
    : 'Non renseignée';

  const onDelete = async () => {
    setConfirmDelete(false);
    await remove();
    router.dismissTo('/');
  };

  return (
    <Screen>
      <BackHeader title={installation.name} onBack={goBack} />

      <Card style={styles.hero}>
        <Text style={styles.heroLabel}>Rendement des panneaux</Text>
        <Text style={styles.heroValue}>{formatNumber(yieldPct, 1)} %</Text>
        <Text style={styles.heroSub}>
          Valeur typique {panel.label.toLowerCase()} : {formatNumber(panel.typicalEfficiencyPct, 1)} %
        </Text>
      </Card>

      <SectionTitle>Localisation</SectionTitle>
      <Card style={styles.list}>
        <ListRow icon="map-pin" label="Adresse" right={<Value>{installation.address || 'Non renseignée'}</Value>} />
        <ListRow icon="navigation" label="Position (~1 km)" right={<Value>{position}</Value>} />
      </Card>

      <SectionTitle>Caractéristiques</SectionTitle>
      <Card style={styles.list}>
        <ListRow label="Type de panneau" right={<Value>{panel.label}</Value>} />
        <ListRow label="Nombre de panneaux" right={<Value>{String(installation.panelCount)}</Value>} />
        <ListRow label="Puissance crête" right={<Value>{`${formatNumber(installation.peakPowerWc / 1000, 2)} kWc`}</Value>} />
        <ListRow label="Surface" right={<Value>{`${formatNumber(installation.surfaceM2, 1)} m²`}</Value>} />
        <ListRow label="Orientation" right={<Value>{getOrientationLabel(installation.orientation)}</Value>} />
        <ListRow label="Inclinaison" right={<Value>{`${formatNumber(installation.tiltDeg, 0)}°`}</Value>} />
      </Card>

      <SectionTitle>Finances</SectionTitle>
      <Card style={styles.list}>
        <ListRow label="Coût d'installation" right={<Value>{`${formatNumber(installation.costEur, 0)} €`}</Value>} />
        <ListRow label="Aides perçues" right={<Value>{`${formatNumber(installation.subsidiesEur, 0)} €`}</Value>} />
        <ListRow
          label="Investissement net"
          right={<Value color={colors.green}>{`${formatNumber(computeNetCost(installation.costEur, installation.subsidiesEur), 0)} €`}</Value>}
        />
        <ListRow
          label="Prix de l'électricité"
          right={<Value>{`${formatNumber(installation.electricityPriceEurPerKwh, 3)} €/kWh`}</Value>}
        />
      </Card>

      <SecondaryButton title="Modifier mon installation" icon="edit-2" onPress={() => router.push('/installation/setup')} />
      <DestructiveButton title="Supprimer mon installation" onPress={() => setConfirmDelete(true)} />

      {/* Confirmation dialog from the mock-up (works on web and mobile, unlike Alert.alert). */}
      <Modal visible={confirmDelete} transparent animationType="fade" onRequestClose={() => setConfirmDelete(false)}>
        <View style={styles.overlay}>
          <Card style={styles.dialog}>
            <Text style={styles.dialogTitle}>Supprimer mon installation</Text>
            <Text style={styles.dialogText}>
              Cette action est irréversible. Toutes les données de l’installation seront supprimées de cet appareil.
            </Text>
            <DestructiveButton title="Confirmer la suppression" onPress={onDelete} />
            <SecondaryButton title="Annuler" onPress={() => setConfirmDelete(false)} />
          </Card>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  empty: { fontSize: 15, color: colors.slate },
  hero: { padding: 20, alignItems: 'center' },
  heroLabel: { fontSize: 13, color: colors.slate },
  heroValue: { fontSize: 40, fontWeight: '700', color: colors.amber, marginVertical: 6 },
  heroSub: { fontSize: 13, color: colors.slate },
  list: { overflow: 'hidden' },
  value: { fontSize: 14, fontWeight: '600', textAlign: 'right', maxWidth: 180 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: MARGIN,
  },
  dialog: { padding: 24, width: '100%', maxWidth: 420, gap: 10 },
  dialogTitle: { fontSize: 18, fontWeight: '700', color: colors.dark },
  dialogText: { fontSize: 14, color: colors.slate, lineHeight: 21, marginBottom: 10 },
});
