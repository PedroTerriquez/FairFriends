/* eslint-disable import/first */
/**
 * End-to-end happy-path integration test. Steps 1–19:
 *  1.  Friend signs up
 *  2.  Principal signs up
 *  3.  Principal logs in (implicit after signup)
 *  4.  Contacts → add friend
 *  5.  Principal logs out
 *  6.  Friend logs in → Contacts → accepts request
 *  7.  Friend logs out
 *  8.  Principal logs in → sees friend
 *  9.  Principal opens Balances tab
 * 10.  Starts a new balance
 * 11.  Adds Friend as a member and creates it
 * 12.  Adds 3 payments: "notification test", "balance test", "dashboard test"
 * 13.  Creates a promise with Friend
 * 14.  Logs out
 * 15.  Friend logs in → accept "dashboard test" from Home
 * 16.  Friend → Notifications → accept "notification test"
 * 17.  Friend → Balances → open balance → accept "balance test"
 * 18.  Friend → Promises → accept Principal's promise
 * 19.  Friend → creates a reverse promise back to Principal
 *
 * Backend: Polly.js in VCR mode. On first run, hits the real backend at
 * EXPO_PUBLIC_API and records to __recordings__/happy-path/. Later runs replay
 * from those fixtures.
 *
 * Record mode:
 *   rm -rf __recordings__/happy-path
 *   EXPO_PUBLIC_API=http://localhost:3000 POLLY_MODE=record npm test
 *
 * Replay mode (default):
 *   npm test
 *
 * NOTE: This project is a work in progress. Several assertions are expected
 * to fail until backend endpoints / response shapes stabilize. The test is a
 * living spec — failures should point at real gaps, not test bugs.
 */

import React from 'react';
import { Text, View } from 'react-native';
import { render, fireEvent, waitFor, act, screen } from '@testing-library/react-native';
import { I18nextProvider } from 'react-i18next';
import { setupPolly } from './helpers/polly';

import i18n from '../app/i18n';
import { SessionProvider, useSession } from '../services/authContext';
import { ServerProvider } from '../services/serverContext';
import { ToastProvider } from '../services/ToastContext';

import Login from '../app/login';
import SignUp from '../app/signup';
import Profile from '../app/profile';
import Contacts from '../app/(tabs)/contactsIndex';
import AddContact from '../app/addContact';
import ContactRequests from '../app/contactRequests';
import Home from '../app/(tabs)/home';
import BalancesIndex from '../app/(tabs)/balancesIndex';
import PromisesIndex from '../app/(tabs)/promisesIndex';
import FormBalance from '../app/formBalance';
import BalanceShow from '../app/balanceShow';
import FormPayment from '../app/formPayment';
import FormPromise from '../app/formPromise';
import PromiseShow from '../app/promiseShow';
import Notifications from '../app/notifications';

// ---- Test navigator ---------------------------------------------------------
// Renders whichever screen matches the mocked router's current path. Expo Router
// is mocked in jest.setup.js, exposing a singleton state on global.__router.

function TestNavigator() {
  const state = (global as any).__router.state;
  const [path, setPath] = React.useState<string>(state.current || '/login');
  const { signOut, session } = useSession();

  React.useEffect(() => {
    const listener = (next: string) => setPath(next);
    state.listeners.add(listener);
    // Sync once in case the path changed before we subscribed.
    setPath(state.current);
    return () => state.listeners.delete(listener);
  }, [state]);

  // Expose signOut on global so the test can invoke it without relying on
  // profile.tsx rendering the "me === 1" logout button.
  React.useEffect(() => {
    (global as any).__auth = { signOut, session };
  }, [signOut, session]);

  const key = `${path}-${session ? 'auth' : 'anon'}`;

  if (path === '/' || path === '/login')
    return <Login key={key} />;
  if (path === '/signup') return <SignUp key={key} />;
  if (path === '/profile') return <Profile key={key} />;
  if (path === '/addContact') return <AddContact key={key} />;
  if (path === '/contactRequests') return <ContactRequests key={key} />;
  // Explicit (non-tab-prefixed) paths for screens driven by steps 9+.
  // Steps 1–8 rely on `/(tabs)/*` always resolving to Contacts (see below),
  // so the new routes are unprefixed to avoid disturbing that behavior.
  if (path === '/home') return <Home key={key} />;
  if (path === '/balancesIndex') return <BalancesIndex key={key} />;
  if (path === '/promisesIndex') return <PromisesIndex key={key} />;
  if (path === '/formBalance') return <FormBalance key={key} />;
  if (path === '/balanceShow') return <BalanceShow key={key} />;
  if (path === '/formPayment') return <FormPayment key={key} />;
  if (path === '/formPromise') return <FormPromise key={key} />;
  if (path === '/promiseShow') return <PromiseShow key={key} />;
  if (path === '/notifications') return <Notifications key={key} />;
  // Any /(tabs)/* path renders the Contacts screen (legacy behavior for
  // steps 1–8, which enter tabs via signUp's router.replace('/(tabs)/home')).
  if (path.startsWith('/(tabs)') || path === '/contactsIndex')
    return <Contacts key={key} />;
  return (
    <View>
      <Text testID="unknown-route">Unknown route: {path}</Text>
    </View>
  );
}

