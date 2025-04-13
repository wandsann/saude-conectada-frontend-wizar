import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveClass(className: string): R;
      toHaveStyle(style: Record<string, any>): R;
    }
  }

  var jest: typeof import('@jest/globals')['jest'];
  var expect: typeof import('@jest/globals')['expect'];
  var it: typeof import('@jest/globals')['it'];
  var describe: typeof import('@jest/globals')['describe'];
  var beforeEach: typeof import('@jest/globals')['beforeEach'];
  var afterEach: typeof import('@jest/globals')['afterEach'];
} 