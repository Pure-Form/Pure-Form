module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-url-polyfill|@unimodules|expo|@expo|expo-status-bar)/)'
  ],
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
};