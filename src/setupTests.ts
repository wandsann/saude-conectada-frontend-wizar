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

// Mock do matchMedia para testes
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock do ResizeObserver para testes
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
