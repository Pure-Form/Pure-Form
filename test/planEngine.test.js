const assert = require('assert');
const { dailyCalories } = require('../src/lib/planEngine');

describe('planEngine', () => {
  it('calculates a daily calorie roughly for maintenance', () => {
    const profile = { age: 30, weightKg: 70, heightCm: 175, activityLevel: 'moderate', goal: 'maintain' };
    const cals = dailyCalories(profile);
    assert.ok(cals > 1500 && cals < 3200);
  });
});
