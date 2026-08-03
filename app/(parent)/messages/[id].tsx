import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ErrorState } from "../../../src/components/ErrorState";
import { LoadingState } from "../../../src/components/LoadingState";
import { ScreenHeader } from "../../../src/components/ScreenHeader";
import { useAuth } from "../../../src/features/auth/AuthContext";
import { useTheme } from "../../../src/features/theme/ThemeContext";
import {
  useConversation,
  useMarkConversationRead,
  useReplyConversation,
} from "../../../src/hooks/useConversations";
import { fonts, radius, spacing } from "../../../src/theme/tokens";
import type { Message } from "../../../src/types/conversation";

type Row =
  | { kind: "separator"; label: string; id: string }
  | { kind: "message"; message: Message; id: string };

export default function ConversationThreadScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const conversationId = Number(id);
  const { user } = useAuth();
  const { data, isLoading, isError, refetch } = useConversation(conversationId);
  const reply = useReplyConversation(conversationId);
  const markRead = useMarkConversationRead();
  const [text, setText] = useState("");
  const [headerHeight, setHeaderHeight] = useState(0);
  const listRef = useRef<FlatList>(null);

  // Mark conversation as read when opened
  useEffect(() => {
    if (!data) return;
    if ((data.unread_count ?? 0) > 0) {
      markRead.mutate(conversationId);
    }
  }, [conversationId, data, markRead]);

  const rows = useMemo<Row[]>(() => {
    if (!data?.messages) return [];
    const out: Row[] = [];
    let lastDay = "";
    for (const m of data.messages) {
      const day = m.envoye_le.split(" ")[0];
      if (day !== lastDay) {
        out.push({
          kind: "separator",
          label: new Date(day).toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
          }),
          id: `sep-${day}`,
        });
        lastDay = day;
      }
      out.push({ kind: "message", message: m, id: String(m.id) });
    }
    return out;
  }, [data?.messages]);

  function handleSend() {
    if (!text.trim()) return;
    reply.mutate(text.trim(), {
      onSuccess: () => {
        setText("");
        setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
      },
    });
  }

  if (isLoading) return <LoadingState />;
  if (isError || !data) return <ErrorState onRetry={refetch} />;

  const isClosed = data.statut === "fermee";

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.brume }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={headerHeight}
    >
      <View onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}>
        <ScreenHeader
          title={`${data.eleve.prenom} ${data.eleve.nom}`}
          fallbackRoute="/(parent)/messages"
        />
      </View>

      <FlatList
        ref={listRef}
        data={rows}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messages}
        onContentSizeChange={() =>
          listRef.current?.scrollToEnd({ animated: false })
        }
        renderItem={({ item }) => {
          if (item.kind === "separator") {
            return (
              <View style={styles.separatorWrap}>
                <View
                  style={[
                    styles.separatorPill,
                    { backgroundColor: colors.ligne },
                  ]}
                >
                  <Text
                    style={[
                      styles.separatorText,
                      { color: colors.ardoiseMuted },
                    ]}
                  >
                    {item.label}
                  </Text>
                </View>
              </View>
            );
          }
          const isMine = item.message.expediteur.id === user?.id;
          return (
            <View style={[styles.bubbleRow, isMine && styles.bubbleRowMine]}>
              <View
                style={[
                  styles.bubble,
                  isMine
                    ? { backgroundColor: colors.encre }
                    : {
                        backgroundColor: colors.blanc,
                        borderWidth: 1,
                        borderColor: colors.ligne,
                      },
                ]}
              >
                {!isMine && (
                  <Text style={[styles.senderName, { color: colors.encre }]}>
                    {item.message.expediteur.name}
                  </Text>
                )}
                <Text
                  style={[
                    styles.bubbleText,
                    { color: isMine ? "#FFFFFF" : colors.ardoise },
                  ]}
                >
                  {item.message.contenu}
                </Text>
                <Text
                  style={[
                    styles.timestamp,
                    {
                      color: isMine
                        ? "rgba(255,255,255,0.7)"
                        : colors.ardoiseMuted,
                    },
                  ]}
                >
                  {item.message.envoye_le.split(" ")[1]?.slice(0, 5)}
                </Text>
              </View>
            </View>
          );
        }}
      />

      {isClosed ? (
        <View
          style={[
            styles.closedBanner,
            { backgroundColor: colors.blanc, borderTopColor: colors.ligne },
          ]}
        >
          <Text style={[styles.closedText, { color: colors.ardoiseMuted }]}>
            Cette conversation est fermée.
          </Text>
        </View>
      ) : (
        <View
          style={[
            styles.inputRow,
            {
              backgroundColor: colors.blanc,
              borderTopColor: colors.ligne,
              paddingBottom: insets.bottom + spacing.sm,
            },
          ]}
        >
          <TextInput
            style={[
              styles.input,
              { borderColor: colors.ligne, color: colors.ardoise },
            ]}
            value={text}
            onChangeText={setText}
            placeholder="Écrire un message…"
            placeholderTextColor={colors.ardoiseMuted}
            multiline
          />
          <Pressable
            style={[
              styles.sendButton,
              { backgroundColor: colors.encre },
              (!text.trim() || reply.isPending) && { opacity: 0.5 },
            ]}
            onPress={handleSend}
            disabled={!text.trim() || reply.isPending}
          >
            <Ionicons name="send" size={18} color="#FFFFFF" />
          </Pressable>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  messages: { padding: spacing.lg, gap: spacing.xs },
  separatorWrap: { alignItems: "center", marginVertical: spacing.md },
  separatorPill: {
    borderRadius: radius.lg,
    paddingVertical: 4,
    paddingHorizontal: spacing.md,
  },
  separatorText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    textTransform: "capitalize",
  },
  bubbleRow: { flexDirection: "row", marginBottom: spacing.sm },
  bubbleRowMine: { justifyContent: "flex-end" },
  bubble: { maxWidth: "78%", borderRadius: radius.md, padding: spacing.md },
  senderName: { fontSize: 12, fontFamily: fonts.bodySemiBold, marginBottom: 4 },
  bubbleText: { fontFamily: fonts.body, fontSize: 15, lineHeight: 21 },
  timestamp: { fontSize: 10, marginTop: 4, textAlign: "right" },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: spacing.md,
    borderTopWidth: 1,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    maxHeight: 100,
    fontFamily: fonts.body,
    fontSize: 15,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
  },
  closedBanner: {
    padding: spacing.lg,
    alignItems: "center",
    borderTopWidth: 1,
  },
  closedText: { fontFamily: fonts.body, fontSize: 13 },
});
