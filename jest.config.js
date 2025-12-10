module.exports = {
  preset: 'jest-expo',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|expo(nent)?|@expo|expo-router|@expo/.*|expo-modules-core|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo)/)',
  ],
};
