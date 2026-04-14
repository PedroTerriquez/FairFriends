/* eslint-disable @typescript-eslint/no-var-requires */
// Test environment setup. Runs before each test file via package.json -> jest.setupFiles.

// 0. Load .env so EXPO_PUBLIC_API and friends are available to mocks + real HTTP.
require('dotenv').config({
  path: require('path').resolve(__dirname, '.env'),
});

// 0b. axios is remapped to its node build via jest.moduleNameMapper so that
// Polly's node-http adapter can intercept requests. jest-expo's default
// resolution picks the react-native/browser bundle, which only has XHR/fetch
// adapters and cannot be intercepted by nock.

// 1. expo-constants ------------------------------------------------------------
// Must be mocked BEFORE services/api.js is imported, since api.js reads
// Constants.expoConfig.extra.EXPO_PUBLIC_API at module load time.
jest.mock('expo-constants', () => ({
  __esModule: true,
  default: {
    expoConfig: {
      extra: {
        EXPO_PUBLIC_API: process.env.EXPO_PUBLIC_API || 'http://localhost:3000',
      },
    },
  },
}));

// 1b. @react-native-async-storage/async-storage -------------------------------
jest.mock(
  '@react-native-async-storage/async-storage',
  () => require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// 2. expo-secure-store ---------------------------------------------------------
jest.mock('expo-secure-store', () => {
  const store = new Map();
  return {
    __esModule: true,
    getItemAsync: jest.fn((key) => Promise.resolve(store.has(key) ? store.get(key) : null)),
    setItemAsync: jest.fn((key, value) => {
      store.set(key, value);
      return Promise.resolve();
    }),
    deleteItemAsync: jest.fn((key) => {
      store.delete(key);
      return Promise.resolve();
    }),
    __reset: () => store.clear(),
  };
});

// 3. expo-localization ---------------------------------------------------------
jest.mock('expo-localization', () => ({
  __esModule: true,
  getLocales: () => [{ languageCode: 'en', languageTag: 'en-US' }],
  getCalendars: () => [{ calendar: 'gregorian' }],
}));

// 4. @expo/vector-icons --------------------------------------------------------
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  const makeIcon =
    () =>
    ({ name, testID, ...rest }) =>
      React.createElement(Text, { testID, ...rest }, name ? `[${name}]` : null);
  return {
    __esModule: true,
    Ionicons: makeIcon(),
    MaterialIcons: makeIcon(),
    MaterialCommunityIcons: makeIcon(),
    FontAwesome: makeIcon(),
    FontAwesome5: makeIcon(),
    Feather: makeIcon(),
    AntDesign: makeIcon(),
    Entypo: makeIcon(),
    Octicons: makeIcon(),
    SimpleLineIcons: makeIcon(),
    Foundation: makeIcon(),
    Fontisto: makeIcon(),
    Zocial: makeIcon(),
    EvilIcons: makeIcon(),
  };
});

