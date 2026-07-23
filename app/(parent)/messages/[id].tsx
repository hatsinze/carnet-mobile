import { useState, useRef } from 'react';
import { View, Text, FlatList, TextInput, Pressable, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LoadingState } from '../../../src/components/LoadingState';
import { ErrorState } from '../../../src/components/ErrorState';
import { useAuth } from '../../../src/features/auth/AuthContext';
import { useConversation, useReplyConversation } from '../../../src/hooks/useConversations';
import { colors, radius, spacing, typography } from '../../../src/theme/tokens';

export default function ConversationThreadScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const conversationId = Number(id);
  const { user } = useAuth();
  const { data, isLoading, isError, refetch } = useConversation(conversationId);
  const reply = useReplyConversation(conversationId);
  const [text, setText] = useState('');
  const listRef = useRef<FlatList>(null);

  function handleSend() {
    if (!text.trim()) return;
    reply.mutate(text.trim(), {
      onSuccess: () => {
        setText('');
        setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
      },
    });
  }

  if (isLoading) return <LoadingState />;
  if (isError || !data) return <ErrorState onRetry={refetch} />;

  const isClosed = data.statut === 'fermee';

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={listRef}
        data={data.messages ?? []}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.messages}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        renderItem={({ item }) => {
          const isMine = item.expediteur.id === user?.id;
          return (
            <View style={[styles.bubbleRow, isMine && styles.bubbleRowMine]}>
              <View style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleTheirs]}>
                {!isMine && <Text style={styles.senderName}>{item.expediteur.name}</Text>}
                <Text style={[styles.bubbleText, isMine && styles.bubbleTextMine]}>{item.contenu}</Text>
                <Text style={[styles.timestamp, isMine && styles.timestampMine]}>{item.envoye_le}</Text>
              </View>
            </View>
          );
        }}
      />

      {isClosed ? (
        <View style={styles.closedBanner}>
          <Text style={styles.closedText}>Cette conversation est fermée.</Text>
        </View>
      ) : (
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Écrire un message…"
            placeholderTextColor={colors.ardoiseMuted}
            multiline
          />
          <Pressable
            style={[styles.sendButton, (!text.trim() || reply.isPending) && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!text.trim() || reply.isPending}
          >
            <Ionicons name="send" size={20} color={colors.blanc} />
          </Pressable>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.brume },
  messages: { padding: spacing.lg, gap: spacing.sm },
  bubbleRow: { flexDirection: 'row', marginBottom: spacing.sm },
  bubbleRowMine: { justifyContent: 'flex-end' },
  bubble: { maxWidth: '80%', borderRadius: radius.md, padding: spacing.md },
  bubbleTheirs: { backgroundColor: colors.blanc, borderWidth: 1, borderColor: colors.ligne },
  bubbleMine: { backgroundColor: colors.encre },
  senderName: { fontSize: 12, fontWeight: '600', color: colors.encre, marginBottom: spacing.xs },
  bubbleText: { ...typography.body, color: colors.ardoise },
  bubbleTextMine: { color: colors.blanc },
  timestamp: { fontSize: 11, color: colors.ardoiseMuted, marginTop: spacing.xs },
  timestampMine: { color: 'rgba(255,255,255,0.7)' },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', padding: spacing.md, borderTopWidth: 1, borderTopColor: colors.ligne, backgroundColor: colors.blanc, gap: spacing.sm },
  input: { flex: 1, borderWidth: 1, borderColor: colors.ligne, borderRadius: radius.md, padding: spacing.md, maxHeight: 100, fontSize: 15, color: colors.ardoise },
  sendButton: { backgroundColor: colors.encre, borderRadius: radius.md, width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  sendButtonDisabled: { opacity: 0.5 },
  closedBanner: { padding: spacing.lg, alignItems: 'center', backgroundColor: colors.blanc, borderTopWidth: 1, borderTopColor: colors.ligne },
  closedText: { ...typography.body, color: colors.ardoiseMuted },
});