import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";
import { getProgressData, type ProgressPoint } from "@/services/mockData";

const ProgressScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const data = getProgressData();

  const latest = data[data.length - 1];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}> 
      <View style={styles.container}> 
        <Text style={[styles.title, { color: theme.colors.text }]}>{t("progress.title")}</Text>
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <Text style={[styles.summaryLabel, { color: theme.colors.subText }]}>{t("progress.weight")}</Text>
            <Text style={[styles.summaryValue, { color: theme.colors.text }]}>{latest.weight.toFixed(1)} kg</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <Text style={[styles.summaryLabel, { color: theme.colors.subText }]}>{t("progress.bodyFat")}</Text>
            <Text style={[styles.summaryValue, { color: theme.colors.text }]}>{latest.bodyFat.toFixed(1)}%</Text>
          </View>
        </View>

        <View style={[styles.listCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.listTitle, { color: theme.colors.text }]}>{t("progress.steps")}</Text>
          <FlatList
            data={data}
            keyExtractor={(item: ProgressPoint) => item.label}
            renderItem={({ item }: { item: ProgressPoint }) => (
              <View style={styles.listRow}>
                <Text style={[styles.listLabel, { color: theme.colors.subText }]}>{item.label}</Text>
                <Text style={[styles.listValue, { color: theme.colors.text }]}>{item.steps.toLocaleString()} steps</Text>
              </View>
            )}
            ItemSeparatorComponent={() => <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  container: {
    flex: 1,
    padding: 20,
    gap: 20
  },
  title: {
    fontSize: 24,
    fontWeight: "700"
  },
  summaryRow: {
    flexDirection: "row",
    gap: 12
  },
  summaryCard: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 8
  },
  summaryLabel: {
    fontSize: 13
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: "700"
  },
  listCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12
  },
  listRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10
  },
  listLabel: {
    fontSize: 14
  },
  listValue: {
    fontSize: 14,
    fontWeight: "600"
  },
  divider: {
    height: 1,
    opacity: 0.4
  }
});

export default ProgressScreen;
