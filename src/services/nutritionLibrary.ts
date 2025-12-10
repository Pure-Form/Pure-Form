import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { FoodItem } from "@/types/coach";

export const FOOD_LIBRARY: FoodItem[] = [
  {
    id: "oats",
    name: "Yulaf Ezmesi",
    category: "carb",
    portion: "1/2 cup (dry)",
    calories: 150,
    protein: 5,
    carbs: 27,
    fat: 3,
    tags: ["kahvalti", "lif", "kompleks karbonhidrat"],
  },
  {
    id: "greek_yogurt",
    name: "Sade Yunan Yoğurdu",
    category: "protein",
    portion: "170 g",
    calories: 100,
    protein: 17,
    carbs: 6,
    fat: 0,
    tags: ["protein", "probiyotik"],
  },
  {
    id: "berries",
    name: "Karışık Orman Meyveleri",
    category: "produce",
    portion: "1 cup",
    calories: 60,
    protein: 1,
    carbs: 14,
    fat: 0,
    tags: ["lif", "antioksidan"],
  },
  {
    id: "egg_whites",
    name: "Yumurta Beyazı",
    category: "protein",
    portion: "4 adet",
    calories: 70,
    protein: 16,
    carbs: 1,
    fat: 0,
    tags: ["dusuk yag", "kahvalti"],
  },
  {
    id: "whole_egg",
    name: "Tam Yumurta",
    category: "protein",
    portion: "2 adet",
    calories: 150,
    protein: 12,
    carbs: 2,
    fat: 10,
    tags: ["saglikli yag", "kahvalti"],
  },
  {
    id: "avocado",
    name: "Avokado",
    category: "fat",
    portion: "1/2 adet",
    calories: 120,
    protein: 2,
    carbs: 6,
    fat: 10,
    tags: ["tekli doymamis yag", "mikro besin"],
  },
  {
    id: "chicken_breast",
    name: "Izgara Tavuk Göğsü",
    category: "protein",
    portion: "120 g",
    calories: 165,
    protein: 32,
    carbs: 0,
    fat: 4,
    tags: ["yagsiz protein"],
  },
  {
    id: "salmon",
    name: "Fırında Somon",
    category: "protein",
    portion: "120 g",
    calories: 210,
    protein: 25,
    carbs: 0,
    fat: 12,
    tags: ["omega-3", "anti-enflamatuar"],
  },
  {
    id: "brown_rice",
    name: "Esmer Pirinç",
    category: "carb",
    portion: "1 cup (pismis)",
    calories: 215,
    protein: 5,
    carbs: 45,
    fat: 2,
    tags: ["kompleks karbonhidrat"],
  },
  {
    id: "quinoa",
    name: "Kinoa",
    category: "carb",
    portion: "1 cup (pismis)",
    calories: 220,
    protein: 8,
    carbs: 39,
    fat: 4,
    tags: ["tam protein", "glutensiz"],
  },
  {
    id: "sweet_potato",
    name: "Tatlı Patates",
    category: "carb",
    portion: "1 orta boy",
    calories: 180,
    protein: 4,
    carbs: 41,
    fat: 0,
    tags: ["beta karoten", "tokluk"],
  },
  {
    id: "broccoli",
    name: "Brokoli",
    category: "produce",
    portion: "1 cup (buharda)",
    calories: 55,
    protein: 4,
    carbs: 11,
    fat: 0,
    tags: ["lif", "mikro besin"],
  },
  {
    id: "spinach",
    name: "Ispanak",
    category: "produce",
    portion: "2 cup",
    calories: 20,
    protein: 2,
    carbs: 3,
    fat: 0,
    tags: ["demir", "mikro besin"],
  },
  {
    id: "almonds",
    name: "Çiğ Badem",
    category: "fat",
    portion: "28 g",
    calories: 165,
    protein: 6,
    carbs: 6,
    fat: 14,
    tags: ["saglikli yag", "atistirmalik"],
  },
  {
    id: "whey_shake",
    name: "Whey Protein Shake",
    category: "supplement",
    portion: "1 olcek",
    calories: 140,
    protein: 24,
    carbs: 4,
    fat: 2,
    tags: ["hizli protein"],
  },
  {
    id: "banana",
    name: "Muz",
    category: "produce",
    portion: "1 orta boy",
    calories: 105,
    protein: 1,
    carbs: 27,
    fat: 0,
    tags: ["potasyum", "enerji"],
  },
  {
    id: "apple",
    name: "Elma",
    category: "produce",
    portion: "1 orta boy",
    calories: 95,
    protein: 0,
    carbs: 25,
    fat: 0,
    tags: ["lif", "tokluk"],
  },
  {
    id: "chickpeas",
    name: "Haşlanmış Nohut",
    category: "protein",
    portion: "1 cup",
    calories: 210,
    protein: 11,
    carbs: 35,
    fat: 4,
    tags: ["bitkisel protein", "lif"],
  },
  {
    id: "turkey_breast",
    name: "Hindi Göğsü",
    category: "protein",
    portion: "120 g",
    calories: 150,
    protein: 30,
    carbs: 0,
    fat: 3,
    tags: ["yagsiz protein"],
  },
  {
    id: "olive_oil",
    name: "Sızma Zeytinyağı",
    category: "fat",
    portion: "1 yemek kasigi",
    calories: 120,
    protein: 0,
    carbs: 0,
    fat: 14,
    tags: ["tekli doymamis yag"],
  },
  {
    id: "chia_seed",
    name: "Chia Tohumu",
    category: "fat",
    portion: "2 yemek kasigi",
    calories: 120,
    protein: 4,
    carbs: 10,
    fat: 7,
    tags: ["omega-3", "lif"],
  },
  {
    id: "cottage_cheese",
    name: "Lor Peyniri",
    category: "protein",
    portion: "150 g",
    calories: 130,
    protein: 18,
    carbs: 6,
    fat: 5,
    tags: ["kalsiyum", "protein"],
  },
  {
    id: "lentil_soup",
    name: "Mercimek Çorbası",
    category: "protein",
    portion: "1 kase",
    calories: 180,
    protein: 12,
    carbs: 28,
    fat: 4,
    tags: ["bitkisel protein", "lif"],
  },
  {
    id: "protein_pancake",
    name: "Protein Pankek",
    category: "carb",
    portion: "2 adet",
    calories: 230,
    protein: 20,
    carbs: 28,
    fat: 6,
    tags: ["kahvalti", "protein"],
  },
];

