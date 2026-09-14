import React from 'react';
import { Text } from 'react-native';

import EmptyState from '@/presentational/EmptyState';
import { renderWithProviders, screen, fireEvent } from '../helpers/renderWithProviders';

// @expo/vector-icons is stubbed in jest.setup.js to render the icon name as
// `[name]`, which is what makes these icon assertions possible.
describe('EmptyState', () => {
  it('renders the title and optional subtitle', () => {
    renderWithProviders(<EmptyState title="No balances yet" subtitle="Start one with a friend" />);

    expect(screen.getByText('No balances yet')).toBeTruthy();
    expect(screen.getByText('Start one with a friend')).toBeTruthy();
  });

  it.each([
    ['no-data', 'document-text-outline'],
    ['no-results', 'search-outline'],
    ['error', 'alert-circle-outline'],
    ['no-internet', 'cloud-offline-outline'],
    ['no-notifications', 'notifications-off-outline'],
  ])('picks the default icon for type "%s"', (type, icon) => {
    renderWithProviders(<EmptyState type={type as any} title="Nothing here" />);

    expect(screen.getByText(`[${icon}]`)).toBeTruthy();
  });

  it('lets an explicit icon win over the type default', () => {
    renderWithProviders(<EmptyState type="error" title="Nothing here" icon="wallet-outline" />);

    expect(screen.getByText('[wallet-outline]')).toBeTruthy();
  });

  it('renders the action button and fires onAction', () => {
    const onAction = jest.fn();
    renderWithProviders(
      <EmptyState title="No contacts" actionText="Add a contact" onAction={onAction} />
    );

    fireEvent.press(screen.getByText('Add a contact'));

    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('hides the action button when there is no handler', () => {
    renderWithProviders(<EmptyState title="No contacts" actionText="Add a contact" />);

    expect(screen.queryByText('Add a contact')).toBeNull();
  });

  it('renders children', () => {
    renderWithProviders(
      <EmptyState title="No contacts">
        <Text>Custom slot</Text>
      </EmptyState>
    );

    expect(screen.getByText('Custom slot')).toBeTruthy();
  });
});
