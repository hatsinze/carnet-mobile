import { View, Text, FlatList, Pressable, RefreshControl, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../../../src/components/ScreenHeader';
import { CommuniqueCardSkeleton } from '../../../src/components/Skeleton';
import { ErrorState } from '../../../src/components/ErrorState';
import { useTheme } from '../../../src/features/theme/ThemeContext';
import { useChildContext } from '../../../src/features/children/ChildContext';
import { useMinervalEleves } from '../../../src/hooks/useMinervalEleves';
import { useFinancialSummary } from '../../../src/hooks/useFinancialSummary';
import type { MinervalEleve } from '../../../src/types/finance';
import { fonts, radius, spacing } from '../../../src/theme/tokens';

const STATUT_CONFIG: Record<MinervalEleve['statut'], { label: string; icon: string }> = {
  a_jour: { label: 'À jour', icon: 'checkmark-circle-outline' },
  paye: { label: 'Payé', icon: 'checkmark-done-circle-outline' },
  en_retard: { label: 'En retard', icon: 'alert-circle-outline' },
  exonere: { label: 'Exonéré', icon: 'shield-checkmark-outline' },
};

export default function PaiementsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { selectedChild } = useChildContext();
  const { data: financial } = useFinancialSummary(selectedChild?.id);
  const { data, isLoading, isError, refetch, isRefetching, fetchNextPage, hasNextPage, isFetchingNextPage } = useMinervalEleves(selectedChild?.id);
  const items = data?.pages.flatMap((p) => p.data) ?? [];

  const progressPct = financial && financial.totalDue > 0 ? (financial.totalPaid / financial.totalDue) * 100 : 0;

  if (isError) return <ErrorState onRetry={refetch} />;

  return (
    <View style={[styles.container, { backgroundColor: colors.brume }]}>
      <ScreenHeader title="Paiements" showBack={false} />

      {financial && financial.echeanceCount > 0 && (
        <View style={[styles.summaryCard, { backgroundColor: colors.encreDark ?? '#0D3338' }]}>
          <Text style={styles.summaryLabel}>Solde restant</Text>
          <Text style={styles.summaryAmount}>{financial.remaining.toLocaleString('fr-FR')} FBu</Text>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.min(progressPct, 100)}%` }]} />
          </View>

          <View style={styles.summaryFootRow}>
            <View>
              <Text style={styles.summaryFootLabel}>Total dû</Text>
              <Text style={styles.summaryFootValue}>{financial.totalDue.toLocaleString('fr-FR')}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.summaryFootLabel}>Payé</Text>
              <Text style={[styles.summaryFootValue, { color: '#8FD9B6' }]}>{financial.totalPaid.toLocaleString('fr-FR')}</Text>
            </View>
          </View>

          {financial.enRetardCount > 0 && (
            <View style={styles.alertRow}>
              <Ionicons name="warning-outline" size={14} color="#F3A98E" />
              <Text style={styles.alertText}>{financial.enRetardCount} échéance(s) en retard</Text>
            </View>
          )}
        </View>
      )}

      {isLoading ? (
        <View style={styles.content}>{[1, 2, 3].map((i) => <CommuniqueCardSkeleton key={i} />)}</View>
      ) : items.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Ionicons name="wallet-outline" size={40} color={colors.ardoiseMuted} />
          <Text style={[styles.emptyText, { color: colors.ardoiseMuted }]}>Aucune échéance enregistrée.</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.encre} />}
          onEndReached={() => hasNextPage && fetchNextPage()}
          onEndReachedThreshold={0.4}
          ListFooterComponent={isFetchingNextPage ? <ActivityIndicator color={colors.encre} style={{ marginVertical: spacing.md }} /> : null}
          renderItem={({ item }) => {
            const config = STATUT_CONFIG[item.statut];
            const solde = item.montant_du - item.montant_paye;
            const isAlert = item.statut === 'en_retard';
            return (
              <Pressable onPress={() => router.push(`/(parent)/paiements/${item.id}`)}>
                <View style={[styles.card, { backgroundColor: colors.blanc, borderColor: colors.ligne }]}>
                  <View style={[styles.iconCircle, { backgroundColor: isAlert ? colors.briqueLight : colors.saugeLight }]}>
                    <Ionicons name={config.icon as any} size={20} color={isAlert ? colors.brique : colors.sauge} />
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={[styles.libelle, { color: colors.ardoise }]}>{item.echeance.libelle}</Text>
                    <Text style={[styles.meta, { color: colors.ardoiseMuted }]}>
                      {config.label}{solde > 0 ? ` · Solde ${solde.toLocaleString('fr-FR')} FBu` : ''}
                    </Text>
                  </View>
                  <Text style={[styles.amount, { color: colors.ardoise }]}>{item.montant_du.toLocaleString('fr-FR')}</Text>
                </View>
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  summaryCard: { marginHorizontal: spacing.lg, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.lg },
  summaryLabel: { fontFamily: fonts.bodyMedium, fontSize: 12, color: 'rgba(255,255,255,0.6)' },
  summaryAmount: { fontFamily: fonts.monoBold, fontSize: 32, color: '#FFFFFF', marginTop: 4 },
  progressTrack: { height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.15)', marginTop: spacing.md, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#8FD9B6', borderRadius: 3 },
  summaryFootRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.md },
  summaryFootLabel: { fontFamily: fonts.body, fontSize: 11, color: 'rgba(255,255,255,0.55)' },
  summaryFootValue: { fontFamily: fonts.monoSemiBold, fontSize: 14, color: '#FFFFFF', marginTop: 2 },
  alertRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.12)' },
  alertText: { fontFamily: fonts.bodyMedium, fontSize: 12, color: '#F3A98E' },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  emptyText: { fontFamily: fonts.body, fontSize: 13 },
  card: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, borderRadius: radius.md, borderWidth: 1, padding: spacing.md, marginBottom: spacing.sm },
  iconCircle: { width: 40, height: 40, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  cardInfo: { flex: 1, minWidth: 0 },
  libelle: { fontFamily: fonts.bodySemiBold, fontSize: 14 },
  meta: { fontFamily: fonts.body, fontSize: 12, marginTop: 2 },
  amount: { fontFamily: fonts.monoBold, fontSize: 16 },
});