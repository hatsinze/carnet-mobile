import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { EmptyState } from "../../src/components/EmptyState";
import { ErrorState } from "../../src/components/ErrorState";
import { ProgressRing } from "../../src/components/ProgressRing";
import { SegmentedControl } from "../../src/components/SegmentedControl";
import { CommuniqueCardSkeleton } from "../../src/components/Skeleton";
import { useChildContext } from "../../src/features/children/ChildContext";
import { useTheme } from "../../src/features/theme/ThemeContext";
import { useMoyennes } from "../../src/hooks/useMoyennes";
import { usePeriodes } from "../../src/hooks/usePeriodes";
import { fonts, radius, spacing } from "../../src/theme/tokens";

export default function ResultatsScreen() {
  const { colors } = useTheme();
  const { selectedChild } = useChildContext();
  const { data: periodes } = usePeriodes();
  const [periodeId, setPeriodeId] = useState<string>("");

  useEffect(() => {
    if (!periodes?.length) return;
    setPeriodeId((current) => current || String(periodes[0].id));
  }, [periodes, periodeId]);

  const numericPeriodeId = periodeId ? Number(periodeId) : undefined;
  const {
    data: moyennes,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useMoyennes(selectedChild?.id, numericPeriodeId);

  // Safely calculate general average with null checks
  const generalAvg =
    moyennes && moyennes.length > 0
      ? moyennes.reduce(
          (sum, m) => sum + (m.moyenne ?? 0) * (m.coefficient ?? 1),
          0,
        ) / moyennes.reduce((sum, m) => sum + (m.coefficient ?? 1), 0)
      : null;
  const ringColor =
    generalAvg !== null
      ? generalAvg >= 10
        ? colors.sauge
        : colors.brique
      : colors.encre;

  const periodeOptions = (periodes ?? []).map((p) => ({
    value: String(p.id),
    label: p.nom,
  }));

  if (isError) return <ErrorState onRetry={refetch} />;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.brume }}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          tintColor={colors.encre}
        />
      }
    >
      <Text style={[styles.headerTitle, { color: colors.ardoise }]}>
        Résultats
      </Text>
      {selectedChild?.classe && (
        <Text style={[styles.headerSub, { color: colors.ardoiseMuted }]}>
          {selectedChild.classe.nom}
        </Text>
      )}

      {generalAvg !== null && (
        <View
          style={[
            styles.ringCard,
            { backgroundColor: colors.blanc, borderColor: colors.ligne },
          ]}
        >
          <ProgressRing
            value={(generalAvg / 20) * 100}
            color={ringColor}
            centerLabel={generalAvg.toFixed(1)}
            centerSubLabel="/ 20"
            size={100}
            strokeWidth={9}
          />
          <View style={{ flex: 1, marginLeft: spacing.lg }}>
            <Text style={[styles.ringLabel, { color: colors.ardoiseMuted }]}>
              Moyenne générale
            </Text>
            <Text style={[styles.ringSubtext, { color: colors.ardoise }]}>
              {moyennes?.length || 0} matière{moyennes?.length !== 1 ? "s" : ""}{" "}
              évaluée{moyennes?.length !== 1 ? "s" : ""}
            </Text>
          </View>
        </View>
      )}

      {periodeOptions.length > 0 && (
        <>
          <View style={{ height: spacing.lg }} />
          <SegmentedControl
            options={periodeOptions}
            value={periodeId}
            onChange={setPeriodeId}
          />
        </>
      )}

      <View style={{ height: spacing.xl }} />

      {isLoading ? (
        <>
          {[1, 2, 3].map((i) => (
            <CommuniqueCardSkeleton key={i} />
          ))}
        </>
      ) : !moyennes || moyennes.length === 0 ? (
        <EmptyState message="Aucune note enregistrée pour cette période." />
      ) : (
        moyennes.map((m) => {
          // Ensure moyenne is a valid number
          const moyenneValue = typeof m.moyenne === 'number' ? m.moyenne : 0;
          const isGood = moyenneValue >= 10;
          return (
            <View
              key={m.id}
              style={[
                styles.subjectCard,
                { backgroundColor: colors.blanc, borderColor: colors.ligne },
              ]}
            >
              <View
                style={[
                  styles.subjectIcon,
                  {
                    backgroundColor: isGood
                      ? colors.saugeLight
                      : colors.briqueLight,
                  },
                ]}
              >
                <Ionicons
                  name="book-outline"
                  size={18}
                  color={isGood ? colors.sauge : colors.brique}
                />
              </View>
              <View style={styles.subjectInfo}>
                <Text style={[styles.subjectName, { color: colors.ardoise }]}>
                  {m.matiere}
                </Text>
                <Text
                  style={[styles.subjectMeta, { color: colors.ardoiseMuted }]}
                >
                  Coef. {m.coefficient ?? "—"}
                  {m.rang_matiere !== null && m.rang_matiere !== undefined
                    ? ` · Rang ${m.rang_matiere}`
                    : ""}
                </Text>
              </View>
              <Text
                style={[
                  styles.subjectAvg,
                  { color: isGood ? colors.sauge : colors.brique },
                ]}
              >
                {typeof m.moyenne === 'number' && !isNaN(m.moyenne)
                  ? m.moyenne.toFixed(1)
                  : "—"}
              </Text>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  headerTitle: { fontFamily: fonts.displayBold, fontSize: 26 },
  headerSub: { fontFamily: fonts.body, fontSize: 13, marginTop: 2 },
  ringCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    marginTop: spacing.lg,
  },
  ringLabel: { fontFamily: fonts.bodyMedium, fontSize: 12 },
  ringSubtext: { fontFamily: fonts.bodySemiBold, fontSize: 15, marginTop: 4 },
  subjectCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  subjectIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  subjectInfo: { flex: 1, minWidth: 0 },
  subjectName: { fontFamily: fonts.bodySemiBold, fontSize: 14 },
  subjectMeta: { fontFamily: fonts.body, fontSize: 12, marginTop: 2 },
  subjectAvg: { fontFamily: fonts.monoBold, fontSize: 18 },
});
