import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  BackHeader,
  Card,
  ChipGroup,
  InputField,
  LocationButton,
  PrimaryButton,
  Screen,
  StepProgress,
} from '../../components/ui';
import { useInstallation } from '../../context/InstallationContext';
import { computeYieldPct, formatNumber, parseFrenchNumber, roundCoordinates } from '../../domain/calculations';
import { getPanelType, ORIENTATIONS, PANEL_TYPES } from '../../domain/panelTypes';
import type { FormErrors, InstallationFormValues, Orientation, PanelTypeId } from '../../domain/types';
import { EMPTY_FORM, toFormValues, toInstallation, validateInstallation } from '../../domain/validation';
import { colors, radius } from '../../theme';

const STEPS: { label: string; fields: (keyof InstallationFormValues)[] }[] = [
  { label: 'Localisation', fields: ['address'] },
  { label: 'Caractéristiques', fields: ['panelCount', 'peakPowerKwc', 'surfaceM2', 'tiltDeg'] },
  { label: 'Finances', fields: ['costEur', 'subsidiesEur', 'electricityPriceEurPerKwh'] },
];

// Orientations offered in the mock-up (a north-facing roof is not worth equipping).
const FORM_ORIENTATIONS: Orientation[] = ['S', 'SE', 'SW', 'E', 'W'];

const toInput = (n: number) => String(Math.round(n * 100) / 100).replace('.', ',');

