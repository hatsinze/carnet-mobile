import { View, Text, FlatList, Linking, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../../../src/components/ScreenHeader';
import { LoadingState } from '../../../src/components/LoadingState';
import { ErrorState } from '../../../src/components/ErrorState';
import { useTheme } from '../../../src/features/theme/ThemeContext';
import { usePaiementsHistory } from '../../../src/hooks/usePaiementsHistory';
import { fonts, radius, spacing } from '../../../src/theme/tokens';

const MODE_LABELS: Record<string, string> = { especes: 'Espèces', virement: 'Virement', mobile_money: 'Mobile Money', cheque: 'Chèque' };
const MODE_ICONS: Record<string, string> = { especes: 'cash-outline', virement: 'swap-horizontal-outline', mobile_money: 'phone-portrait-outline', cheque: 'document-text-outline' };

export default function PaiementDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { data, isLoading, isError, refetch } = usePaiementsHistory(Number(id));

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState onRetry={refetch} />;

  return (
    <View style={[styles.container, { backgroundColor: colors.brume }]}>
      <ScreenHeader title="Détail du paiement" fallbackRoute="/(parent)/paiements" />

      {data && data.length === 0 && (
        <View style={styles.emptyWrap}>
          <Ionicons name="receipt-outline" size={40} color={colors.ardoiseMuted} />
          <Text style={[styles.emptyText, { color: colors.ardoiseMuted }]}>Aucun paiement enregistré pour cette échéance.</Text>
        </View>
      )}
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.content}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.blanc, borderColor: colors.ligne }]}>
            <View style={styles.row}>
              <View style={[styles.iconCircle, { backgroundColor: colors.saugeLight }]}>
                <Ionicons name={(MODE_ICONS[item.mode_paiement] ?? 'card-outline') as any} size={18} color={colors.sauge} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.amount, { color: colors.ardoise }]}>{item.montant.toLocaleString('fr-FR')} FBu</Text>
                <Text style={[styles.mode, { color: colors.ardoiseMuted }]}>{MODE_LABELS[item.mode_paiement] ?? item.mode_paiement}</Text>
              </View>
              <Text style={[styles.date, { color: colors.ardoiseMuted }]}>{item.paye_le}</Text>
            </View>
            {item.reference_transaction && (
              <Text style={[styles.reference, { color: colors.ardoiseMuted }]}>Réf : {item.reference_transaction}</Text>
            )}
            {item.recu && (
              <Pressable
                style={[styles.receiptButton, { borderColor: colors.encre }]}
                onPress={() => Linking.openURL(item.recu!.url_telechargement)}
              >
                <Ionicons name="download-outline" size={16} color={colors.encre} />
                <Text style={[styles.receiptButtonText, { color: colors.encre }]}>{item.recu.numero_recu}</Text>
              </Pressable>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  emptyText: { fontFamily: fonts.body, fontSize: 13 },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  card: { borderRadius: radius.md, borderWidth: 1, padding: spacing.md, marginBottom: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  iconCircle: { width: 38, height: 38, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  amount: { fontFamily: fonts.monoBold, fontSize: 16 },
  mode: { fontFamily: fonts.body, fontSize: 12, marginTop: 2 },
  date: { fontFamily: fonts.body, fontSize: 12 },
  reference: { fontFamily: fonts.body, fontSize: 11, marginTop: spacing.sm, marginLeft: 50 },
  receiptButton: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', borderWidth: 1, borderRadius: radius.sm, paddingVertical: 6, paddingHorizontal: spacing.md, marginTop: spacing.md, marginLeft: 50 },
  receiptButtonText: { fontFamily: fonts.bodySemiBold, fontSize: 12 },
});