// Runs before each test file.

// In-memory AsyncStorage provided by the library: no device storage is needed in tests.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
