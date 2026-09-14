/* eslint-disable import/first -- jest.mock must be declared before the imports it affects */
/**
 * Tests for services/api.js — the shared axios instance, its interceptors and
 * the apiCall() error envelope every exported endpoint goes through.
 *
 * axios is mocked so the interceptor callbacks can be exercised directly,
 * without a network round trip. The happy-path integration test
 * (__tests__/happyPath.test.tsx) covers real requests via Polly.
 */

// jest.mock factories are hoisted above the imports, so the fake instance and
// the captured interceptors live inside the factory and are read back off the
// mocked module below.
jest.mock('axios', () => {
  const requestInterceptors = [];
  const responseInterceptors = [];
  const instance = {
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    patch: jest.fn(() => Promise.resolve({ data: {} })),
    interceptors: {
      request: { use: (onOk, onErr) => requestInterceptors.push({ onOk, onErr }) },
      response: { use: (onOk, onErr) => responseInterceptors.push({ onOk, onErr }) },
    },
  };

  return {
    __esModule: true,
    default: { create: jest.fn(() => instance) },
    __instance: instance,
    __requestInterceptors: requestInterceptors,
    __responseInterceptors: responseInterceptors,
  };
});

import axios, {
  __instance as mockInstance,
  __requestInterceptors,
  __responseInterceptors,
} from 'axios';
import * as api from '@/services/api';
import { registerToast } from '@/services/toastService';
import { setSession } from '@/services/sessionGlobalSingleton';
import i18n from '@/app/i18n';

const requestInterceptor = () => __requestInterceptors[0];
const responseInterceptor = () => __responseInterceptors[0];

describe('axios instance', () => {
  it('is created once, against the configured API base URL', () => {
    expect(axios.create).toHaveBeenCalledTimes(1);
    expect(axios.create).toHaveBeenCalledWith(
      expect.objectContaining({ baseURL: expect.any(String), timeout: 10000 })
    );
  });
});

describe('request interceptor', () => {
  afterEach(() => setSession(null));

  it('injects the current session headers', () => {
    setSession({ headers: { Authorization: 'Bearer abc123' } });

    const config = requestInterceptor().onOk({ headers: {} });

    expect(config.headers.Authorization).toBe('Bearer abc123');
  });

  it('always sends the active language', () => {
    const config = requestInterceptor().onOk({ headers: {} });

    expect(config.headers['Accept-Language']).toBe(i18n.language);
  });

  it('works with no session (unauthenticated calls such as login)', () => {
    const config = requestInterceptor().onOk({ headers: {} });

    expect(config.headers.Authorization).toBeUndefined();
  });
});

