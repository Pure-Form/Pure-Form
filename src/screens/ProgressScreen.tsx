import React from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "@/context/ThemeContext";
import { getProgressData, type ProgressPoint } from "@/services/mockData";

const screenWidth = Dimensions.get("window").width;

const ProgressScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const data = getProgressData();

  const latest = data[data.length - 1];

  // Prepare chart data
  const weightData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        data: data.map((d) => d.weight),
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  };

  const bodyFatData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        data: data.map((d) => d.bodyFat),
        color: (opacity = 1) => `rgba(255, 99, 71, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: theme.colors.surface,
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
    labelColor: () => theme.colors.subText,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "5",
      strokeWidth: "2",
      stroke: theme.colors.accent,
    },
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {t("progress.title")}
          </Text>
          <View style={styles.summaryRow}>
            <View
              style={[
                styles.summaryCard,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <Text
                style={[styles.summaryLabel, { color: theme.colors.subText }]}
              >
                {t("progress.weight")}
              </Text>
              <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
                {latest.weight.toFixed(1)} kg
              </Text>
            </View>
            <View
              style={[
                styles.summaryCard,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <Text
                style={[styles.summaryLabel, { color: theme.colors.subText }]}
              >
                {t("progress.bodyFat")}
              </Text>
              <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
                {latest.bodyFat.toFixed(1)}%
              </Text>
            </View>
          </View>

          {/* Weight Chart */}
          <View
            style={[
              styles.chartCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Text style={[styles.chartTitle, { color: theme.colors.text }]}>
              {t("progress.weightTrend")}
            </Text>
            <LineChart
              data={weightData}
              width={screenWidth - 56}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              withInnerLines={false}
              withOuterLines
              withVerticalLabels
              withHorizontalLabels
              fromZero={false}
            />
          </View>

          {/* Body Fat Chart */}
          <View
            style={[
              styles.chartCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Text style={[styles.chartTitle, { color: theme.colors.text }]}>
              {t("progress.bodyFatTrend")}
            </Text>
            <LineChart
              data={bodyFatData}
              width={screenWidth - 56}
              height={220}
              chartConfig={{
                ...chartConfig,
                color: (opacity = 1) => `rgba(255, 99, 71, ${opacity})`,
              }}
              bezier
              style={styles.chart}
              withInnerLines={false}
              withOuterLines
              withVerticalLabels
              withHorizontalLabels
              fromZero={false}
            />
          </View>

          {/* Steps History */}
          <View
            style={[
              styles.listCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Text style={[styles.listTitle, { color: theme.colors.text }]}>
              {t("progress.steps")}
            </Text>
            <FlatList
              data={data}
              keyExtractor={(item: ProgressPoint) => item.label}
              renderItem={({ item }: { item: ProgressPoint }) => (
                <View style={styles.listRow}>
                  <Text
                    style={[styles.listLabel, { color: theme.colors.subText }]}
                  >
                    {item.label}
                  </Text>
                  <Text
                    style={[styles.listValue, { color: theme.colors.text }]}
                  >
                    {item.steps.toLocaleString()} steps
                  </Text>
                </View>
              )}
              ItemSeparatorComponent={() => (
                <View
                  style={[
                    styles.divider,
                    { backgroundColor: theme.colors.border },
                  ]}
                />
              )}
              scrollEnabled={false}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 20,
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  summaryRow: {
    flexDirection: "row",
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 8,
  },
  summaryLabel: {
    fontSize: 13,
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: "700",
  },
  chartCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  listCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  listRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  listLabel: {
    fontSize: 14,
  },
  listValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    opacity: 0.4,
  },
});

export default ProgressScreen;
