import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { AlertBanner, Card, PrimaryButton, Screen, StatCard } from '../../components/ui';
import { useInstallation } from '../../context/InstallationContext';
import { computeNetCost, computeYieldPct, formatNumber, formatYearsAndMonths } from '../../domain/calculations';
import { useCalculations } from '../../hooks/useCalculations';
import { colors } from '../../theme';

/** Home dashboard (FCT-44, first version). */
export default function DashboardScreen() {
  const router = useRouter();
  const { installation, isLoading } = useInstallation();
  const calc = useCalculations(installation);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.amber} size="large" />
      </View>
    );
  }

  // No installation yet: welcome screen (replaces login/signup, see ADR-006).
  if (!installation) {
    return (
      <Screen footer={<PrimaryButton title="Décrire mon installation →" onPress={() => router.push('/installation/setup')} />}>
        <View style={styles.logoBlock}>
          <View style={styles.logo}>
            <Feather name="sun" size={32} color={colors.amber} />
          </View>
          <Text style={styles.appName}>App-solaire</Text>
          <Text style={styles.tagline}>Suivez votre production solaire</Text>
        </View>
        <Card style={styles.introCard}>
          <Text style={styles.introText}>
            Renseignez votre installation en 3 étapes pour connaître son rendement, sa production estimée et
            le temps qu’il faut pour la rentabiliser.
          </Text>
        </Card>
        <View style={styles.privacyRow}>
          <Feather name="lock" size={14} color={colors.slate} />
          <Text style={styles.privacy}>Vos données restent sur votre appareil.</Text>
        </View>
      </Screen>
    );
  }

  const yieldPct = computeYieldPct(installation.peakPowerWc, installation.surfaceM2);
  const result = calc.status === 'ok' ? calc.result : null;
  const dash = calc.status === 'loading' ? '…' : '—';
  const netCost = computeNetCost(installation.costEur, installation.subsidiesEur);
  const city = installation.address.split(',').pop()?.trim() || 'Ma position';

  return (
    <Screen>
      <View style={styles.header}>
        <View>
          <Text style={styles.hello}>Bonjour 👋</Text>
          <Text style={styles.title}>{installation.name}</Text>
        </View>
      </View>

      <View style={styles.chip}>
        <Feather name="map-pin" size={14} color={colors.amber} />
        <Text style={styles.chipText}>
          {city} · {formatNumber(installation.peakPowerWc / 1000, 1)} kWc
        </Text>
      </View>

      {calc.status === 'offline' ? (
        <AlertBanner message="Serveur de calcul indisponible : seules les valeurs calculées sur l’appareil sont affichées." />
      ) : null}

      <View style={styles.grid}>
        <StatCard icon="activity" label="Rendement des panneaux" value={formatNumber(result?.yieldPct ?? yieldPct, 1)} unit="%" />
        <StatCard
          icon="zap"
          label="Production estimée"
          value={result?.annualProductionKwh != null ? formatNumber(result.annualProductionKwh, 0) : dash}
          unit="kWh / an"
        />
        <StatCard
          icon="trending-up"
          label="Économies estimées"
          value={result?.annualSavingsEur != null ? formatNumber(result.annualSavingsEur, 0) : dash}
          unit="€ / an"
          accent={colors.green}
        />
        <StatCard
          icon="clock"
          label="Retour estimé"
          value={result?.paybackYears != null ? formatNumber(result.paybackYears, 1) : dash}
          unit="ans"
          accent={colors.slate}
        />
      </View>

      <Pressable onPress={() => router.push('/installation')}>
        <Card style={styles.payback}>
          <View style={styles.paybackHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Rentabilité</Text>
              <Text style={styles.cardSub}>{formatNumber(netCost, 0)} € investis (aides déduites)</Text>
            </View>
            <Feather name="chevron-right" size={16} color={colors.slate} />
          </View>
          <Text style={styles.cardSub}>
            {result?.paybackYears != null ? (
              <>
                Rentabilisé en <Text style={styles.greenStrong}>{formatYearsAndMonths(result.paybackYears)}</Text>
              </>
            ) : (
              'Le délai de rentabilité s’affichera dès que l’API répondra.'
            )}
          </Text>
        </Card>
      </Pressable>

      <Pressable onPress={() => router.push('/installation')} style={styles.link}>
        <Text style={styles.linkText}>Voir la fiche de mon installation →</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  logoBlock: { alignItems: 'center', marginTop: 40, marginBottom: 24 },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: colors.amberLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  appName: { fontSize: 26, fontWeight: '700', color: colors.dark },
  tagline: { fontSize: 14, color: colors.slate, marginTop: 4 },
  introCard: { padding: 16 },
  introText: { fontSize: 15, color: colors.dark, lineHeight: 22 },
  privacyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  privacy: { fontSize: 13, color: colors.slate },
  header: { flexDirection: 'row', justifyContent: 'space-between' },
  hello: { fontSize: 14, color: colors.slate },
  title: { fontSize: 22, fontWeight: '700', color: colors.dark },
  chip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: colors.amberLight,
    borderWidth: 1,
    borderColor: 'rgba(245,166,35,0.2)',
  },
  chipText: { fontSize: 13, color: colors.amberText, fontWeight: '500' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  payback: { padding: 16, gap: 8 },
  paybackHeader: { flexDirection: 'row', alignItems: 'center' },
  cardTitle: { fontSize: 14, fontWeight: '600', color: colors.dark },
  cardSub: { fontSize: 12, color: colors.slate, marginTop: 2 },
  greenStrong: { color: colors.green, fontWeight: '600' },
  link: { alignItems: 'center', paddingVertical: 8 },
  linkText: { color: colors.amber, fontWeight: '600', fontSize: 14 },
});