export const getFoodById = (id: string) =>
  FOOD_LIBRARY.find((item) => item.id === id);

type SupabaseFoodRow = {
  fdc_id: number | string;
  name: string | null;
  category: string | null;
  portion: string | null;
  portion_grams: number | null;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  tags: string | string[] | null;
  image_url: string | null;
  data_source: string | null;
};

const RESULTS_LIMIT = 50;

const toNumber = (value: unknown, fallback = 0) => {
  const numeric = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
};

const toOptionalNumber = (value: unknown) => {
  const numeric = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numeric) ? numeric : null;
};

const toTags = (value: SupabaseFoodRow["tags"]): string[] => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map((tag) => tag.trim()).filter(Boolean);
  }

  return value
    .split("|")
    .map((tag) => tag.trim())
    .filter(Boolean);
};

const normalizeQuery = (value: string) => value.trim();

const toSearchToken = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i");

const escapeLikePattern = (value: string) =>
  value.replace(/[%_]/g, (match) => `\\${match}`).replace(/'/g, "''");

const toTitleCase = (value: string) =>
  value
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const prettifyFoodName = (raw: string | null | undefined) => {
  const cleaned = (raw ?? "").replace(/[_]+/g, " ").replace(/\s+/g, " ").trim();

  if (!cleaned) {
    return "";
  }

  const normalized = cleaned.replace(/^[^0-9A-Za-zÇĞİÖŞÜçğıöşü]+/, "");

  if (!normalized) {
    return "";
  }

  const isAllUpper = normalized === normalized.toUpperCase();
  const isAllLower = normalized === normalized.toLowerCase();

  if (isAllUpper || isAllLower) {
    return toTitleCase(normalized.toLowerCase());
  }

  return normalized;
};

const supabaseRowToFoodItem = (row: SupabaseFoodRow): FoodItem => ({
  id: String(row.fdc_id),
  name: prettifyFoodName(row.name),
  category: row.category?.trim() || "Other",
  categoryKey: row.category?.trim() || undefined,
  portion: row.portion?.trim() || "100 g",
  portionGrams: toOptionalNumber(row.portion_grams),
  calories: toNumber(row.calories),
  protein: toNumber(row.protein),
  carbs: toNumber(row.carbs),
  fat: toNumber(row.fat),
  tags: toTags(row.tags).map((t) => t.toLowerCase()),
  imageUrl: row.image_url ?? undefined,
  dataSource: row.data_source
    ? row.data_source
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase())
    : undefined,
  dataSourceKey: row.data_source ?? undefined,
});

const fallbackSearchFoods = (query: string) => {
  const trimmed = normalizeQuery(query);
  if (!trimmed) {
    return FOOD_LIBRARY;
  }

  const searchToken = toSearchToken(trimmed);

  return FOOD_LIBRARY.filter(
    (item) =>
      toSearchToken(item.name).includes(searchToken) ||
      item.tags.some((tag: string) => toSearchToken(tag).includes(searchToken)),
  );
};

export const searchFoods = async (
  query: string,
  limit: number = RESULTS_LIMIT,
): Promise<FoodItem[]> => {
  if (!isSupabaseConfigured) {
    return fallbackSearchFoods(query);
  }

  const trimmed = normalizeQuery(query);

  try {
    let builder = supabase
      .from("foods")
      .select(
        "fdc_id,name,category,portion,portion_grams,calories,protein,carbs,fat,tags,image_url,data_source",
      )
      .limit(limit)
      .abortSignal(AbortSignal.timeout(5000)); // 5 second timeout

    if (trimmed) {
      const pattern = escapeLikePattern(trimmed);
      builder = builder
        .or(
          [
            `name.ilike.%${pattern}%`,
            `category.ilike.%${pattern}%`,
            `tags.ilike.%${pattern}%`,
          ].join(","),
        )
        .order("name", { ascending: true });
    } else {
      builder = builder.order("name", { ascending: true });
    }

    const { data, error } = await builder;

    if (error) {
      console.warn("Supabase searchFoods error:", error.message || error);
      return fallbackSearchFoods(query);
    }

    const rows = (data ?? []) as SupabaseFoodRow[];
    return rows.map(supabaseRowToFoodItem);
  } catch (error: any) {
    // Timeout or network error - use local data
    if (error?.name === "AbortError" || error?.code === "57014") {
      console.warn("Supabase timeout - using local data");
    } else {
      console.warn(
        "Supabase searchFoods unexpected error:",
        error?.message || error,
      );
    }
    return fallbackSearchFoods(query);
  }
};