/** Installation setup in 3 steps (FCT-10, FCT-11, FCT-12), as in the mock-up. */
export default function InstallationSetupScreen() {
  const router = useRouter();
  const { installation, save } = useInstallation();
  const [step, setStep] = useState(1);
  const [values, setValues] = useState<InstallationFormValues>(installation ? toFormValues(installation) : EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);

  const set = <K extends keyof InstallationFormValues>(key: K, value: InstallationFormValues[K]) => {
    setValues((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
  };

  // FCT-11: the panel type and count pre-fill the peak power and the surface.
  const prefill = (panelType: PanelTypeId, panelCountRaw: string) => {
    const count = parseFrenchNumber(panelCountRaw);
    const type = getPanelType(panelType);
    setValues((previous) => ({
      ...previous,
      panelType,
      panelCount: panelCountRaw,
      ...(Number.isInteger(count) && count > 0
        ? {
            peakPowerKwc: toInput((count * type.unitPeakPowerWc) / 1000),
            surfaceM2: toInput(count * type.unitSurfaceM2),
          }
        : {}),
    }));
    setErrors((previous) => ({ ...previous, panelCount: undefined, peakPowerKwc: undefined, surfaceM2: undefined }));
  };

  const useMyPosition = async () => {
    setLocating(true);
    setLocationMessage(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationMessage('Autorisation refusée : saisissez plutôt votre adresse.');
        return;
      }
      const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low });
      const coords = roundCoordinates(position.coords);
      set('coordinates', coords);
      setErrors((previous) => ({ ...previous, address: undefined }));
      setLocationMessage(
        `Position enregistrée : ${formatNumber(coords.latitude, 2)}, ${formatNumber(coords.longitude, 2)} (arrondie à ~1 km).`,
      );
    } catch {
      setLocationMessage('Position indisponible : saisissez plutôt votre adresse.');
    } finally {
      setLocating(false);
    }
  };

  /** Validates only the fields of the current step, then moves on (or saves on the last step). */
  const next = async () => {
    const all = validateInstallation(values);
    const stepErrors: FormErrors = {};
    for (const field of STEPS[step - 1].fields) {
      if (all[field]) stepErrors[field] = all[field];
    }
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) {
      return;
    }
    if (step < STEPS.length) {
      setStep(step + 1);
      return;
    }
    setSaving(true);
    try {
      await save(toInstallation(values, installation));
      router.dismissTo('/');
    } finally {
      setSaving(false);
    }
  };

  const back = () => (step > 1 ? setStep(step - 1) : router.back());

  const power = parseFrenchNumber(values.peakPowerKwc) * 1000;
  const surface = parseFrenchNumber(values.surfaceM2);
  const previewYield = power > 0 && surface > 0 ? computeYieldPct(power, surface) : null;

  const footer = (
    <PrimaryButton
      title={step < STEPS.length ? 'Continuer →' : 'Enregistrer mon installation'}
      onPress={next}
      loading={saving}
      disabled={step === 1 && values.address.trim() === '' && values.coordinates === null}
    />
  );

  return (
    <Screen footer={footer}>
      <BackHeader title="Mon installation" onBack={back} />
      <StepProgress step={step} total={STEPS.length} label={STEPS[step - 1].label} />

      {step === 1 ? (
        <>
          <InputField
            label="Adresse de l'installation"
            value={values.address}
            onChangeText={(text) => set('address', text)}
            placeholder="12 rue des Lilas, Avignon 84000"
            error={errors.address}
          />
          <LocationButton
            title={values.coordinates ? 'Mettre à jour ma position' : 'Utiliser ma position'}
            onPress={useMyPosition}
            loading={locating}
          />
          {locationMessage ? <Text style={styles.hint}>{locationMessage}</Text> : null}
          <InputField
            label="Nom de l'installation (facultatif)"
            value={values.name}
            onChangeText={(text) => set('name', text)}
            placeholder="Ma maison"
          />
        </>
      ) : null}

      {step === 2 ? (
        <>
          <ChipGroup
            label="Type de panneau"
            options={PANEL_TYPES.map((type) => ({ id: type.id, label: type.label }))}
            value={values.panelType}
            onChange={(id) => prefill(id, values.panelCount)}
          />
          <View style={styles.row}>
            <View style={styles.half}>
              <InputField
                label="Nombre de panneaux"
                value={values.panelCount}
                onChangeText={(text) => prefill(values.panelType, text)}
                placeholder="12"
                keyboardType="number-pad"
                error={errors.panelCount}
              />
            </View>
            <View style={styles.half}>
              <InputField
                label="Puissance crête (kWc)"
                value={values.peakPowerKwc}
                onChangeText={(text) => set('peakPowerKwc', text)}
                placeholder="3,6"
                keyboardType="decimal-pad"
                error={errors.peakPowerKwc}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.half}>
              <InputField
                label="Surface (m²)"
                value={values.surfaceM2}
                onChangeText={(text) => set('surfaceM2', text)}
                placeholder="22"
                keyboardType="decimal-pad"
                error={errors.surfaceM2}
              />
            </View>
            <View style={styles.half}>
              <InputField
                label="Inclinaison (°)"
                value={values.tiltDeg}
                onChangeText={(text) => set('tiltDeg', text)}
                placeholder="30"
                keyboardType="number-pad"
                error={errors.tiltDeg}
              />
            </View>
          </View>
          <Text style={styles.hint}>Puissance et surface sont préremplies selon le type de panneau ; vous pouvez les corriger.</Text>
          <ChipGroup
            label="Orientation"
            options={ORIENTATIONS.filter((o) => FORM_ORIENTATIONS.includes(o.id)).map((o) => ({ id: o.id, label: o.label }))}
            value={values.orientation}
            onChange={(id) => set('orientation', id)}
          />
          {previewYield !== null ? (
            <View style={styles.preview}>
              <Text style={styles.previewLabel}>Rendement de vos panneaux</Text>
              <Text style={styles.previewValue}>{formatNumber(previewYield, 1)} %</Text>
            </View>
          ) : null}
        </>
      ) : null}

      {step === 3 ? (
        <>
          <InputField
            label="Coût d'installation (€)"
            value={values.costEur}
            onChangeText={(text) => set('costEur', text)}
            placeholder="8 900"
            keyboardType="decimal-pad"
            error={errors.costEur}
          />
          <InputField
            label="Aides perçues (€, facultatif)"
            value={values.subsidiesEur}
            onChangeText={(text) => set('subsidiesEur', text)}
            placeholder="0"
            keyboardType="decimal-pad"
            hint="Prime à l’autoconsommation, aides locales… déduites du coût."
            error={errors.subsidiesEur}
          />
          <InputField
            label="Prix de l'électricité (€/kWh)"
            value={values.electricityPriceEurPerKwh}
            onChangeText={(text) => set('electricityPriceEurPerKwh', text)}
            placeholder="0,22"
            keyboardType="decimal-pad"
            hint="Indiqué sur votre facture d’électricité."
            error={errors.electricityPriceEurPerKwh}
          />
          <Card style={styles.estimate}>
            <Text style={styles.estimateTitle}>Estimation automatique</Text>
            <Text style={styles.estimateText}>
              Les économies annuelles et le retour sur investissement sont calculés par notre serveur et
              s’afficheront sur votre tableau de bord.
            </Text>
          </Card>
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10 },
  half: { flex: 1 },
  hint: { fontSize: 12, color: colors.slate },
  preview: { backgroundColor: colors.amberLight, borderRadius: radius.input, padding: 14 },
  previewLabel: { fontSize: 13, color: colors.amberText, fontWeight: '500' },
  previewValue: { fontSize: 22, fontWeight: '700', color: colors.amberText, marginTop: 2 },
  estimate: { backgroundColor: colors.amberLight, borderWidth: 0, padding: 16, gap: 6 },
  estimateTitle: { fontSize: 13, color: colors.amberText, fontWeight: '500' },
  estimateText: { fontSize: 14, color: colors.slate, lineHeight: 20 },
});
