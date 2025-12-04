import { supabase } from "@/lib/supabase";

type KeyType = "categories" | "sources" | "tags" | "foods";
type TransMap = Record<string, string>;
type LocaleMap = Record<KeyType, TransMap>;

const cache: Record<string, LocaleMap> = {};

const STATIC_TRANSLATIONS: Partial<Record<string, Partial<LocaleMap>>> = {
  tr: {
    foods: {
      oats: "Yulaf Ezmesi",
      greek_yogurt: "Sade Yunan Yoğurdu",
      berries: "Karışık Orman Meyvesi",
      egg_whites: "Yumurta Beyazı",
      whole_egg: "Tam Yumurta",
      avocado: "Avokado",
      chicken_breast: "Izgara Tavuk Göğsü",
      salmon: "Fırında Somon",
      brown_rice: "Esmer Pirinç",
      quinoa: "Kinoa",
      sweet_potato: "Tatlı Patates",
      broccoli: "Brokoli",
      spinach: "Ispanak",
      almonds: "Çiğ Badem",
      whey_shake: "Whey Protein Shake",
      banana: "Muz",
      apple: "Elma",
      chickpeas: "Haşlanmış Nohut",
      turkey_breast: "Hindi Göğsü",
      olive_oil: "Sızma Zeytinyağı",
      chia_seed: "Chia Tohumu",
      cottage_cheese: "Lor Peyniri",
      lentil_soup: "Mercimek Çorbası",
      protein_pancake: "Protein Pankek",
    },
  },
};

const ensureLocaleMap = (locale: string) => {
  if (!cache[locale]) {
    cache[locale] = { categories: {}, sources: {}, tags: {}, foods: {} };
  }

  const staticTranslations = STATIC_TRANSLATIONS[locale];
  if (staticTranslations) {
    (Object.keys(staticTranslations) as KeyType[]).forEach((type) => {
      const entries = staticTranslations[type];
      if (!entries) {
        return;
      }
      Object.entries(entries).forEach(([key, value]) => {
        if (!cache[locale][type][key]) {
          cache[locale][type][key] = value;
        }
      });
    });
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
