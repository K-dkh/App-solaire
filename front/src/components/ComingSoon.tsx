import Feather from '@expo/vector-icons/Feather';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme';
import { BackHeader, Card, Screen } from './ui';
import type { IconName } from './ui';

/** Placeholder for a tab whose stories are planned in a later sprint. */
export function ComingSoon({ title, icon, text, sprint }: { title: string; icon: IconName; text: string; sprint: string }) {
  return (
    <Screen>
      <BackHeader title={title} />
      <Card style={styles.card}>
        <View style={styles.icon}>
          <Feather name={icon} size={28} color={colors.amber} />
        </View>
        <Text style={styles.text}>{text}</Text>
        <Text style={styles.sprint}>Prévu au {sprint}</Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { padding: 24, alignItems: 'center', gap: 10 },
  icon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.amberLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { fontSize: 15, color: colors.dark, textAlign: 'center', lineHeight: 22 },
  sprint: { fontSize: 12, color: colors.slate },
});
