import React from 'react';
import { act, render, RenderOptions } from '@testing-library/react-native';
import { I18nextProvider } from 'react-i18next';

import i18n from '@/app/i18n';

/**
 * Renders a component inside the app-wide providers it can reasonably expect.
 *
 * Only i18n is wired here: `SessionProvider` and `ServerProvider` hit the
 * network, so screens that need them belong in the Polly-backed integration
 * test instead of the component suite.
 */
const Providers = ({ children }: { children: React.ReactNode }) => (
  <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
);

export const renderWithProviders = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: Providers, ...options });

/**
 * Switches the UI language. Wrapped in `act` because i18next re-renders every
 * mounted `useTranslation` consumer. Restore 'en' in an afterEach.
 */
export const setLanguage = async (language: 'en' | 'es') => {
  await act(async () => {
    await i18n.changeLanguage(language);
  });
};

export { i18n };
export * from '@testing-library/react-native';
