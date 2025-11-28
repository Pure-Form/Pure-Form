// Jest setup for React Native Testing Library
require('@testing-library/jest-native/extend-expect');

// Silence native animated warnings
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');