describe('response interceptor / auth errors', () => {
  const notFound = (message) => ({ response: { status: 404, data: { message } } });

  beforeEach(() => {
    registerToast(jest.fn());
    api.registerLogoutHandler(null);
  });

  it('logs the user out when the server says the user record is gone', async () => {
    const onLogout = jest.fn();
    api.registerLogoutHandler(onLogout);

    await expect(
      responseInterceptor().onErr(notFound("Couldn't find User with 'id'=42"))
    ).rejects.toBeDefined();

    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  it.each(['RecordNotFound', 'User not found'])(
    'also recognises the "%s" wording',
    async (message) => {
      const onLogout = jest.fn();
      api.registerLogoutHandler(onLogout);

      await expect(responseInterceptor().onErr(notFound(message))).rejects.toBeDefined();

      expect(onLogout).toHaveBeenCalled();
    }
  );

  it('does not log out on an unrelated 404', async () => {
    const onLogout = jest.fn();
    api.registerLogoutHandler(onLogout);

    await expect(responseInterceptor().onErr(notFound('Balance not found'))).rejects.toBeDefined();

    expect(onLogout).not.toHaveBeenCalled();
  });

  it('does not log out on a 401', async () => {
    const onLogout = jest.fn();
    api.registerLogoutHandler(onLogout);

    await expect(
      responseInterceptor().onErr({ response: { status: 401, data: { message: 'Unauthorized' } } })
    ).rejects.toBeDefined();

    expect(onLogout).not.toHaveBeenCalled();
  });

  it('re-rejects so callers still see the error', async () => {
    const error = notFound('Balance not found');

    await expect(responseInterceptor().onErr(error)).rejects.toBe(error);
  });
});

describe('apiCall', () => {
  let toastSpy;

  beforeEach(() => {
    toastSpy = jest.fn();
    registerToast(toastSpy);
  });

  it('passes the response through on success', async () => {
    const response = { data: { id: 1 } };

    await expect(api.apiCall(Promise.resolve(response))).resolves.toBe(response);
    expect(toastSpy).not.toHaveBeenCalled();
  });

  it('resolves to null and toasts the server error message on failure', async () => {
    const error = { response: { data: { errors: 'Email has already been taken' } } };

    await expect(api.apiCall(Promise.reject(error))).resolves.toBeNull();
    expect(toastSpy).toHaveBeenCalledWith('Email has already been taken', 'error');
  });

  it('falls back to a generic message when the server sends no errors field', async () => {
    await expect(api.apiCall(Promise.reject({ response: { data: {} } }))).resolves.toBeNull();
    expect(toastSpy).toHaveBeenCalledWith('An error occurred', 'error');
  });

  it('stays quiet on network errors (the reconnect banner covers those)', async () => {
    const error = new Error('Network Error');

    await expect(api.apiCall(Promise.reject(error))).resolves.toBeNull();
    expect(toastSpy).not.toHaveBeenCalled();
  });
});

describe('endpoint helpers', () => {
  beforeEach(() => {
    mockInstance.get.mockClear();
    mockInstance.post.mockClear();
    mockInstance.patch.mockClear();
    registerToast(jest.fn());
  });

  it('builds the balance URLs from the id', async () => {
    await api.getBalanceDetail(7);
    await api.getBalanceInfo(7);

    expect(mockInstance.get).toHaveBeenCalledWith('/balances/7');
    expect(mockInstance.get).toHaveBeenCalledWith('/balances/7/info');
  });

  it('maps createBalance arguments onto the snake_case payload', async () => {
    await api.createBalance([1, 2], 'Trip', 500, '2026-03-01', '2026-03-10');

    expect(mockInstance.post).toHaveBeenCalledWith('/balances/', {
      members: [1, 2],
      name: 'Trip',
      budget: 500,
      start_date: '2026-03-01',
      end_date: '2026-03-10',
    });
  });

  it('exposes createGroup as an alias of createBalance', () => {
    expect(api.createGroup).toBe(api.createBalance);
  });

  it('sends the status alongside accept/reject payment', async () => {
    await api.acceptPayment(3);
    await api.rejectPayment(4);

    expect(mockInstance.patch).toHaveBeenCalledWith('/payments/3/accept', { status: 'accepted' });
    expect(mockInstance.patch).toHaveBeenCalledWith('/payments/4/reject', { status: 'rejected' });
  });

  it('signup sends null for an empty phone number, not an empty string', async () => {
    await api.signup('Ana', 'Lopez', 'ana@test.dev', 'pw', 'pw', '');

    expect(mockInstance.post).toHaveBeenCalledWith(
      '/users',
      expect.objectContaining({ phone_number: null })
    );
  });

  it('signup passes a supplied phone number through untouched', async () => {
    await api.signup('Ana', 'Lopez', 'ana@test.dev', 'pw', 'pw', '5512345678');

    expect(mockInstance.post).toHaveBeenCalledWith(
      '/users',
      expect.objectContaining({ phone_number: '5512345678' })
    );
  });

  it('getProfile with no id hits the current user endpoint', async () => {
    await api.getProfile();

    expect(mockInstance.get).toHaveBeenCalledWith('/user/');
  });

  it('returns null instead of throwing when an endpoint fails', async () => {
    mockInstance.get.mockRejectedValueOnce({ response: { data: { errors: 'nope' } } });

    await expect(api.getBalances()).resolves.toBeNull();
  });
});
