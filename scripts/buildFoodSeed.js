const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const DATA_DIR = path.resolve(
  __dirname,
  "..",
  "FoodData_Central_csv_2025-04-24",
);
const OUTPUT_DIR = path.resolve(__dirname, "..", "scripts", "output");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "foods_seed.csv");

const TARGET_NUTRIENTS = {
  energy: {
    id: "1008", // Energy (kcal)
    key: "calories",
  },
  protein: {
    id: "1003", // Protein (g)
    key: "protein",
  },
  carbs: {
    id: "1005", // Carbohydrate, by difference (g)
    key: "carbs",
  },
  fat: {
    id: "1004", // Total lipid (fat) (g)
    key: "fat",
  },
};

const foodMap = new Map();
const categoryMap = new Map();
const portionMap = new Map();
const nutrientMap = new Map();

const sanitizeText = (value) => {
  if (!value) {
    return "";
  }

  return String(value)
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
    .trim();
};

const readCsv = (filePath, onRow) =>
  new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", onRow)
      .on("end", resolve)
      .on("error", reject);
  });

const ensureOutputDir = () => {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
};

const loadCategories = async () => {
  const file = path.join(DATA_DIR, "food_category.csv");
  await readCsv(file, (row) => {
  categoryMap.set(row.id, sanitizeText(row.description) || "Other");
  });
};

const loadFoods = async () => {
  const allowedTypes = new Set([
    "branded_food",
    "foundation_food",
    "sr_legacy_food",
    "survey_fndds_food",
  ]);
  const file = path.join(DATA_DIR, "food.csv");
  await readCsv(file, (row) => {
    const fdcId = row.fdc_id;

    if (!fdcId || !row.description) {
      return;
    }

    if (allowedTypes.size && !allowedTypes.has(row.data_type)) {
      return;
    }

    foodMap.set(fdcId, {
      id: fdcId,
  description: sanitizeText(row.description),
      categoryId: row.food_category_id,
      publicationDate: row.publication_date,
      dataSource: row.data_type,
    });
  });
};

const loadPortions = async () => {
  const file = path.join(DATA_DIR, "food_portion.csv");
  await readCsv(file, (row) => {
    const fdcId = row.fdc_id;
    if (!foodMap.has(fdcId)) {
      return;
    }

    if (portionMap.has(fdcId)) {
      return;
    }

    const gramWeight = parseFloat(row.gram_weight || "");
    const portionDescription = row.portion_description?.trim();

    portionMap.set(fdcId, {
      gramWeight: Number.isFinite(gramWeight) ? gramWeight : null,
      description:
        sanitizeText(portionDescription) || row.sequence_number || "100 g",
    });
  });
};

const loadNutrients = async () => {
  const allowedIds = new Set(
    Object.values(TARGET_NUTRIENTS).map((item) => item.id),
  );
  const file = path.join(DATA_DIR, "food_nutrient.csv");

  await readCsv(file, (row) => {
    const fdcId = row.fdc_id;
  if (!foodMap.has(fdcId)) {
      return;
    }

    if (!allowedIds.has(row.nutrient_id)) {
      return;
    }

    const amount = parseFloat(row.amount || "");
    if (!Number.isFinite(amount)) {
      return;
    }

    const nutrientData = nutrientMap.get(fdcId) ?? {
      calories: null,
      protein: null,
      carbs: null,
      fat: null,
    };

    const targetKey =
      Object.values(TARGET_NUTRIENTS).find(
        (item) => item.id === row.nutrient_id,
      )?.key ?? null;

    if (targetKey) {
      nutrientData[targetKey] = amount;
      nutrientMap.set(fdcId, nutrientData);
    }
  });
};

const computePortionMacros = (fdcId, baseMacros) => {
  const portion = portionMap.get(fdcId);
  if (!portion || !portion.gramWeight) {
    return {
      ...baseMacros,
      portionLabel: portion?.description ?? "100 g",
      portionGrams: portion?.gramWeight ?? 100,
    };
  }

  const factor = portion.gramWeight / 100;
  return {
    calories: baseMacros.calories * factor,
    protein: baseMacros.protein * factor,
    carbs: baseMacros.carbs * factor,
    fat: baseMacros.fat * factor,
    portionLabel: portion.description,
    portionGrams: portion.gramWeight,
  };
};

const roundValue = (value, precision = 1) =>
  Math.round((value + Number.EPSILON) * (10 ** precision)) /
  10 ** precision;

const buildExportRows = () => {
  const rows = [];

  for (const [fdcId, food] of foodMap) {
    const category =
      categoryMap.get(food.categoryId) || sanitizeText(food.categoryId) || "Other";
    const baseMacros = nutrientMap.get(fdcId);

    if (!baseMacros) {
      continue;
    }

    if (
      baseMacros.calories === null ||
      baseMacros.protein === null ||
      baseMacros.carbs === null ||
      baseMacros.fat === null
    ) {
      continue;
    }

    const portionData = computePortionMacros(fdcId, baseMacros);

    rows.push({
      id: fdcId,
      name: sanitizeText(food.description),
      category,
      portion: sanitizeText(portionData.portionLabel),
      portion_grams: portionData.portionGrams,
      calories: roundValue(portionData.calories),
      protein: roundValue(portionData.protein, 2),
      carbs: roundValue(portionData.carbs, 2),
      fat: roundValue(portionData.fat, 2),
      tags: sanitizeText(category).toLowerCase(),
      image_url: "",
      data_source: sanitizeText(food.dataSource) || "foundation",
    });
  }

  return rows;
};

const writeCsv = (rows) => {
  ensureOutputDir();
  const headers = [
    "id",
    "name",
    "category",
    "portion",
    "portion_grams",
    "calories",
    "protein",
    "carbs",
    "fat",
    "tags",
    "image_url",
    "data_source",
  ];

  const stream = fs.createWriteStream(OUTPUT_FILE, { encoding: "utf8" });
  stream.write(`${headers.join(",")}\n`);

  for (const row of rows) {
    const values = headers.map((header) => {
      const value = row[header];
      if (value == null) {
        return "";
      }
      const asString = sanitizeText(value);
      if (asString.includes(",") || asString.includes("\"")) {
        return `"${asString.replace(/\"/g, '""')}"`;
      }
      return asString;
    });
    stream.write(`${values.join(",")}\n`);
  }

  stream.end();
};

const main = async () => {
  console.time("build-food-seed");
  await loadCategories();
  await loadFoods();
  await loadPortions();
  await loadNutrients();
  const rows = buildExportRows();
  writeCsv(rows);
  console.timeEnd("build-food-seed");
  console.log(`Exported ${rows.length} foods to ${OUTPUT_FILE}`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
