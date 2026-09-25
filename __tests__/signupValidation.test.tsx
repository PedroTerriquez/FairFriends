/**
 * Signup phone-number contract.
 *
 * The phone number is optional: the email is the unique identifier and the
 * password-recovery channel. Leaving the field empty must still create an
 * account. When a number *is* given it has to be a valid one.
 *
 * The signup screen has no client-side phone validation, so these tests drive
 * the real screen against Polly fixtures. Re-record with:
 *   rm -rf __recordings__/signup-* && npm run test:record -- signupValidation
 */

import React from 'react';
import { render, fireEvent, waitFor, act, screen } from '@testing-library/react-native';
import { I18nextProvider } from 'react-i18next';
import { setupPolly } from './helpers/polly';

import i18n from '../app/i18n';
import { SessionProvider, useSession } from '../services/authContext';
import { ServerProvider } from '../services/serverContext';
import { ToastProvider } from '../services/ToastContext';
import SignUp from '../app/signup';
import { clearCache, deleteSession } from '../services/useStorage';

// Exposes the live session so assertions can check it directly instead of
// inferring "did we sign in?" from navigation alone.
function SessionProbe() {
  const { session } = useSession();
  (global as any).__session = session;
  return null;
}

function TestApp() {
  return (
    <I18nextProvider i18n={i18n}>
      <ServerProvider>
        <SessionProvider>
          <ToastProvider>
            <SessionProbe />
            <SignUp />
          </ToastProvider>
        </SessionProvider>
      </ServerProvider>
    </I18nextProvider>
  );
}

const fillForm = (phone?: string) => {
  const stamp = Date.now();
  fireEvent.changeText(screen.getByTestId('signup-first-name'), 'Phone');
  fireEvent.changeText(screen.getByTestId('signup-last-name'), 'Probe');
  fireEvent.changeText(screen.getByTestId('signup-email'), `phone-probe-${stamp}@test.dev`);
  if (phone !== undefined) {
    fireEvent.changeText(screen.getByTestId('signup-phone-number'), phone);
  }
  fireEvent.changeText(screen.getByTestId('signup-password'), 'password123');
  fireEvent.changeText(screen.getByTestId('signup-confirm-password'), 'password123');
};

const submit = async () => {
  await act(async () => {
    fireEvent.press(screen.getByTestId('signup-submit'));
  });
};

const expectSignedIn = async () => {
  await waitFor(
    () => expect((global as any).__router.router.replace).toHaveBeenCalledWith('/(tabs)/home'),
    { timeout: 5000 }
  );
  expect((global as any).__session).not.toBeNull();
};

const expectRejected = async () => {
  // Let the POST come back before asserting the negative — otherwise this
  // would pass simply because the request had not resolved yet.
  await act(async () => {
    await new Promise((resolve) => setImmediate(resolve));
  });
  expect((global as any).__session).toBeNull();
  expect((global as any).__router.router.replace).not.toHaveBeenCalledWith('/(tabs)/home');
  expect(screen.getByTestId('signup-submit')).toBeTruthy();
};

describe('signup: the phone number is optional', () => {
  let polly: any;

  beforeEach(async () => {
    // Each test signs a new user in, and useStorage caches the session at
    // module scope — without this the next test starts already logged in.
    await deleteSession();
    clearCache();

    // One recording per test — a shared name would make each test's fixtures
    // overwrite the previous one when Polly stops.
    const name = expect
      .getState()
      .currentTestName!.replace(/[^a-z0-9]+/gi, '-')
      .toLowerCase();
    polly = setupPolly(`signup-${name}`);
    (global as any).__router.reset();
    (global as any).__session = undefined;
  });

  afterEach(async () => {
    await polly?.stop();
  });

  it('creates the account when the phone field is left empty', async () => {
    render(<TestApp />);
    fillForm('');
    await submit();

    await expectSignedIn();
  }, 30000);

  it('creates the account when the phone field is never touched', async () => {
    render(<TestApp />);
    fillForm();
    await submit();

    await expectSignedIn();
  }, 30000);

  it('creates the account with a valid phone number', async () => {
    render(<TestApp />);
    fillForm(`55${String(Date.now()).slice(-8)}`);
    await submit();

    await expectSignedIn();
  }, 30000);

  it('rejects a phone number that is too short', async () => {
    render(<TestApp />);
    fillForm('123');
    await submit();

    await expectRejected();
  }, 30000);
});
