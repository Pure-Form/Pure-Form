import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { supabase } from "@/lib/supabase";
import { RootStackParamList } from "@/navigation/AppNavigator";
import { addBreadcrumb, logError } from "@/utils/errorLogging";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ProfileEdit"
>;

type Props = {
  navigation: NavigationProp;
};

const ProfileEditScreen = ({ navigation }: Props) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { user, setUser } = useAuth();

  const [name, setName] = useState(user?.name ?? "");
  const [heightCm, setHeightCm] = useState(String(user?.heightCm ?? 170));
  const [weightKg, setWeightKg] = useState(String(user?.weightKg ?? 70));
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!user) return;

    // Validation
    const height = Number(heightCm);
    const weight = Number(weightKg);

    if (!name.trim()) {
      Alert.alert(
        t("profile.error") || "Error",
        t("profile.nameRequired") || "Name is required",
      );
      return;
    }

    if (height < 100 || height > 250) {
      Alert.alert(
        t("profile.error") || "Error",
        t("profile.heightInvalid") || "Height must be between 100-250 cm",
      );
      return;
    }

    if (weight < 30 || weight > 300) {
      Alert.alert(
        t("profile.error") || "Error",
        t("profile.weightInvalid") || "Weight must be between 30-300 kg",
      );
      return;
    }

    setLoading(true);
    addBreadcrumb("Updating profile", "user-action", {
      heightCm: height,
      weightKg: weight,
    });

    try {
      // Update Supabase user metadata
      const { data, error } = await supabase.auth.updateUser({
        data: {
          name: name.trim(),
          heightCm: height,
          weightKg: weight,
          goal: user.goal,
        },
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // Update local user state
        setUser({
          ...user,
          name: name.trim(),
          heightCm: height,
          weightKg: weight,
        });

        addBreadcrumb("Profile updated successfully", "user-action");

        Alert.alert(
          t("profile.success") || "Success",
          t("profile.updateSuccess") || "Profile updated successfully",
          [
            {
              text: t("common.ok") || "OK",
              onPress: () => navigation.goBack(),
            },
          ],
        );
      }
    } catch (error) {
      logError(error instanceof Error ? error : new Error(String(error)), {
        context: "ProfileEdit",
        userId: user.id,
      });

      Alert.alert(
        t("profile.error") || "Error",
        error instanceof Error
          ? error.message
          : t("profile.updateError") || "Failed to update profile",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={({ pressed }) => [
                styles.backButton,
                {
                  backgroundColor: theme.colors.surface,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
            </Pressable>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              {t("profile.editProfile") || "Edit Profile"}
            </Text>
            <View style={styles.placeholder} />
          </View>

          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <View
              style={[
                styles.avatar,
                { backgroundColor: theme.colors.accentSoft },
              ]}
            >
              <Ionicons name="person" size={48} color={theme.colors.accent} />
            </View>
            <Text style={[styles.email, { color: theme.colors.subText }]}>
              {user?.email}
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Name */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.colors.subText }]}>
                {t("profile.name") || "Name"}
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder={t("profile.namePlaceholder") || "Enter your name"}
                placeholderTextColor={theme.colors.subText}
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                    color: theme.colors.text,
                  },
                ]}
                autoCapitalize="words"
                editable={!loading}
              />
            </View>

            {/* Height */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.colors.subText }]}>
                {t("profile.height") || "Height (cm)"}
              </Text>
              <TextInput
                value={heightCm}
                onChangeText={setHeightCm}
                placeholder="170"
                placeholderTextColor={theme.colors.subText}
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                    color: theme.colors.text,
                  },
                ]}
                keyboardType="numeric"
                editable={!loading}
              />
            </View>

            {/* Weight */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.colors.subText }]}>
                {t("profile.weight") || "Weight (kg)"}
              </Text>
              <TextInput
                value={weightKg}
                onChangeText={setWeightKg}
                placeholder="70"
                placeholderTextColor={theme.colors.subText}
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                    color: theme.colors.text,
                  },
                ]}
                keyboardType="numeric"
                editable={!loading}
              />
            </View>

            {/* Goal (Read-only for now) */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.colors.subText }]}>
                {t("profile.goal") || "Goal"}
              </Text>
              <View
                style={[
                  styles.input,
                  styles.readOnlyInput,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <Text
                  style={[styles.readOnlyText, { color: theme.colors.subText }]}
                >
                  {user?.goal === "lose"
                    ? t("profile.goalLose") || "Lose Weight"
                    : user?.goal === "gain"
                      ? t("profile.goalGain") || "Gain Muscle"
                      : t("profile.goalMaintain") || "Maintain"}
                </Text>
                <Ionicons
                  name="lock-closed-outline"
                  size={16}
                  color={theme.colors.subText}
                />
              </View>
              <Text style={[styles.hint, { color: theme.colors.subText }]}>
                {t("profile.goalHint") || "Contact support to change your goal"}
              </Text>
            </View>
          </View>

          {/* Save Button */}
          <Pressable
            onPress={handleSave}
            disabled={loading}
            style={({ pressed }) => [
              styles.saveButton,
              {
                backgroundColor: theme.colors.accent,
                opacity: pressed || loading ? 0.7 : 1,
              },
            ]}
          >
            {loading ? (
              <Text
                style={[
                  styles.saveButtonText,
                  { color: theme.colors.background },
                ]}
              >
                {t("common.saving") || "Saving..."}
              </Text>
            ) : (
              <>
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={theme.colors.background}
                />
                <Text
                  style={[
                    styles.saveButtonText,
                    { color: theme.colors.background },
                  ]}
                >
                  {t("common.save") || "Save Changes"}
                </Text>
              </>
            )}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    gap: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  placeholder: {
    width: 44,
  },
  avatarContainer: {
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  email: {
    fontSize: 14,
  },
  form: {
    gap: 20,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  input: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
  },
  readOnlyInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  readOnlyText: {
    fontSize: 16,
  },
  hint: {
    fontSize: 12,
    marginTop: 4,
  },
  saveButton: {
    marginTop: "auto",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ProfileEditScreen;
