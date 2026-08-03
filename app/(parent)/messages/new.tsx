import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../../../src/components/ScreenHeader';
import { Avatar } from '../../../src/components/Avatar';
import { LoadingState } from '../../../src/components/LoadingState';
import { ErrorState } from '../../../src/components/ErrorState';
import { useTheme } from '../../../src/features/theme/ThemeContext';
import { useChildContext } from '../../../src/features/children/ChildContext';
import { useContactableStaff } from '../../../src/hooks/useContactableStaff';
import { useStartConversation } from '../../../src/hooks/useConversations';
import type { ContactableStaff } from '../../../src/types/contact';
import type { ConversationType } from '../../../src/types/conversation';
import { fonts, radius, spacing } from '../../../src/theme/tokens';

const TYPES: { value: ConversationType; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { value: 'question_generale', label: 'Question', icon: 'help-circle-outline' },
  { value: 'demande_rdv', label: 'Rendez-vous', icon: 'calendar-outline' },
  { value: 'justification_absence', label: 'Absence', icon: 'document-text-outline' },
];

export default function NewConversationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { selectedChild } = useChildContext();
  const { data: staff, isLoading, isError, refetch } = useContactableStaff(selectedChild?.id);
  const startConversation = useStartConversation();

  const [selectedType, setSelectedType] = useState<ConversationType>('question_generale');
  const [selectedStaff, setSelectedStaff] = useState<ContactableStaff | null>(null);
  const [contenu, setContenu] = useState('');

  function handleSend() {
    if (!selectedChild || !selectedStaff || !contenu.trim()) return;
    startConversation.mutate(
      { eleve_id: selectedChild.id, destinataire_user_id: selectedStaff.user_id, type: selectedType, contenu: contenu.trim() },
      { onSuccess: (conversation) => router.replace(`/(parent)/messages/${conversation.id}`) }
    );
  }

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState onRetry={refetch} />;

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.brume }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScreenHeader title="Nouveau message" fallbackRoute="/(parent)/messages" />

      {!selectedStaff ? (
        <>
          {selectedChild && (
            <View style={[styles.childBanner, { backgroundColor: colors.encreLight }]}>
              <Text style={[styles.childBannerText, { color: colors.encre }]}>À propos de {selectedChild.prenom} {selectedChild.nom}</Text>
            </View>
          )}
          <Text style={[styles.pickLabel, { color: colors.ardoiseMuted }]}>À qui souhaitez-vous écrire ?</Text>
          <ScrollView contentContainerStyle={styles.contactList}>
            {staff?.map((s) => (
              <Pressable key={s.id} style={[styles.contactRow, { borderBottomColor: colors.ligne }]} onPress={() => setSelectedStaff(s)}>
                <Avatar name={`${s.prenom} ${s.nom}`} size={46} />
                <View style={styles.contactInfo}>
                  <Text style={[styles.contactName, { color: colors.ardoise }]}>{s.prenom} {s.nom}</Text>
                  <Text style={[styles.contactMeta, { color: colors.ardoiseMuted }]}>{s.matiere}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.ardoiseMuted} />
              </Pressable>
            ))}
          </ScrollView>
        </>
      ) : (
        <View style={{ flex: 1 }}>
          <Pressable style={styles.selectedRow} onPress={() => setSelectedStaff(null)}>
            <Avatar name={`${selectedStaff.prenom} ${selectedStaff.nom}`} size={40} />
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <Text style={[styles.contactName, { color: colors.ardoise }]}>{selectedStaff.prenom} {selectedStaff.nom}</Text>
              <Text style={[styles.contactMeta, { color: colors.ardoiseMuted }]}>{selectedStaff.matiere}</Text>
            </View>
            <Text style={[styles.changeLink, { color: colors.encre }]}>Changer</Text>
          </Pressable>

          <View style={styles.typeRow}>
            {TYPES.map((t) => {
              const active = t.value === selectedType;
              return (
                <Pressable key={t.value} style={[styles.typeChip, { backgroundColor: active ? colors.encre : colors.blanc, borderColor: active ? colors.encre : colors.ligne }]} onPress={() => setSelectedType(t.value)}>
                  <Ionicons name={t.icon} size={14} color={active ? '#FFFFFF' : colors.ardoiseMuted} />
                  <Text style={[styles.typeChipText, { color: active ? '#FFFFFF' : colors.ardoiseMuted }]}>{t.label}</Text>
                </Pressable>
              );
            })}
          </View>

          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
            <TextInput
              style={[styles.messageInput, { color: colors.ardoise }]}
              value={contenu}
              onChangeText={setContenu}
              placeholder="Écrivez votre message…"
              placeholderTextColor={colors.ardoiseMuted}
              multiline
              autoFocus
            />
          </ScrollView>

          <View style={[styles.sendRow, { borderTopColor: colors.ligne, paddingBottom: insets.bottom + spacing.sm }]}>
            <Pressable
              style={[styles.sendButton, { backgroundColor: colors.encre }, (!contenu.trim() || startConversation.isPending) && { opacity: 0.5 }]}
              onPress={handleSend}
              disabled={!contenu.trim() || startConversation.isPending}
            >
              <Ionicons name="send" size={16} color="#FFFFFF" />
              <Text style={styles.sendButtonText}>{startConversation.isPending ? 'Envoi…' : 'Envoyer'}</Text>
            </Pressable>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  childBanner: { marginHorizontal: spacing.lg, marginTop: spacing.md, borderRadius: radius.sm, paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  childBannerText: { fontFamily: fonts.bodySemiBold, fontSize: 12 },
  pickLabel: { fontFamily: fonts.bodyMedium, fontSize: 13, paddingHorizontal: spacing.lg, marginTop: spacing.lg, marginBottom: spacing.sm },
  contactList: { paddingHorizontal: spacing.lg },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md, borderBottomWidth: StyleSheet.hairlineWidth },
  contactInfo: { flex: 1, minWidth: 0 },
  contactName: { fontFamily: fonts.bodySemiBold, fontSize: 15 },
  contactMeta: { fontFamily: fonts.body, fontSize: 12, marginTop: 2 },
  selectedRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  changeLink: { fontFamily: fonts.bodySemiBold, fontSize: 12 },
  typeRow: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  typeChip: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: radius.lg, borderWidth: 1, paddingVertical: 6, paddingHorizontal: spacing.md },
  typeChipText: { fontFamily: fonts.bodyMedium, fontSize: 12 },
  messageInput: { flex: 1, fontFamily: fonts.body, fontSize: 16, paddingHorizontal: spacing.lg, paddingTop: spacing.sm, textAlignVertical: 'top', lineHeight: 22 },
  sendRow: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, borderTopWidth: StyleSheet.hairlineWidth },
  sendButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: radius.md, paddingVertical: spacing.md },
  sendButtonText: { fontFamily: fonts.bodySemiBold, fontSize: 14, color: '#FFFFFF' },
});