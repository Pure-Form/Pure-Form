import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/context/ThemeContext";

type StatCardProps = {
  title: string;
  value: string;
  unit?: string;
  icon?: React.ReactNode;
  variant?: "primary" | "neutral";
};

const StatCard = ({ title, value, unit, icon, variant = "neutral" }: StatCardProps) => {
  const { theme } = useTheme();

  if (variant === "primary") {
    return (
      <LinearGradient
        colors={theme.colors.chartGradient}
        style={[styles.card, { borderColor: theme.colors.accent }]}
      >
        <View style={styles.content}>
          <View style={styles.icon}>{icon}</View>
          <Text style={[styles.label, { color: theme.colors.text }]}>{title}</Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {value}
            {unit ? <Text style={styles.unit}>{` ${unit}`}</Text> : null}
          </Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <View style={styles.content}>
        <View style={styles.icon}>{icon}</View>
        <Text style={[styles.label, { color: theme.colors.subText }]}>{title}</Text>
        <Text style={[styles.value, { color: theme.colors.text }]}>
          {value}
          {unit ? <Text style={styles.unit}>{` ${unit}`}</Text> : null}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    margin: 8
  },
  content: {
    gap: 10
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center"
  },
  label: {
    fontSize: 14,
    fontWeight: "500"
  },
  value: {
    fontSize: 24,
    fontWeight: "700"
  },
  unit: {
    fontSize: 12,
    fontWeight: "400"
  }
});

export default StatCard;
