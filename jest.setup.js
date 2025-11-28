// Jest setup for React Native testing library
require('@testing-library/jest-native/extend-expect');

// Silence some expo warnings if needed
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
