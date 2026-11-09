import Feather from '@expo/vector-icons/Feather';
import type { ComponentProps, ReactNode } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { KeyboardTypeOptions, StyleProp, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, MARGIN, radius, shadow } from '../theme';

export type IconName = ComponentProps<typeof Feather>['name'];

/** Scrollable page. On the web the content is capped at phone-like width, as in the mock-up. */
export function Screen({ children, footer }: { children: ReactNode; footer?: ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.screenContent} keyboardShouldPersistTaps="handled">
        <View style={styles.column}>{children}</View>
      </ScrollView>
      {footer ? (
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <View style={styles.column}>{footer}</View>
        </View>
      ) : null}
    </View>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function BackHeader({ title, onBack }: { title: string; onBack?: () => void }) {
  return (
    <View style={styles.backHeader}>
      {onBack ? (
        <Pressable onPress={onBack} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Retour">
          <Feather name="chevron-left" size={20} color={colors.dark} />
        </Pressable>
      ) : null}
      <Text style={styles.backTitle}>{title}</Text>
    </View>
  );
}

/** "Étape n sur 3" progress bar used by the installation setup. */
export function StepProgress({ step, total, label }: { step: number; total: number; label: string }) {
  return (
    <View style={{ marginBottom: 8 }}>
      <View style={styles.steps}>
        {Array.from({ length: total }, (_, i) => (
          <View key={i} style={[styles.stepBar, { backgroundColor: i < step ? colors.amber : colors.muted }]} />
        ))}
      </View>
      <Text style={styles.stepLabel}>
        Étape {step} sur {total} — {label}
      </Text>
    </View>
  );
}

interface ButtonProps {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: IconName;
}

export function PrimaryButton({ title, onPress, disabled, loading }: ButtonProps) {
  const off = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={off}
      accessibilityRole="button"
      style={({ pressed }) => [styles.button, { backgroundColor: off ? colors.muted : colors.amber }, pressed && styles.pressed]}
    >
      {loading ? (
        <ActivityIndicator color={colors.surface} />
      ) : (
        <Text style={[styles.buttonText, { color: off ? colors.slate : colors.surface }]}>{title}</Text>
      )}
    </Pressable>
  );
}

export function SecondaryButton({ title, onPress, icon }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.button, styles.secondary, pressed && styles.pressed]}
    >
      {icon ? <Feather name={icon} size={16} color={colors.amber} /> : null}
      <Text style={[styles.buttonText, { color: colors.amber }]}>{title}</Text>
    </Pressable>
  );
}

export function DestructiveButton({ title, onPress, icon = 'trash-2' }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.button, styles.destructive, pressed && styles.pressed]}
    >
      <Feather name={icon} size={16} color={colors.red} />
      <Text style={[styles.buttonText, { color: colors.red }]}>{title}</Text>
    </Pressable>
  );
}

/** Green dashed "Utiliser ma position" button from step 1 of the mock-up. */
export function LocationButton({ title, onPress, loading }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      accessibilityRole="button"
      style={({ pressed }) => [styles.locationButton, pressed && styles.pressed]}
    >
      {loading ? <ActivityIndicator color={colors.green} /> : <Feather name="navigation" size={16} color={colors.green} />}
      <Text style={styles.locationText}>{title}</Text>
    </Pressable>
  );
}

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  hint?: string;
  keyboardType?: KeyboardTypeOptions;
}

export function InputField({ label, value, onChangeText, placeholder, error, hint, keyboardType }: InputFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, { borderColor: error ? colors.red : colors.border }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        keyboardType={keyboardType}
        accessibilityLabel={label}
      />
      {error ? (
        <View style={styles.errorRow}>
          <Feather name="alert-circle" size={12} color={colors.red} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}
    </View>
  );
}

interface ChipGroupProps<T extends string> {
  label: string;
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
}

