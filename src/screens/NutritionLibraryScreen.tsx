import React from "react";
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  View,
} from "react-native";

import FormTextInput from "@/components/FormTextInput";
import { useTheme } from "@/context/ThemeContext";
import { searchFoods } from "@/services/nutritionLibrary";
import translationService from "@/services/translationService";
import type { FoodItem } from "@/types/coach";
import { useTranslation } from "react-i18next";

const MACRO_KEYS: Array<"protein" | "carbs" | "fat"> = [
  "protein",
  "carbs",
  "fat",
];

const NutritionLibraryScreen = () => {
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const locale = React.useMemo(
    () => (i18n.language?.toLowerCase().startsWith("tr") ? "tr" : "en"),
    [i18n.language],
  );

  const { colors } = theme;

  React.useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    setErrorMessage(null);
    // preload translations for active locale so fallback data appears polished
    translationService.loadTranslations(locale).catch((e) =>
      console.warn("translation load failed", e),
    );

    const timer = setTimeout(async () => {
      try {
        const items = await searchFoods(query);
        if (isCancelled) {
          return;
        }
        setResults(items);
      } catch (error) {
        console.warn("Nutrition search failed", error);
        if (isCancelled) {
          return;
        }
        setErrorMessage(t("nutrition.error"));
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }, 350);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [locale, query, t]);

  const handleRefresh = React.useCallback(async () => {
    setIsRefreshing(true);
    setErrorMessage(null);

    try {
      const items = await searchFoods(query);
      setResults(items);
    } catch (error) {
      console.warn("Nutrition refresh failed", error);
      setErrorMessage(t("nutrition.error"));
    } finally {
      setIsRefreshing(false);
    }
  }, [query, t]);

  const renderItem = React.useCallback<ListRenderItem<FoodItem>>(
    ({ item }) => (
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.cardHeader}>
          <Text style={[styles.name, { color: colors.text }]}>
            {translationService.translate("foods", item.id, locale) ??
              item.name}
          </Text>
          <Text style={[styles.calories, { color: colors.accent }]}>
            {t("nutrition.calories", { value: item.calories })}
          </Text>
        </View>
        <Text style={[styles.portion, { color: colors.subText }]}>
          {t("nutrition.portion", { value: item.portion })}
          {item.portionGrams
            ? ` ${t("nutrition.portionGrams", {
                value: item.portionGrams,
              })}`
            : ""}
        </Text>
        <View style={styles.metaRow}>
          <Text style={[styles.metaText, { color: colors.subText }]}>
            {translationService.translate(
              "categories",
              item.categoryKey ?? item.category,
            ) ??
              t(`nutrition.categories.${item.categoryKey ?? item.category}`, {
                defaultValue: item.category,
              })}
          </Text>
          {item.dataSourceKey ? (
            <Text style={[styles.metaText, { color: colors.subText }]}>
              {translationService.translate("sources", item.dataSourceKey) ??
                t(`nutrition.sources.${item.dataSourceKey}`, {
                  defaultValue: item.dataSource,
                })}
            </Text>
          ) : null}
        </View>
        <View style={styles.macroRow}>
          {MACRO_KEYS.map((macro) => (
            <Text
              key={macro}
              style={[styles.macroText, { color: colors.subText }]}
            >
              {t(`nutrition.macros.${macro}` as const)}:
              <Text style={[styles.macroValue, { color: colors.text }]}>
                {` ${item[macro]}g`}
              </Text>
            </Text>
          ))}
        </View>
      </View>
    ),
    [colors, locale, t],
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        ItemSeparatorComponent={Separator}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              {t("nutrition.heading")}
            </Text>
            <Text style={[styles.subtitle, { color: colors.subText }]}>
              {t("nutrition.subtitle")}
            </Text>
            <FormTextInput
              label={t("nutrition.searchLabel")}
              placeholder={t("nutrition.searchPlaceholder")}
              value={query}
              onChangeText={setQuery}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {isLoading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color={colors.accent} size="small" />
                <Text style={[styles.loadingText, { color: colors.subText }]}>
                  {t("nutrition.loading")}
                </Text>
              </View>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            {isLoading ? (
              <ActivityIndicator color={colors.accent} size="small" />
            ) : (
              <Text
                style={[
                  styles.emptyText,
                  { color: errorMessage ? colors.danger : colors.subText },
                ]}
              >
                {errorMessage ?? t("nutrition.empty")}
              </Text>
            )}
          </View>
        }
      />
    </View>
  );
};

const Separator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  header: {
    paddingTop: 24,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 8,
    gap: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    flexShrink: 1,
  },
  calories: {
    fontSize: 14,
    fontWeight: "600",
  },
  portion: {
    fontSize: 13,
    marginBottom: 12,
  },
  macroRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  macroText: {
    fontSize: 12,
    letterSpacing: 0.2,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 12,
  },
  metaText: {
    fontSize: 12,
    textTransform: "capitalize",
  },
  macroValue: {
    fontSize: 16,
    fontWeight: "700",
  },
  tagsText: {
    fontSize: 12,
  },
  emptyState: {
    paddingVertical: 48,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
  },
  separator: {
    height: 12,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
  },
  loadingText: {
    fontSize: 12,
  },
});

export default NutritionLibraryScreen;
