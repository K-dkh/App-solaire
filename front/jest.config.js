// Jest configuration of the front-end. See Doc/Tests/strategie-de-test.md.
/** @type {import('jest').Config} */
module.exports = {
  // jest-expo transforms React Native and Expo modules and mocks the native ones.
  preset: 'jest-expo',
  setupFiles: ['<rootDir>/jest.setup.js'],

  // Only "*.test.ts(x)" files are tests: shared helpers can live next to them.
  // Tests stay outside src/app, otherwise Expo Router would treat them as screens.
  testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],

  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/__tests__/**', '!src/theme.ts'],
  coverageReporters: ['text', 'text-summary', 'lcov'],
};
