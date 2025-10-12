function calculateBMR(profile) {
  return 10 * profile.weightKg + 6.25 * profile.heightCm - 5 * profile.age + 5;
}

function activityMultiplier(level) {
  switch (level) {
    case 'sedentary': return 1.2;
    case 'light': return 1.375;
    case 'moderate': return 1.55;
    case 'active': return 1.725;
    case 'very_active': return 1.9;
    default: return 1.2;
  }
}

function dailyCalories(profile) {
  var bmr = calculateBMR(profile);
  var multiplier = activityMultiplier(profile.activityLevel);
  var maintenance = Math.round(bmr * multiplier);
  if (profile.goal === 'lose') return Math.max(1200, maintenance - 500);
  if (profile.goal === 'gain') return maintenance + 300;
  return maintenance;
}

module.exports = { calculateBMR, activityMultiplier, dailyCalories };