function TestApp() {
  return (
    <I18nextProvider i18n={i18n}>
      <ServerProvider>
        <SessionProvider>
          <ToastProvider>
            <TestNavigator />
          </ToastProvider>
        </SessionProvider>
      </ServerProvider>
    </I18nextProvider>
  );
}

// ---- Helpers ----------------------------------------------------------------

const routerGo = (path: string) => {
  act(() => {
    (global as any).__router.router.push(path);
  });
};

const resetRouter = () => {
  (global as any).__router.reset();
};

const signOut = async () => {
  await act(async () => {
    (global as any).__auth?.signOut?.();
  });
};

// Step tracer — prints to stderr so failures surface the furthest reached step
// when run in CI. Comment out or remove once the Part B fixtures are stable.
const step = (label: string) => {
  // eslint-disable-next-line no-console
  console.log(`[step] ${label}`);
};

// ---- The test ---------------------------------------------------------------

describe('happy path: two-user contact flow', () => {
  let polly: any;

  beforeEach(() => {
    polly = setupPolly('happy-path');
    resetRouter();
  });

  afterEach(async () => {
    await polly?.stop();
  });

  it('friend signs up, principal adds friend, friend accepts, principal sees it', async () => {
    // Use timestamped emails so record-mode runs don't collide with prior users
    // in the backend DB. Polly is configured to match requests by method+URL+order,
    // not by body, so replay mode still works even though the email differs.
    const stamp = Date.now();
    const FRIEND = {
      first: 'Friend',
      last: 'Tester',
      email: `friend-e2e-${stamp}@test.dev`,
      pw: 'password123',
    };
    const ME = {
      first: 'Principal',
      last: 'Tester',
      email: `principal-e2e-${stamp}@test.dev`,
      pw: 'password123',
    };

    render(<TestApp />);

    // ------------------------------------------------------------------
    // Step 1 — Friend signs up
    // ------------------------------------------------------------------
    // Start at /login; tap "go to signup" link.
    await waitFor(() => expect(screen.getByTestId('login-submit')).toBeTruthy());
    fireEvent.press(screen.getByTestId('login-go-to-signup'));

    await waitFor(() => expect(screen.getByTestId('signup-submit')).toBeTruthy());
    fireEvent.changeText(screen.getByTestId('signup-first-name'), FRIEND.first);
    fireEvent.changeText(screen.getByTestId('signup-last-name'), FRIEND.last);
    fireEvent.changeText(screen.getByTestId('signup-email'), FRIEND.email);
    fireEvent.changeText(screen.getByTestId('signup-password'), FRIEND.pw);
    fireEvent.changeText(screen.getByTestId('signup-confirm-password'), FRIEND.pw);
    fireEvent.press(screen.getByTestId('signup-submit'));

    // signUp → router.replace('/(tabs)/home') → TestNavigator renders Contacts.
    await waitFor(
      () => expect(screen.getByTestId('contacts-add-friend')).toBeTruthy(),
      { timeout: 5000 }
    );

    // Friend is now authenticated. Log out so we can register the principal.
    await signOut();
    routerGo('/login');
    await waitFor(() => expect(screen.getByTestId('login-submit')).toBeTruthy());

    // ------------------------------------------------------------------
    // Step 2 — Principal signs up
    // ------------------------------------------------------------------
    fireEvent.press(screen.getByTestId('login-go-to-signup'));
    await waitFor(() => expect(screen.getByTestId('signup-submit')).toBeTruthy());
    fireEvent.changeText(screen.getByTestId('signup-first-name'), ME.first);
    fireEvent.changeText(screen.getByTestId('signup-last-name'), ME.last);
    fireEvent.changeText(screen.getByTestId('signup-email'), ME.email);
    fireEvent.changeText(screen.getByTestId('signup-password'), ME.pw);
    fireEvent.changeText(screen.getByTestId('signup-confirm-password'), ME.pw);
    fireEvent.press(screen.getByTestId('signup-submit'));

    // Step 3 is implicit — signUp auto-logs the user in.
    await waitFor(
      () => expect(screen.getByTestId('contacts-add-friend')).toBeTruthy(),
      { timeout: 5000 }
    );

    // ------------------------------------------------------------------
    // Step 4 — Principal adds friend from contacts tab
    // ------------------------------------------------------------------
    fireEvent.press(screen.getByTestId('contacts-add-friend'));
    routerGo('/addContact');

    await waitFor(() => expect(screen.getByTestId('add-contact-search')).toBeTruthy());
    // Search by the friend's unique email so findPeople returns exactly the
    // user we just registered — not seed users named "Friend 1"/"Friend 2".
    fireEvent.changeText(screen.getByTestId('add-contact-search'), FRIEND.email);

    // Wait for a matching row to appear. We don't know the friend's ID in advance,
    // so query by testID prefix via the rendered tree.
    const friendRow = await waitFor(
      () => {
        const nodes = screen.getAllByTestId(/^add-contact-row-\d+$/);
        if (nodes.length === 0) throw new Error('no contact rows yet');
        return nodes[0];
      },
      { timeout: 5000 }
    );
    fireEvent.press(friendRow);

    // ------------------------------------------------------------------
    // Step 5 — Principal logs out
    // ------------------------------------------------------------------
    await signOut();
    routerGo('/login');
    await waitFor(() => expect(screen.getByTestId('login-submit')).toBeTruthy());

    // ------------------------------------------------------------------
    // Step 6 — Friend logs in, opens contact requests, accepts
    // ------------------------------------------------------------------
    fireEvent.changeText(screen.getByTestId('login-email'), FRIEND.email);
    fireEvent.changeText(screen.getByTestId('login-password'), FRIEND.pw);
    fireEvent.press(screen.getByTestId('login-submit'));
    await waitFor(
      () => expect(screen.getByTestId('contacts-add-friend')).toBeTruthy(),
      { timeout: 5000 }
    );

    // Open contact requests from the contacts tab.
    fireEvent.press(screen.getByTestId('contacts-open-requests'));
    routerGo('/contactRequests');

    // Find the pending request row and accept it.
    const acceptBtn = await waitFor(
      () => {
        const nodes = screen.getAllByTestId(/^accept-request-\d+$/);
        if (nodes.length === 0) throw new Error('no pending requests yet');
        return nodes[0];
      },
      { timeout: 5000 }
    );
    fireEvent.press(acceptBtn);

    // ------------------------------------------------------------------
    // Step 7 — Friend logs out
    // ------------------------------------------------------------------
    await signOut();
    routerGo('/login');
    await waitFor(() => expect(screen.getByTestId('login-submit')).toBeTruthy());

    // ------------------------------------------------------------------
    // Step 8 — Principal logs back in and sees friend in contacts
    // ------------------------------------------------------------------
    fireEvent.changeText(screen.getByTestId('login-email'), ME.email);
    fireEvent.changeText(screen.getByTestId('login-password'), ME.pw);
    fireEvent.press(screen.getByTestId('login-submit'));

    await waitFor(
      () => expect(screen.getByTestId('contacts-add-friend')).toBeTruthy(),
      { timeout: 5000 }
    );

    // Final assertion: the friend's name is visible in the contact list.
    // Use getAllByText because the first name may appear in multiple nodes
    // (e.g. avatar initials + card label). We only care that it shows up
    // somewhere.
    await waitFor(
      () => expect(screen.getAllByText(new RegExp(FRIEND.first, 'i')).length).toBeGreaterThan(0),
      { timeout: 5000 }
    );

    // ------------------------------------------------------------------
    // Step 9 — Principal opens the Balances tab
    // ------------------------------------------------------------------
    step('9 open balances tab');
    routerGo('/balancesIndex');
    await waitFor(
      () => expect(screen.getByTestId('balances-fab-new')).toBeTruthy(),
      { timeout: 5000 }
    );

    // ------------------------------------------------------------------
    // Step 10 — Start a new balance
    // ------------------------------------------------------------------
    step('10 start new balance');
    fireEvent.press(screen.getByTestId('balances-fab-new'));
    await waitFor(
      () => expect(screen.getByTestId('balance-name-input')).toBeTruthy(),
      { timeout: 5000 }
    );

    // ------------------------------------------------------------------
    // Step 11 — Add Friend as a member and create the balance
    // ------------------------------------------------------------------
    step('11 add friend to balance');
    fireEvent.changeText(screen.getByTestId('balance-name-input'), 'QA Balance');
    // findFriends('') returns the contact list; tap the first member row.
    const memberRow = await waitFor(
      () => {
        const rows = screen.getAllByTestId(/^balance-member-\d+$/);
        if (rows.length === 0) throw new Error('no member rows yet');
        return rows[0];
      },
      { timeout: 5000 }
    );
    fireEvent.press(memberRow);
    fireEvent.press(screen.getByTestId('balance-create-submit'));

    // createGroup → router.replace('/balanceShow', { id }) → capture id for step 17.
    let balanceId: any;
    await waitFor(
      () => {
        balanceId = (global as any).__router.state.params?.id;
        expect(balanceId).toBeTruthy();
      },
      { timeout: 5000 }
    );
    // FAB (add payment) requires balance.status === 'active'. If the backend
    // returns a different status this waitFor will fail and surface a real gap.
    await waitFor(
      () => expect(screen.getByTestId('balance-fab-add-payment')).toBeTruthy(),
      { timeout: 5000 }
    );

    // ------------------------------------------------------------------
    // Step 12 — Add three payments
    // ------------------------------------------------------------------
    step('12 add three payments');
    const addBalancePayment = async (paymentTitle: string, amount: string) => {
      fireEvent.press(screen.getByTestId('balance-fab-add-payment'));
      await waitFor(
        () => expect(screen.getByTestId('payment-title-input')).toBeTruthy(),
        { timeout: 5000 }
      );
      fireEvent.changeText(screen.getByTestId('payment-title-input'), paymentTitle);
      fireEvent.changeText(screen.getByTestId('payment-total-input'), amount);
      fireEvent.press(screen.getByTestId('payment-category-food'));
      fireEvent.press(screen.getByTestId('payment-submit'));

      // handleSubmit is async; give the POST a tick to flush, then return to
      // balanceShow ourselves (SuccessPaymentModal normally calls router.back()
      // on the user's tap — we skip the modal and navigate manually).
      await act(async () => {
        await new Promise((r) => setTimeout(r, 0));
        (global as any).__router.router.back();
      });
      await waitFor(
        () => expect(screen.getByTestId('balance-fab-add-payment')).toBeTruthy(),
        { timeout: 5000 }
      );
    };

    await addBalancePayment('notification test', '30');
    await addBalancePayment('balance test', '40');
    await addBalancePayment('dashboard test', '50');

    // ------------------------------------------------------------------
    // Step 13 — Create a promise with Friend
    // ------------------------------------------------------------------
    step('13 create promise');
    routerGo('/promisesIndex');
    await waitFor(
      () => expect(screen.getByTestId('promises-fab-new')).toBeTruthy(),
      { timeout: 5000 }
    );
    fireEvent.press(screen.getByTestId('promises-fab-new'));
    await waitFor(
      () => expect(screen.getByTestId('promise-title-input')).toBeTruthy(),
      { timeout: 5000 }
    );

    // Pick first contact (Friend) in the ContactSelector.
    const contactRow = await waitFor(
      () => {
        const rows = screen.getAllByTestId(/^contact-selector-row-\d+$/);
        if (rows.length === 0) throw new Error('no contact rows yet');
        return rows[0];
      },
      { timeout: 5000 }
    );
    fireEvent.press(contactRow);

    fireEvent.changeText(screen.getByTestId('promise-title-input'), 'QA Promise');
    fireEvent.changeText(screen.getByTestId('promise-total-input'), '100');
    fireEvent.changeText(screen.getByTestId('promise-payment-amount-input'), '25');
    fireEvent.press(screen.getByTestId('promise-create-submit'));

    // createPromise → router.replace('/promiseShow', { id }) — capture for later.
    let promiseId: any;
    await waitFor(
      () => {
        expect((global as any).__router.state.current).toBe('/promiseShow');
        promiseId = (global as any).__router.state.params?.id;
        expect(promiseId).toBeTruthy();
      },
      { timeout: 5000 }
    );

    // ------------------------------------------------------------------
    // Step 14 — Principal logs out
    // ------------------------------------------------------------------
    step('14 logout principal');
    await signOut();
    routerGo('/login');
    await waitFor(() => expect(screen.getByTestId('login-submit')).toBeTruthy());

    // ------------------------------------------------------------------
    // Step 15 — Friend logs in, accepts "dashboard test" from Home
    // ------------------------------------------------------------------
    step('15 friend login + accept dashboard test');
    fireEvent.changeText(screen.getByTestId('login-email'), FRIEND.email);
    fireEvent.changeText(screen.getByTestId('login-password'), FRIEND.pw);
    fireEvent.press(screen.getByTestId('login-submit'));
    await waitFor(
      () => expect(screen.getByTestId('contacts-add-friend')).toBeTruthy(),
      { timeout: 5000 }
    );

    routerGo('/home');
    // Home's SegmentedControl offers Promises/Balances. Because Friend has at
    // least one active promise (from step 13), Home auto-selects the Promises
    // tab; we need to flip to Balances to see payment-accept-dashboard-test.
    await waitFor(
      () => expect(screen.getAllByText('Balances').length).toBeGreaterThan(0),
      { timeout: 5000 }
    );
    fireEvent.press(screen.getAllByText('Balances')[0]);

    await waitFor(
      () => expect(screen.getByTestId('payment-accept-dashboard-test')).toBeTruthy(),
      { timeout: 5000 }
    );
    fireEvent.press(screen.getByTestId('payment-accept-dashboard-test'));

    // ------------------------------------------------------------------
    // Step 16 — Accept the first pending notification (e.g. "notification test")
    // ------------------------------------------------------------------
    step('16 accept notification test');
    // Note: NotificationCard doesn't surface the payment title, so we accept
    // whichever pending notification is listed first under the Payments tab.
    // Ordering comes from the backend fixture; this may need disambiguation
    // once notification payloads include the payment title.
    routerGo('/notifications');
    const notifToggle = await waitFor(
      () => {
        const toggles = screen.getAllByTestId(/^notification-toggle-\d+$/);
        if (toggles.length === 0) throw new Error('no pending notifications');
        return toggles[0];
      },
      { timeout: 5000 }
    );
    fireEvent.press(notifToggle);
    const notifAccept = await waitFor(
      () => {
        const accepts = screen.getAllByTestId(/^notification-accept-\d+$/);
        if (accepts.length === 0) throw new Error('notification accept not visible');
        return accepts[0];
      },
      { timeout: 5000 }
    );
    fireEvent.press(notifAccept);

    // ------------------------------------------------------------------
    // Step 17 — Friend opens the balance and accepts "balance test"
    // ------------------------------------------------------------------
    step('17 accept balance test');
    act(() => {
      (global as any).__router.router.push({
        pathname: '/balanceShow',
        params: { id: balanceId },
      });
    });
    await waitFor(
      () => expect(screen.getByTestId('payment-accept-balance-test')).toBeTruthy(),
      { timeout: 5000 }
    );
    fireEvent.press(screen.getByTestId('payment-accept-balance-test'));

    // ------------------------------------------------------------------
    // Step 18 — Friend accepts Principal's promise from the promise detail
    // ------------------------------------------------------------------
    step('18 accept promise');
    act(() => {
      (global as any).__router.router.push({
        pathname: '/promiseShow',
        params: { id: promiseId },
      });
    });
    await waitFor(
      () => expect(screen.getByTestId('promise-accept')).toBeTruthy(),
      { timeout: 5000 }
    );
    fireEvent.press(screen.getByTestId('promise-accept'));

    // ------------------------------------------------------------------
    // Step 19 — Friend creates a reverse promise back to Principal
    // ------------------------------------------------------------------
    step('19 create reverse promise');
    routerGo('/promisesIndex');
    await waitFor(
      () => expect(screen.getByTestId('promises-fab-new')).toBeTruthy(),
      { timeout: 5000 }
    );
    fireEvent.press(screen.getByTestId('promises-fab-new'));
    await waitFor(
      () => expect(screen.getByTestId('promise-title-input')).toBeTruthy(),
      { timeout: 5000 }
    );
    const reverseContactRow = await waitFor(
      () => {
        const rows = screen.getAllByTestId(/^contact-selector-row-\d+$/);
        if (rows.length === 0) throw new Error('no contact rows yet');
        return rows[0];
      },
      { timeout: 5000 }
    );
    fireEvent.press(reverseContactRow);
    fireEvent.changeText(screen.getByTestId('promise-title-input'), 'QA Reverse Promise');
    fireEvent.changeText(screen.getByTestId('promise-total-input'), '60');
    fireEvent.changeText(screen.getByTestId('promise-payment-amount-input'), '20');
    fireEvent.press(screen.getByTestId('promise-create-submit'));
    await waitFor(
      () => expect((global as any).__router.state.current).toBe('/promiseShow'),
      { timeout: 5000 }
    );
  }, 120000);
});
