import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

import { useTheme } from "@/context/ThemeContext";

type PrimaryButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "tertiary";
};

const PrimaryButton = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = "primary",
}: PrimaryButtonProps) => {
  const { theme } = useTheme();

  const backgroundColor =
    variant === "primary"
      ? theme.colors.accent
      : variant === "secondary"
        ? theme.colors.accentSoft
        : "transparent";
  const textColor =
    variant === "primary" ? theme.colors.background : theme.colors.accent;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }: { pressed: boolean }) => [
        styles.button,
        {
          backgroundColor,
          opacity: pressed || disabled ? 0.8 : 1,
          borderColor: theme.colors.border,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={textColor}
          accessibilityRole="progressbar"
          testID="primary-button-loader"
        />
      ) : (
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 54,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
    borderWidth: 1,
  },
  title: {
    fontWeight: "600",
    fontSize: 16,
  },
});

export default PrimaryButton;
