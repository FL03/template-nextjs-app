import '@testing-library/jest-dom';

// Global polyfills required by Next/server code during tests
if (typeof (globalThis as any).Request === 'undefined') {
  (globalThis as any).Request = class Request {};
  (globalThis as any).Response = class Response {};
  (globalThis as any).Headers = class Headers {};
}

if (typeof (globalThis as any).TextEncoder === 'undefined') {
  // use Node util TextEncoder/TextDecoder for Jest (Node versions used by CI/Jest)
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { TextEncoder, TextDecoder } = require('util');
  (globalThis as any).TextEncoder = TextEncoder;
  (globalThis as any).TextDecoder = TextDecoder;
}

if (typeof (window as any).matchMedia !== 'function') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {}, // deprecated API
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

// mock the app router used by useRouter()
const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
};

jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}));

// Prevent server-side middleware from executing during module evaluation in tests

jest.mock('./src/lib/supabase/helpers', () => ({
  supabaseKey: () => 'anon',
  supabaseUrl: () => 'http://localhost',
  supabaseCreds: () => ({ url: 'http://localhost', anonKey: 'anon' }),
}));

jest.mock('./src/lib/supabase/middleware', () => ({
  NextResponse: { next: ({ request }: any) => ({ request }) },
}));

jest.mock('./src/lib/logger', () => ({
  logger: { trace: jest.fn(), info: jest.fn(), error: jest.fn() },
}));
