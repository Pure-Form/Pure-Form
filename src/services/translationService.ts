import { supabase } from "@/lib/supabase";

type KeyType = "categories" | "sources" | "tags";
type TransMap = Record<string, string>;
type LocaleMap = Record<KeyType, TransMap>;

const cache: Record<string, LocaleMap> = {};

const ensureLocaleMap = (locale: string) => {
  if (!cache[locale]) {
    cache[locale] = { categories: {}, sources: {}, tags: {} };
  }
  return cache[locale];
};

export const loadTranslations = async (locale = "tr") => {
  if (!supabase) return ensureLocaleMap(locale);

  if (cache[locale]) return cache[locale];

  const { data, error } = await supabase
    .from("nutrition_translations")
    .select("key_type,key,translation")
    .eq("locale", locale);

  const map = ensureLocaleMap(locale);

  if (error) {
    console.warn("loadTranslations error:", error);
    return map;
  }

  (data ?? []).forEach((row: any) => {
    const kt = row.key_type as KeyType;
    const key = String(row.key ?? "");
    const val = String(row.translation ?? "");
    if (kt && key) {
      map[kt][key] = val;
    }
  });

  cache[locale] = map;
  return map;
};

export const translate = (
  type: KeyType,
  key: string | undefined | null,
  locale = "tr",
): string | null => {
  if (!key) return null;
  const map = cache[locale];
  if (!map) return null;
  return map[type]?.[key] ?? null;
};

export const clearTranslationsCache = () => {
  Object.keys(cache).forEach((k) => delete cache[k]);
};

export default { loadTranslations, translate, clearTranslationsCache };
