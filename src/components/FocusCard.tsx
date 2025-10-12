import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import type { FocusItem } from "@/services/mockData";

type FocusCardProps = {
  item: FocusItem;
};

const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  barbell: "barbell-outline",
  nutrition: "nutrition-outline",
  runner: "walk-outline"
};

const FocusCard = ({ item }: FocusCardProps) => {
  const { theme } = useTheme();
  const iconName = iconMap[item.icon] ?? "flash-outline";

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <View style={[styles.icon, { backgroundColor: theme.colors.accentSoft }]}>
        <Ionicons name={iconName} size={20} color={theme.colors.accent} />
      </View>
      <View style={styles.texts}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{item.title}</Text>
        <Text style={[styles.subtitle, { color: theme.colors.subText }]}>{item.subtitle}</Text>
      </View>
      <Text style={[styles.time, { color: theme.colors.accent }]}>{item.time}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    marginVertical: 6,
    gap: 16
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center"
  },
  texts: {
    flex: 1,
    gap: 4
  },
  title: {
    fontSize: 16,
    fontWeight: "600"
  },
  subtitle: {
    fontSize: 13
  },
  time: {
    fontSize: 13,
    fontWeight: "600"
  }
});

export default FocusCard;
