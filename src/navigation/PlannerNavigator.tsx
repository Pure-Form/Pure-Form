import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import CoachPlanScreen from "@/screens/CoachPlanScreen";
import CoachSetupScreen from "@/screens/CoachSetupScreen";

export type PlannerStackParamList = {
  CoachPlan: undefined;
  CoachSetup: undefined;
};

const Stack = createNativeStackNavigator<PlannerStackParamList>();

const PlannerNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CoachPlan" component={CoachPlanScreen} />
      <Stack.Screen name="CoachSetup" component={CoachSetupScreen} />
    </Stack.Navigator>
  );
};

export default PlannerNavigator;
