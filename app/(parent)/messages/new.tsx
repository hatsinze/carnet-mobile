import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../../../src/components/Button';
import { LoadingState } from '../../../src/components/LoadingState';
import { ErrorState } from '../../../src/components/ErrorState';
import { EmptyState } from '../../../src/components/EmptyState';
import { useChildContext } from '../../../src/features/children/ChildContext';
import { useContactableStaff } from '../../../src/hooks/useContactableStaff';
import { useStartConversation } from '../../../src/hooks/useConversations';
import type { ContactableStaff } from '../../../src/types/contact';
import type { ConversationType } from '../../../src/types/conversation';
import { colors, radius, spacing, typography } from '../../../src/theme/tokens';

const TYPES: { value: ConversationType; label: string }[] = [
  { value: 'justification_absence', label: "Justification d'absence" },
  { value: 'demande_rdv', label: 'Demande de rendez-vous' },
  { value: 'question_generale', label: 'Question générale' },
];

export default function NewConversationScreen() {
  const router = useRouter();
  const { selectedChild } = useChildContext();
  const { data: staff, isLoading, isError, refetch } = useContactableStaff(selectedChild?.id);
  const startConversation = useStartConversation();

  const [selectedType, setSelectedType] = useState<ConversationType>('question_generale');
  const [selectedStaff, setSelectedStaff] = useState<ContactableStaff | null>(null);
  const [contenu, setContenu] = useState('');

  function handleSend() {
    if (!selectedChild || !selectedStaff || !contenu.trim()) return;
    startConversation.mutate(
      {
        eleve_id: selectedChild.id,
        destinataire_user_id: selectedStaff.user_id,
        type: selectedType,
        contenu: contenu.trim(),
      },
      {
        onSuccess: (conversation) => {
          router.replace(`/(parent)/messages/${conversation.id}` as any);
        },
      }
    );
  }

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState onRetry={refetch} />;
  if (staff && staff.length === 0) {
    return <EmptyState message="Aucun contact disponible pour le moment." />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionLabel}>Sujet</Text>
      <View style={styles.pillRow}>
        {TYPES.map((t) => {
          const isActive = t.value === selectedType;
          return (
            <Pressable
              key={t.value}
              style={[styles.pill, isActive && styles.pillActive]}
              onPress={() => setSelectedType(t.value)}
            >
              <Text style={[styles.pillLabel, isActive && styles.pillLabelActive]}>{t.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.sectionLabel}>Destinataire</Text>
      {staff?.map((s) => {
        const isActive = selectedStaff?.id === s.id;
        return (
          <Pressable
            key={s.id}
            style={[styles.staffRow, isActive && styles.staffRowActive]}
            onPress={() => setSelectedStaff(s)}
          >
            <View>
              <Text style={styles.staffName}>{s.prenom} {s.nom}</Text>
              <Text style={styles.staffMatiere}>{s.matiere}</Text>
            </View>
          </Pressable>
        );
      })}

      <Text style={styles.sectionLabel}>Message</Text>
      <TextInput
        style={styles.textarea}
        value={contenu}
        onChangeText={setContenu}
        placeholder="Écrivez votre message…"
        placeholderTextColor={colors.ardoiseMuted}
        multiline
        numberOfLines={4}
      />

      <Button
        label="Envoyer"
        onPress={handleSend}
        disabled={!selectedStaff || !contenu.trim()}
        loading={startConversation.isPending}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.brume },
  content: { padding: spacing.lg, gap: spacing.md },
  sectionLabel: { ...typography.label, color: colors.ardoiseMuted, marginTop: spacing.md, marginBottom: spacing.xs },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  pill: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, borderRadius: radius.lg, backgroundColor: colors.blanc, borderWidth: 1, borderColor: colors.ligne },
  pillActive: { backgroundColor: colors.encre, borderColor: colors.encre },
  pillLabel: { fontSize: 13, fontWeight: '500', color: colors.ardoise },
  pillLabelActive: { color: colors.blanc },
  staffRow: { backgroundColor: colors.blanc, borderWidth: 1, borderColor: colors.ligne, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm },
  staffRowActive: { borderColor: colors.encre, borderWidth: 2 },
  staffName: { ...typography.body, fontWeight: '600', color: colors.ardoise },
  staffMatiere: { fontSize: 13, color: colors.ardoiseMuted, marginTop: 2 },
  textarea: { borderWidth: 1, borderColor: colors.ligne, borderRadius: radius.md, padding: spacing.md, fontSize: 15, color: colors.ardoise, backgroundColor: colors.blanc, textAlignVertical: 'top', minHeight: 100 },
});