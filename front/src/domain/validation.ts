import { parseFrenchNumber } from './calculations';
import type { FormErrors, Installation, InstallationFormValues } from './types';

type NumericRule = {
  field: keyof InstallationFormValues;
  label: string;
  min?: number;
  max?: number;
  strictlyPositive?: boolean;
  integer?: boolean;
  optional?: boolean;
};

const NUMERIC_RULES: NumericRule[] = [
  { field: 'panelCount', label: 'Le nombre de panneaux', strictlyPositive: true, integer: true, max: 1000 },
  { field: 'peakPowerKwc', label: 'La puissance crête', strictlyPositive: true, max: 1000 },
  { field: 'surfaceM2', label: 'La surface', strictlyPositive: true },
  { field: 'tiltDeg', label: "L'inclinaison", min: 0, max: 90 },
  { field: 'costEur', label: 'Le coût', strictlyPositive: true },
  { field: 'subsidiesEur', label: 'Le montant des aides', min: 0, optional: true },
  { field: 'electricityPriceEurPerKwh', label: 'Le prix du kWh', strictlyPositive: true, max: 5 },
];

/** Validates the installation form (FCT-10, FCT-12). Returns an empty object when valid. */
export function validateInstallation(values: InstallationFormValues): FormErrors {
  const errors: FormErrors = {};

  if (values.address.trim() === '' && values.coordinates === null) {
    errors.address = 'Indiquez une adresse ou utilisez votre position.';
  }

  for (const rule of NUMERIC_RULES) {
    const raw = String(values[rule.field] ?? '');
    if (rule.optional && raw.trim() === '') {
      continue;
    }
    const value = parseFrenchNumber(raw);
    if (Number.isNaN(value)) {
      errors[rule.field] = `${rule.label} est obligatoire et doit être un nombre.`;
    } else if (rule.strictlyPositive && value <= 0) {
      errors[rule.field] = `${rule.label} doit être strictement positif.`;
    } else if (rule.integer && !Number.isInteger(value)) {
      errors[rule.field] = `${rule.label} doit être un nombre entier.`;
    } else if (rule.min !== undefined && value < rule.min) {
      errors[rule.field] = `${rule.label} doit être supérieur ou égal à ${rule.min}.`;
    } else if (rule.max !== undefined && value > rule.max) {
      errors[rule.field] = `${rule.label} doit être inférieur ou égal à ${rule.max}.`;
    }
  }

  const cost = parseFrenchNumber(values.costEur);
  const subsidies = parseFrenchNumber(values.subsidiesEur || '0');
  if (!errors.subsidiesEur && !Number.isNaN(cost) && subsidies > cost) {
    errors.subsidiesEur = 'Les aides ne peuvent pas dépasser le coût.';
  }

  return errors;
}

/** Builds the Installation stored on the device from valid form values. */
export function toInstallation(
  values: InstallationFormValues,
  existing?: Installation | null,
): Installation {
  const now = new Date().toISOString();
  return {
    id: existing?.id ?? `inst-${Date.now()}`,
    name: values.name.trim() || 'Mon installation',
    address: values.address.trim(),
    coordinates: values.coordinates,
    panelType: values.panelType,
    panelCount: parseFrenchNumber(values.panelCount),
    peakPowerWc: Math.round(parseFrenchNumber(values.peakPowerKwc) * 1000),
    surfaceM2: parseFrenchNumber(values.surfaceM2),
    orientation: values.orientation,
    tiltDeg: parseFrenchNumber(values.tiltDeg),
    costEur: parseFrenchNumber(values.costEur),
    subsidiesEur: values.subsidiesEur.trim() === '' ? 0 : parseFrenchNumber(values.subsidiesEur),
    electricityPriceEurPerKwh: parseFrenchNumber(values.electricityPriceEurPerKwh),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
}

/** Converts a stored installation back to form values (used to edit it). */
export function toFormValues(installation: Installation): InstallationFormValues {
  const str = (n: number) => String(n).replace('.', ',');
  return {
    name: installation.name,
    address: installation.address,
    coordinates: installation.coordinates,
    panelType: installation.panelType,
    panelCount: str(installation.panelCount),
    peakPowerKwc: str(installation.peakPowerWc / 1000),
    surfaceM2: str(installation.surfaceM2),
    orientation: installation.orientation,
    tiltDeg: str(installation.tiltDeg),
    costEur: str(installation.costEur),
    subsidiesEur: installation.subsidiesEur ? str(installation.subsidiesEur) : '',
    electricityPriceEurPerKwh: str(installation.electricityPriceEurPerKwh),
  };
}

export const EMPTY_FORM: InstallationFormValues = {
  name: '',
  address: '',
  coordinates: null,
  panelType: 'monocrystalline',
  panelCount: '',
  peakPowerKwc: '',
  surfaceM2: '',
  orientation: 'S',
  tiltDeg: '30',
  costEur: '',
  subsidiesEur: '',
  electricityPriceEurPerKwh: '',
};