// 5. expo-router ---------------------------------------------------------------
// Lightweight router mock. Tests use the global helper __router to inspect/drive
// navigation state. Screens that call router.push/replace mutate currentRoute,
// which the TestNavigator helper observes to render the next screen.
jest.mock('expo-router', () => {
  const React = require('react');
  const { View } = require('react-native');

  const state = {
    current: '/login',
    params: {},
    listeners: new Set(),
    history: [],
  };

  const navigate = (target) => {
    let path;
    let params = {};
    if (typeof target === 'string') {
      path = target;
    } else if (target && typeof target === 'object') {
      path = target.pathname;
      params = target.params || {};
    }
    if (!path) return;
    state.current = path;
    state.params = params;
    state.history.push({ path, params });
    state.listeners.forEach((l) => l(path, params));
  };

  const router = {
    push: jest.fn(navigate),
    replace: jest.fn(navigate),
    back: jest.fn(() => {
      state.history.pop();
      const prev = state.history[state.history.length - 1];
      if (prev) {
        state.current = prev.path;
        state.params = prev.params;
        state.listeners.forEach((l) => l(prev.path, prev.params));
      }
    }),
    navigate: jest.fn(navigate),
    setParams: jest.fn(),
    canGoBack: jest.fn(() => state.history.length > 1),
  };

  global.__router = {
    state,
    router,
    reset: () => {
      state.current = '/login';
      state.params = {};
      state.history = [];
      router.push.mockClear();
      router.replace.mockClear();
      router.back.mockClear();
      router.navigate.mockClear();
    },
  };

  const Passthrough = ({ children }) => React.createElement(View, null, children);
  const Stack = Object.assign(Passthrough, {
    Screen: () => null,
  });
  const Tabs = Object.assign(Passthrough, {
    Screen: () => null,
  });

  return {
    __esModule: true,
    router,
    useRouter: () => router,
    useLocalSearchParams: () => state.params,
    useGlobalSearchParams: () => state.params,
    useSegments: () => [],
    usePathname: () => state.current,
    useFocusEffect: (cb) => {
      // Behave like useEffect on mount.
      React.useEffect(() => {
        const cleanup = cb();
        return typeof cleanup === 'function' ? cleanup : undefined;
      }, []);
    },
    Stack,
    Tabs,
    Link: ({ children, href, ...rest }) => React.createElement(View, rest, children),
    Redirect: () => null,
    Slot: Passthrough,
    SplashScreen: { hideAsync: jest.fn(), preventAutoHideAsync: jest.fn() },
  };
});

// 6. react-native-reanimated ---------------------------------------------------
// jest-expo handles most RN modules but reanimated needs the official mock.
try {
  // eslint-disable-next-line global-require
  jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));
} catch (_e) {
  // mock not present; ignore
}

// 7. moti ----------------------------------------------------------------------
// Moti depends on reanimated and is used for animations only — stub View.
jest.mock('moti', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    MotiView: ({ children, ...rest }) => React.createElement(View, rest, children),
    MotiText: ({ children, ...rest }) => React.createElement(Text, rest, children),
    AnimatePresence: ({ children }) => children,
  };
});

// 7b. Toast component — the real one starts timers that outlive the test run,
// spamming errors after teardown. Replace with a passthrough that renders
// nothing visible but keeps the `useToast()` hook functional.
jest.mock('@/presentational/Toast', () => {
  const React = require('react');
  return { __esModule: true, default: () => null };
});
// Same mock via the relative path used inside ToastContext.
jest.mock('./presentational/Toast', () => {
  const React = require('react');
  return { __esModule: true, default: () => null };
}, { virtual: true });

// 8. Skeleton placeholder libs (used by SkeletonWrapper) -----------------------
jest.mock('moti/skeleton', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    Skeleton: ({ children, ...rest }) => React.createElement(View, rest, children),
  };
});

// 9. serverContext — its /health polling uses global fetch, which in Node 18+
// bypasses Polly's node-http adapter. Replace the whole provider with a stub
// that short-circuits serverReady=true so screens don't block on a health
// check that never happens in tests.
jest.mock('@/services/serverContext', () => {
  const React = require('react');
  const Ctx = React.createContext({ serverReady: true, serverLoading: false });
  return {
    __esModule: true,
    ServerProvider: ({ children }) =>
      React.createElement(Ctx.Provider, { value: { serverReady: true, serverLoading: false } }, children),
    useServer: () => ({ serverReady: true, serverLoading: false }),
  };
});
// Also cover relative-path imports used by root _layout.tsx.
jest.mock('./services/serverContext', () => {
  const React = require('react');
  const Ctx = React.createContext({ serverReady: true, serverLoading: false });
  return {
    __esModule: true,
    ServerProvider: ({ children }) =>
      React.createElement(Ctx.Provider, { value: { serverReady: true, serverLoading: false } }, children),
    useServer: () => ({ serverReady: true, serverLoading: false }),
  };
}, { virtual: true });

// 10. Silence noisy console warnings during tests ------------------------------
const originalWarn = console.warn;
console.warn = (...args) => {
  const msg = args[0];
  if (typeof msg === 'string' && /useNativeDriver|deprecated|act\(/.test(msg)) return;
  originalWarn(...args);
};
