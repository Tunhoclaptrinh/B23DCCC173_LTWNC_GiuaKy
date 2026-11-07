import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'node:util';

Object.defineProperties(globalThis, {
  TextEncoder: { value: TextEncoder, configurable: true },
  TextDecoder: { value: TextDecoder, configurable: true },
});
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
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
globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
window.scrollTo = jest.fn();
Element.prototype.scrollIntoView = jest.fn();
