/* eslint-disable @typescript-eslint/no-require-imports -- module isolation needs require() */
/**
 * Session persistence. On native it goes through expo-secure-store, on web
 * through AsyncStorage; both are mocked in jest.setup.js.
 *
 * getSession() memoises the token in module scope, so every test starts from a
 * fresh module registry to keep that cache from leaking between cases.
 */
import { Platform } from 'react-native';

const loadStorage = () => {
  let storage;
  jest.isolateModules(() => {
    storage = require('@/services/useStorage');
  });
  return storage;
};

const user = { id: 1, first_name: 'Ana' };

describe('saveSession / getSession', () => {
  beforeEach(() => {
    (require('expo-secure-store') as any).__reset();
  });

  it('round-trips the token and the user, and builds the auth header', async () => {
    const { saveSession, getSession } = loadStorage();

    await saveSession('token-123', user);

    await expect(getSession()).resolves.toEqual({
      token: 'token-123',
      user,
      headers: { Authorization: 'Bearer token-123' },
    });
  });

  it('serialises the user as JSON in secure storage', async () => {
    const SecureStore = require('expo-secure-store');
    const { saveSession } = loadStorage();

    await saveSession('token-123', user);

    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('authToken', 'token-123');
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('user', JSON.stringify(user));
  });

  it('returns a null session when nothing was ever stored', async () => {
    const { getSession } = loadStorage();

    await expect(getSession()).resolves.toEqual({
      token: null,
      user: null,
      headers: { Authorization: 'Bearer null' },
    });
  });

  it('serves later reads from the in-memory cache', async () => {
    const SecureStore = require('expo-secure-store');
    const { saveSession, getSession } = loadStorage();

    await saveSession('token-123', user);
    await getSession();
    SecureStore.getItemAsync.mockClear();

    await getSession();

    expect(SecureStore.getItemAsync).not.toHaveBeenCalled();
  });

  it('clearCache forces the next read back to storage', async () => {
    const SecureStore = require('expo-secure-store');
    const { saveSession, getSession, clearCache } = loadStorage();

    await saveSession('token-123', user);
    await getSession();
    clearCache();
    SecureStore.getItemAsync.mockClear();

    await getSession();

    expect(SecureStore.getItemAsync).toHaveBeenCalledWith('authToken');
  });
});

describe('deleteSession', () => {
  it('removes both keys from secure storage', async () => {
    const { saveSession, deleteSession, getSession, clearCache } = loadStorage();

    await saveSession('token-123', user);
    await deleteSession();
    clearCache();

    await expect(getSession()).resolves.toMatchObject({ token: null, user: null });
  });
});

describe('on web', () => {
  const originalOS = Platform.OS;

  beforeAll(() => {
    Object.defineProperty(Platform, 'OS', { value: 'web', configurable: true });
  });

  afterAll(() => {
    Object.defineProperty(Platform, 'OS', { value: originalOS, configurable: true });
  });

  it('uses AsyncStorage instead of secure store', async () => {
    const asyncStorageModule = require('@react-native-async-storage/async-storage');
    const AsyncStorage = asyncStorageModule.default ?? asyncStorageModule;
    const SecureStore = require('expo-secure-store');
    const { saveSession } = loadStorage();

    await saveSession('token-web', user);

    expect(AsyncStorage.setItem).toHaveBeenCalledWith('authToken', 'token-web');
    expect(SecureStore.setItemAsync).not.toHaveBeenCalledWith('authToken', 'token-web');
  });
});