export function ChipGroup<T extends string>({ label, options, value, onChange }: ChipGroupProps<T>) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.chips}>
        {options.map((option) => {
          const selected = option.id === value;
          return (
            <Pressable
              key={option.id}
              onPress={() => onChange(option.id)}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              style={[styles.chip, selected && styles.chipSelected]}
            >
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

interface StatCardProps {
  icon: IconName;
  label: string;
  value: string;
  unit: string;
  accent?: string;
}

export function StatCard({ icon, label, value, unit, accent = colors.amber }: StatCardProps) {
  return (
    <View style={[styles.card, styles.stat]}>
      <Feather name={icon} size={18} color={accent} style={{ marginBottom: 10 }} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={[styles.statUnit, { color: accent }]}>{unit}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export function ProgressBar({ value, color = colors.amber }: { value: number; color?: string }) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${Math.max(0, Math.min(value, 100))}%`, backgroundColor: color }]} />
    </View>
  );
}

interface ListRowProps {
  label: string;
  sublabel?: string;
  icon?: IconName;
  right?: ReactNode;
  color?: string;
  onPress?: () => void;
}

export function ListRow({ label, sublabel, icon, right, color, onPress }: ListRowProps) {
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={styles.listRow}>
      {icon ? <Feather name={icon} size={18} color={color ?? colors.slate} /> : null}
      <View style={{ flex: 1 }}>
        <Text style={[styles.listLabel, color ? { color } : null]}>{label}</Text>
        {sublabel ? <Text style={styles.listSublabel}>{sublabel}</Text> : null}
      </View>
      {right ?? (onPress ? <Feather name="chevron-right" size={16} color={colors.slate} /> : null)}
    </Pressable>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

export function AlertBanner({ message, type = 'warning' }: { message: string; type?: 'warning' | 'error' }) {
  const warning = type === 'warning';
  return (
    <View style={[styles.banner, { backgroundColor: warning ? colors.amberLight : colors.redLight }]}>
      <Feather name="alert-circle" size={15} color={warning ? colors.amber : colors.red} />
      <Text style={[styles.bannerText, { color: warning ? colors.amberText : colors.red }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  screenContent: { paddingHorizontal: MARGIN, paddingTop: 20, paddingBottom: 24, alignItems: 'center' },
  column: { width: '100%', maxWidth: 480, gap: 14 },
  footer: { paddingHorizontal: MARGIN, paddingTop: 12, alignItems: 'center', backgroundColor: colors.background },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow,
  },
  backHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backTitle: { fontSize: 18, fontWeight: '600', color: colors.dark },
  steps: { flexDirection: 'row', gap: 6, marginBottom: 12 },
  stepBar: { flex: 1, height: 4, borderRadius: radius.pill },
  stepLabel: { fontSize: 13, color: colors.slate },
  button: {
    minHeight: 48,
    borderRadius: radius.button,
    paddingHorizontal: 24,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  pressed: { opacity: 0.8 },
  buttonText: { fontSize: 16, fontWeight: '600' },
  secondary: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.amber },
  destructive: { backgroundColor: colors.redLight, borderWidth: 1.5, borderColor: 'rgba(220,38,38,0.2)' },
  locationButton: {
    minHeight: 48,
    borderRadius: radius.input,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'rgba(31,122,77,0.4)',
    backgroundColor: colors.greenLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  locationText: { color: colors.green, fontWeight: '500', fontSize: 15 },
  field: { gap: 6 },
  label: { fontSize: 13, fontWeight: '500', color: colors.dark },
  input: {
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: radius.input,
    borderWidth: 1.5,
    backgroundColor: colors.surface,
    color: colors.dark,
    fontSize: 16,
  },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  errorText: { fontSize: 12, color: colors.red, flexShrink: 1 },
  hint: { fontSize: 12, color: colors.slate },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radius.chip,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipSelected: { backgroundColor: colors.amberLight, borderColor: colors.amber },
  chipText: { fontSize: 13, color: colors.dark },
  chipTextSelected: { color: colors.amberText, fontWeight: '600' },
  stat: { flexGrow: 1, flexBasis: '45%', paddingVertical: 16, paddingHorizontal: 14 },
  statValue: { fontSize: 28, fontWeight: '700', color: colors.dark },
  statUnit: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  statLabel: { fontSize: 12, color: colors.slate, marginTop: 4 },
  progressTrack: { height: 8, backgroundColor: colors.muted, borderRadius: radius.pill, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: radius.pill },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 52,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  listLabel: { fontSize: 15, fontWeight: '500', color: colors.dark },
  listSublabel: { fontSize: 12, color: colors.slate, marginTop: 1 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.slate,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    marginBottom: -6,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radius.input,
  },
  bannerText: { fontSize: 13, flexShrink: 1 },
});
