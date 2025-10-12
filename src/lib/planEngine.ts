export type UserProfile = {
  age: number;
  weightKg: number;
  heightCm: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'lose' | 'maintain' | 'gain';
};

export function calculateBMR(profile: UserProfile) {
  // Mifflin-St Jeor approx for men/women combined (simple avg) - for demo only
  // Using: 10*kg + 6.25*cm - 5*age + 5
  return 10 * profile.weightKg + 6.25 * profile.heightCm - 5 * profile.age + 5;
}

export function activityMultiplier(level: UserProfile['activityLevel']) {
  switch (level) {
    case 'sedentary': return 1.2;
    case 'light': return 1.375;
    case 'moderate': return 1.55;
    case 'active': return 1.725;
    case 'very_active': return 1.9;
    default: return 1.2;
  }
}

export function dailyCalories(profile: UserProfile) {
  const bmr = calculateBMR(profile);
  const multiplier = activityMultiplier(profile.activityLevel);
  const maintenance = Math.round(bmr * multiplier);
  if (profile.goal === 'lose') return Math.max(1200, maintenance - 500);
  if (profile.goal === 'gain') return maintenance + 300;
  return maintenance;
}
