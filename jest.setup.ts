import "@testing-library/jest-native/extend-expect";
import "react-native-gesture-handler/jestSetup";

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock("expo-constants", () => ({ manifest: { extra: {} } }));
