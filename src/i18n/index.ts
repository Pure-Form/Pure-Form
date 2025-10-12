import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      onboarding: {
        headline: "Elevate Your Everyday",
        body: "Personalized workouts, smart nutrition insights, and daily progress tracking to keep your goals on course.",
        getStarted: "Get Started",
        login: "I already have an account"
      },
      auth: {
        welcomeBack: "Welcome back",
        createAccount: "Create your account",
        name: "Full name",
        email: "Email",
        password: "Password",
        height: "Height (cm)",
        weight: "Weight (kg)",
        goal: "Goal",
        goals: {
          lose: "Lose weight",
          maintain: "Maintain",
          gain: "Gain muscle"
        },
        register: "Sign up",
        login: "Sign in",
        switchToLogin: "Already registered? Sign in",
        switchToRegister: "New here? Create an account"
      },
      dashboard: {
        greeting: "Hi {{name}}",
        streak: "Day streak",
        calories: "Calories",
        workouts: "Workouts",
        hydration: "Hydration",
        todayPlan: "Today's Focus",
        viewAll: "View all",
        nutritionHeading: "Stay in your deficit",
        plannerHeading: "Workout planner",
        progressHeading: "Progress overview"
      },
      planner: {
        title: "Weekly Planner",
        primary: "Primary muscle",
        duration: "Duration",
        intensity: "Intensity"
      },
      progress: {
        title: "Progress",
        weight: "Weight",
        bodyFat: "Body fat",
        steps: "Steps"
      },
      settings: {
        language: "Language",
        theme: "Theme",
        dark: "Dark",
        light: "Light"
      }
    }
  },
  tr: {
    translation: {
      onboarding: {
        headline: "Her Gününü Güçlendir",
        body: "Kişiselleştirilmiş antrenmanlar, akıllı beslenme içgörüleri ve günlük ilerleme takibi ile hedeflerinde kal.",
        getStarted: "Başla",
        login: "Zaten hesabım var"
      },
      auth: {
        welcomeBack: "Tekrar hoş geldin",
        createAccount: "Hesabını oluştur",
        name: "Ad soyad",
        email: "E-posta",
        password: "Şifre",
        height: "Boy (cm)",
        weight: "Kilo (kg)",
        goal: "Hedef",
        goals: {
          lose: "Kilo ver",
          maintain: "Koru",
          gain: "Kas kazan"
        },
        register: "Kayıt ol",
        login: "Giriş yap",
        switchToLogin: "Zaten hesabın var mı? Giriş yap",
        switchToRegister: "Yeni misin? Kayıt ol"
      },
      dashboard: {
        greeting: "Merhaba {{name}}",
        streak: "Seri",
        calories: "Kalori",
        workouts: "Antrenman",
        hydration: "Su",
        todayPlan: "Bugünün odağı",
        viewAll: "Hepsini gör",
        nutritionHeading: "Kalori açığını koru",
        plannerHeading: "Antrenman planlayıcı",
        progressHeading: "İlerleme özeti"
      },
      planner: {
        title: "Haftalık Plan",
        primary: "Ana kas",
        duration: "Süre",
        intensity: "Yoğunluk"
      },
      progress: {
        title: "İlerleme",
        weight: "Kilo",
        bodyFat: "Yağ oranı",
        steps: "Adımlar"
      },
      settings: {
        language: "Dil",
        theme: "Tema",
        dark: "Karanlık",
        light: "Aydınlık"
      }
    }
  }
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    compatibilityJSON: "v4",
    resources,
    lng: Localization.getLocales()[0]?.languageCode === "tr" ? "tr" : "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });
}

export default i18n;
