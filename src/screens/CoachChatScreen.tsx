import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { aiCoachEnabled } from "@/constants/featureFlags";
import { useCoach } from "@/context/CoachContext";
import { useTheme } from "@/context/ThemeContext";
import { askCoachQuestion } from "@/services/aiCoachChat";

type MessageRole = "user" | "assistant" | "system";

type Message = {
  id: string;
  role: MessageRole;
  content: string;
};

const CoachChatScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const {
    state: { profile },
  } = useCoach();
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: "welcome",
      role: "assistant",
      content: t("coachAI.subtitle"),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList<Message>>(null);

  const suggestions = useMemo(
    () => [
      t("coachAI.suggestions.focus"),
      t("coachAI.suggestions.calories"),
      t("coachAI.suggestions.recovery"),
    ],
    [t],
  );

  const handleSend = async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || loading) {
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const answer = await askCoachQuestion({
        question: trimmed,
        profile,
        locale: "tr",
      });
      const assistantMessage: Message = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: answer,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const assistantMessage: Message = {
        id: `ai-error-${Date.now()}`,
        role: "assistant",
        content:
          error instanceof Error
            ? `Bir hata oluştu: ${error.message}`
            : "Şu an yanıt veremiyorum. Lütfen tekrar dene.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setLoading(false);
      requestAnimationFrame(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      });
    }
  };

  if (!aiCoachEnabled) {
    return (
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.disabledContainer}>
          <View
            style={[styles.disabledIcon, { backgroundColor: theme.colors.card }]}
          >
            <Ionicons
              name="chatbox-ellipses-outline"
              size={28}
              color={theme.colors.subText}
            />
          </View>
          <Text style={[styles.disabledTitle, { color: theme.colors.text }]}>
            {t("coachAI.disabledTitle", "AI Koçu geçici olarak devre dışı")}
          </Text>
          <Text
            style={[styles.disabledSubtitle, { color: theme.colors.subText }]}
          >
            {t(
              "coachAI.disabledSubtitle",
              "Bu özellik üzerinde çalışıyoruz. Lütfen yakında tekrar kontrol et.",
            )}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.role === "user";
    const bubbleStyle = isUser
      ? [styles.userBubble, { backgroundColor: theme.colors.accent }]
      : [styles.aiBubble, { backgroundColor: theme.colors.surface }];
    const textColor = isUser ? theme.colors.background : theme.colors.text;

    return (
      <View style={[styles.messageRow, isUser ? styles.messageRight : null]}>
        <View style={bubbleStyle}>
          <Text style={[styles.messageText, { color: textColor }]}>
            {item.content}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
    >
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.listContent}
          onContentSizeChange={() =>
            requestAnimationFrame(() => {
              flatListRef.current?.scrollToEnd({ animated: true });
            })
          }
        />

        {!messages.some((msg) => msg.role === "user") ? (
          <View style={styles.suggestionRow}>
            {suggestions.map((suggestion) => (
              <TouchableOpacity
                key={suggestion}
                style={[
                  styles.suggestionChip,
                  { borderColor: theme.colors.border },
                ]}
                onPress={() => handleSend(suggestion)}
              >
                <Ionicons
                  name="sparkles-outline"
                  size={16}
                  color={theme.colors.accent}
                  style={styles.suggestionIcon}
                />
                <Text
                  style={[styles.suggestionText, { color: theme.colors.text }]}
                >
                  {suggestion}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}

        <View style={[styles.inputRow, { borderColor: theme.colors.border }]}>
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            placeholder={t("coachAI.placeholder")}
            placeholderTextColor={theme.colors.subText}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            onPress={() => handleSend(input)}
            disabled={loading || !input.trim()}
            style={[
              styles.sendButton,
              {
                backgroundColor:
                  loading || !input.trim()
                    ? theme.colors.border
                    : theme.colors.accent,
              },
            ]}
          >
            {loading ? (
              <ActivityIndicator size="small" color={theme.colors.background} />
            ) : (
              <Ionicons
                name="send"
                size={20}
                color={
                  loading || !input.trim()
                    ? theme.colors.subText
                    : theme.colors.background
                }
              />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  disabledContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    gap: 12,
  },
  disabledIcon: {
    width: 64,
    height: 64,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  disabledSubtitle: {
    fontSize: 14,
    textAlign: "center",
  },
  keyboardView: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  messageRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  messageRight: {
    justifyContent: "flex-end",
  },
  userBubble: {
    maxWidth: "85%",
    padding: 12,
    borderRadius: 18,
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    maxWidth: "85%",
    padding: 12,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  suggestionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  suggestionChip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: "100%",
    backgroundColor: "transparent",
  },
  suggestionIcon: {
    marginRight: 8,
  },
  suggestionText: {
    fontSize: 13,
    flexShrink: 1,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  input: {
    flex: 1,
    minHeight: 42,
    maxHeight: 140,
    fontSize: 16,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CoachChatScreen;
