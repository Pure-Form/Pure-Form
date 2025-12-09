import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import FormTextInput from "@/components/FormTextInput";
import PrimaryButton from "@/components/PrimaryButton";
import { useCoach } from "@/context/CoachContext";
import { useTheme } from "@/context/ThemeContext";
import type { PlannerStackParamList } from "@/navigation/PlannerNavigator";
import type {
  ActivityLevel,
  BodyFocus,
  BodyGoal,
  DietPreference,
  EquipmentAccess,
  GoalProfile,
  Sex,
  TrainingExperience,
} from "@/types/coach";

type Props = NativeStackScreenProps<PlannerStackParamList, "CoachSetup">;

type FormState = {
  sex: Sex;
  age: string;
  heightCm: string;
  weightKg: string;
  targetWeightKg: string;
  goal: BodyGoal;
  focus: BodyFocus;
  activityLevel: ActivityLevel;
  workoutsPerWeek: number;
  experience: TrainingExperience;
  equipment: EquipmentAccess;
  dietPreference: DietPreference;
  injuries: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

type Option<TValue> = {
  label: string;
  value: TValue;
  subtitle?: string;
  icon?: IoniconsName;
};

const OptionPill = <TValue,>({
  label,
  subtitle,
  icon,
  selected,
  onPress,
}: Option<TValue> & { selected: boolean; onPress: () => void }) => {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.pill,
        {
          backgroundColor: selected
            ? theme.colors.accent
            : theme.colors.surface,
          borderColor: selected ? theme.colors.accent : theme.colors.border,
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      <View style={styles.pillContent}>
        {icon ? (
          <Ionicons
            name={icon}
            size={18}
            color={selected ? theme.colors.background : theme.colors.accent}
            style={styles.pillIcon}
          />
        ) : null}
        <View>
          <Text
            style={[
              styles.pillLabel,
              { color: selected ? theme.colors.background : theme.colors.text },
            ]}
          >
            {label}
          </Text>
          {subtitle ? (
            <Text
              style={[
                styles.pillSubtitle,
                {
                  color: selected
                    ? theme.colors.background
                    : theme.colors.subText,
                },
              ]}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>
      {selected ? (
        <Ionicons
          name="checkmark-circle"
          size={20}
          color={theme.colors.background}
        />
      ) : null}
    </Pressable>
  );
};

const createInitialState = (profile: GoalProfile | null): FormState => ({
  sex: profile?.sex ?? "male",
  age: profile ? String(profile.age) : "28",
  heightCm: profile ? String(profile.heightCm) : "178",
  weightKg: profile ? String(profile.weightKg) : "78",
  targetWeightKg: profile ? String(profile.targetWeightKg) : "72",
  goal: profile?.goal ?? "lose_weight",
  focus: profile?.focus ?? "lean",
  activityLevel: profile?.activityLevel ?? "moderate",
  workoutsPerWeek: profile?.workoutsPerWeek ?? 4,
  experience: profile?.experience ?? "intermediate",
  equipment: profile?.equipment ?? "basic_gym",
  dietPreference: profile?.dietPreference ?? "omnivore",
  injuries: profile?.injuries ?? "",
});

const CoachSetupScreen = ({ navigation }: Props) => {
  const { theme } = useTheme();
  const { state, saveProfile, loading } = useCoach();
  const [form, setForm] = useState<FormState>(() =>
    createInitialState(state.profile),
  );
  const [errors, setErrors] = useState<FormErrors>({});

  const activityOptions: Option<ActivityLevel>[] = useMemo(
    () => [
      {
        value: "sedentary",
        label: "Az hareket",
        subtitle: "Ofis calismasi",
        icon: "cafe-outline",
      },
      {
        value: "light",
        label: "Hafif",
        subtitle: "3x hafif yuruyus",
        icon: "walk-outline",
      },
      {
        value: "moderate",
        label: "Orta",
        subtitle: "3-4x antrenman",
        icon: "barbell-outline",
      },
      {
        value: "active",
        label: "Aktif",
        subtitle: "5-6x antrenman",
        icon: "pulse-outline",
      },
      {
        value: "athlete",
        label: "Atlet",
        subtitle: "Pro seviye",
        icon: "flame-outline",
      },
    ],
    [],
  );

  const goalOptions: Option<BodyGoal>[] = useMemo(
    () => [
      {
        value: "lose_weight",
        label: "Yağ Yak",
        subtitle: "Kalori açığı & definisyon",
        icon: "flame-outline",
      },
      {
        value: "build_muscle",
        label: "Kas Yap",
        subtitle: "Kas kazanımı & güç",
        icon: "barbell-outline",
      },
      {
        value: "gain_weight",
        label: "Kilo Al",
        subtitle: "Dengeli kilo artışı",
        icon: "nutrition-outline",
      },
    ],
    [],
  );

  const focusOptions: Option<BodyFocus>[] = useMemo(
    () => [
      {
        value: "lean",
        label: "Forma Sok",
        subtitle: "Kas korurken yağ azalt",
        icon: "body-outline",
      },
      {
        value: "athletic",
        label: "Atletik",
        subtitle: "Kuvvet + dayanıklılık",
        icon: "rocket-outline",
      },
      {
        value: "power",
        label: "Power",
        subtitle: "Maksimum güç",
        icon: "fitness-outline",
      },
    ],
    [],
  );

  const workoutOptions: Option<number>[] = useMemo(
    () => [
      { value: 3, label: "3 gün", subtitle: "Dengeli başlangıç" },
      { value: 4, label: "4 gün", subtitle: "Split + kardiyo" },
      { value: 5, label: "5 gün", subtitle: "Gelişmiş program" },
      { value: 6, label: "6 gün", subtitle: "Yüksek yoğunluk" },
    ],
    [],
  );

  const handleNumericChange = (
    key: "age" | "heightCm" | "weightKg" | "targetWeightKg",
    value: string,
  ) => {
    const sanitized = value.replace(/[^0-9.]/g, "");
    setForm((prev) => ({ ...prev, [key]: sanitized }));
  };

  const handleFreeTextChange = (key: "injuries", value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSelect = <TKey extends keyof FormState>(
    key: TKey,
    value: FormState[TKey],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const experienceOptions: Option<TrainingExperience>[] = useMemo(
    () => [
      {
        value: "beginner",
        label: "Yeni Başlayan",
        subtitle: "0-6 ay düzenli antrenman",
        icon: "flag-outline",
      },
      {
        value: "intermediate",
        label: "Orta Seviye",
        subtitle: "6-24 ay deneyim",
        icon: "trending-up-outline",
      },
      {
        value: "advanced",
        label: "İleri Seviye",
        subtitle: "2+ yıl sistemli çalışma",
        icon: "trophy-outline",
      },
    ],
    [],
  );

  const equipmentOptions: Option<EquipmentAccess>[] = useMemo(
    () => [
      {
        value: "full_gym",
        label: "Tam Donanımlı Spor Salonu",
        subtitle: "Serbest ağırlık + makineler",
        icon: "fitness-outline",
      },
      {
        value: "basic_gym",
        label: "Temel Spor Salonu",
        subtitle: "Dumbbell, bench, kablo",
        icon: "barbell-outline",
      },
      {
        value: "home_dumbbells",
        label: "Ev + Dumbbell",
        subtitle: "Adjustable dumbbell / kettlebell",
        icon: "cube-outline",
      },
      {
        value: "bodyweight",
        label: "Sadece Vücut Ağırlığı",
        subtitle: "Barfiks, elastik bant, mat",
        icon: "body-outline",
      },
    ],
    [],
  );

  const dietOptions: Option<DietPreference>[] = useMemo(
    () => [
      { value: "omnivore", label: "Dengeli / Omnivor" },
      { value: "vegetarian", label: "Vejetaryen" },
      { value: "vegan", label: "Vegan" },
      { value: "pescatarian", label: "Pesketaryen" },
      { value: "keto", label: "Ketojenik" },
    ],
    [],
  );

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};
    const age = Number(form.age);
    const height = Number(form.heightCm);
    const weight = Number(form.weightKg);
    const target = Number(form.targetWeightKg);

    if (!form.age || Number.isNaN(age) || age < 16 || age > 80) {
      nextErrors.age = "Geçerli bir yaş gir";
    }
    if (
      !form.heightCm ||
      Number.isNaN(height) ||
      height < 130 ||
      height > 220
    ) {
      nextErrors.heightCm = "Boyunu cm cinsinden gir";
    }
    if (!form.weightKg || Number.isNaN(weight) || weight < 40 || weight > 200) {
      nextErrors.weightKg = "Kilonu kg cinsinden gir";
    }
    if (
      !form.targetWeightKg ||
      Number.isNaN(target) ||
      target < 40 ||
      target > 200
    ) {
      nextErrors.targetWeightKg = "Hedef kilonu kg cinsinden gir";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    const profile: GoalProfile = {
      sex: form.sex,
      age: Number(form.age),
      heightCm: Number(form.heightCm),
      weightKg: Number(form.weightKg),
      targetWeightKg: Number(form.targetWeightKg),
      goal: form.goal,
      focus: form.focus,
      activityLevel: form.activityLevel,
      workoutsPerWeek: form.workoutsPerWeek,
      experience: form.experience,
      equipment: form.equipment,
      dietPreference: form.dietPreference,
      injuries: form.injuries.trim() || undefined,
    };

    await saveProfile(profile);
    setErrors({});
    navigation.navigate("CoachPlan");
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { paddingBottom: 32 }]}
      >
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Kişisel Koçunu Oluştur
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.subText }]}>
              Forma sok moduna geç ve hedeflerine göre tam plan oluştur.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Temel Bilgiler
          </Text>
          <View style={styles.row}>
            {(["male", "female"] as Sex[]).map((sex) => (
              <OptionPill
                key={sex}
                value={sex}
                label={sex === "male" ? "Erkek" : "Kadın"}
                icon={sex === "male" ? "man-outline" : "woman-outline"}
                selected={form.sex === sex}
                onPress={() => handleSelect("sex", sex)}
              />
            ))}
          </View>

          <FormTextInput
            label="Yaş"
            keyboardType="numeric"
            value={form.age}
            onChangeText={(text: string) => handleNumericChange("age", text)}
            error={errors.age}
          />
          <FormTextInput
            label="Boy (cm)"
            keyboardType="numeric"
            value={form.heightCm}
            onChangeText={(text: string) => handleNumericChange("heightCm", text)}
            error={errors.heightCm}
          />
          <FormTextInput
            label="Kilo (kg)"
            keyboardType="numeric"
            value={form.weightKg}
            onChangeText={(text: string) => handleNumericChange("weightKg", text)}
            error={errors.weightKg}
          />
          <FormTextInput
            label="Hedef Kilo (kg)"
            keyboardType="numeric"
            value={form.targetWeightKg}
            onChangeText={(text: string) =>
                    handleNumericChange("targetWeightKg", text)
            }
            error={errors.targetWeightKg}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Hedefini Seç
          </Text>
          {goalOptions.map((option) => (
            <OptionPill
              key={option.value}
              {...option}
              selected={form.goal === option.value}
              onPress={() => handleSelect("goal", option.value)}
            />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Forma Sok Modu
          </Text>
          {focusOptions.map((option) => (
            <OptionPill
              key={option.value}
              {...option}
              selected={form.focus === option.value}
              onPress={() => handleSelect("focus", option.value)}
            />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Aktivite ve Frekans
          </Text>
          <View style={styles.rowWrap}>
            {activityOptions.map((option) => (
              <OptionPill
                key={option.value}
                {...option}
                selected={form.activityLevel === option.value}
                onPress={() => handleSelect("activityLevel", option.value)}
              />
            ))}
          </View>

          <Text style={[styles.subheading, { color: theme.colors.subText }]}>
            Haftalık antrenman sayısı
          </Text>
          <View style={styles.row}>
            {workoutOptions.map((option) => (
              <OptionPill
                key={option.value}
                {...option}
                selected={form.workoutsPerWeek === option.value}
                onPress={() => handleSelect("workoutsPerWeek", option.value)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Antrenman Deneyimi
          </Text>
          {experienceOptions.map((option) => (
            <OptionPill
              key={option.value}
              {...option}
              selected={form.experience === option.value}
              onPress={() => handleSelect("experience", option.value)}
            />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Ekipman Erişimi
          </Text>
          {equipmentOptions.map((option) => (
            <OptionPill
              key={option.value}
              {...option}
              selected={form.equipment === option.value}
              onPress={() => handleSelect("equipment", option.value)}
            />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Beslenme Tercihi
          </Text>
          <View style={styles.rowWrap}>
            {dietOptions.map((option) => (
              <OptionPill
                key={option.value}
                {...option}
                selected={form.dietPreference === option.value}
                onPress={() => handleSelect("dietPreference", option.value)}
              />
            ))}
          </View>
          <FormTextInput
            label="Sakatlık / Dikkat Notu"
            placeholder="Bilek sakatlığı, bel hassasiyeti vb."
            value={form.injuries}
            onChangeText={(text: string) => handleFreeTextChange("injuries", text)}
            multiline
          />
        </View>

        <PrimaryButton
          title="Planımı oluştur"
          onPress={handleSubmit}
          loading={loading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 20,
    gap: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    marginTop: 6,
  },
  section: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  subheading: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  rowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  pill: {
    flex: 1,
    minWidth: "45%",
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pillContent: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    flex: 1,
  },
  pillLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  pillSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  pillIcon: {
    width: 28,
  },
});

export default CoachSetupScreen;
