// Runs before each test file.

// In-memory AsyncStorage provided by the library: no device storage is needed in tests.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Safe area insets of a phone without notch, provided by the library: no native module is needed.
jest.mock('react-native-safe-area-context', () => require('react-native-safe-area-context/jest/mock').default);
