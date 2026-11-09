// Importing expo-router/testing-library hides the React Native Testing Library matchers
// (toBeOnTheScreen, toBeDisabled...) from TypeScript. Declare them again on the "expect" module,
// which is the one used by "expect" of @jest/globals.
import type { JestNativeMatchers } from '@testing-library/react-native/dist/matchers/types';

declare module 'expect' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Matchers<R extends void | Promise<void>> extends JestNativeMatchers<R> {}
}
