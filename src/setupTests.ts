
// Jest setup file
import '@testing-library/jest-dom';

// Make Jest global variables available for TypeScript
declare global {
  namespace NodeJS {
    interface Global {
      expect: typeof jest.expect;
      test: typeof jest.test;
      describe: typeof jest.describe;
    }
  }
}
