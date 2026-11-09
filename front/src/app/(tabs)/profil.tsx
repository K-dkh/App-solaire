import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Card, ListRow, Screen, SectionTitle } from '../../components/ui';
import { useInstallation } from '../../context/InstallationContext';
import { colors } from '../../theme';

// No server account (ADR-006): the profile shows the local installation and data options.
// Account features (FCT-04, FCT-05, FCT-06) wait for the PO's answer on multi-device use.
export default function ProfileScreen() {
  const router = useRouter();
  const { installation } = useInstallation();

  return (
    <Screen>
      <View style={styles.avatarBlock}>
        <View style={styles.avatar}>
          <Feather name="user" size={32} color={colors.amber} />
        </View>
        <Text style={styles.name}>{installation?.name ?? 'Mon profil'}</Text>
        <Text style={styles.sub}>Données enregistrées sur cet appareil</Text>
      </View>

      <SectionTitle>Installation</SectionTitle>
      <Card style={styles.list}>
        <ListRow
          icon="zap"
          color={colors.amber}
          label="Mon installation"
          sublabel={installation ? installation.address || 'Position GPS' : 'Aucune installation'}
          onPress={() => router.push(installation ? '/installation' : '/installation/setup')}
        />
      </Card>

      <SectionTitle>Données</SectionTitle>
      <Card style={styles.list}>
        <ListRow icon="download" label="Exporter mes données" sublabel="Bientôt disponible" />
        <ListRow icon="lock" label="Confidentialité" sublabel="L’entreprise n’a pas accès à vos données" />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  avatarBlock: { alignItems: 'center', paddingBottom: 6 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.amberLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  name: { fontSize: 18, fontWeight: '700', color: colors.dark },
  sub: { fontSize: 14, color: colors.slate },
  list: { overflow: 'hidden' },
});
