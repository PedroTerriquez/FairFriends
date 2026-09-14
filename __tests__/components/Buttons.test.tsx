import React from 'react';

import AcceptButton, {
  RejectButton,
  AddContactButton,
  CancelRequestButton,
} from '@/presentational/Buttons';
import { renderWithProviders, screen, fireEvent, setLanguage } from '../helpers/renderWithProviders';

describe('action buttons', () => {
  afterEach(async () => {
    await setLanguage('en');
  });

  it('AcceptButton renders its translated label and fires onPressAction', () => {
    const onPressAction = jest.fn();
    renderWithProviders(<AcceptButton onPressAction={onPressAction} testID="accept" />);

    expect(screen.getByText('Accept')).toBeTruthy();

    fireEvent.press(screen.getByTestId('accept'));
    expect(onPressAction).toHaveBeenCalledTimes(1);
  });

  it('RejectButton renders its translated label and fires onPressAction', () => {
    const onPressAction = jest.fn();
    renderWithProviders(<RejectButton onPressAction={onPressAction} testID="reject" />);

    expect(screen.getByText('Reject')).toBeTruthy();

    fireEvent.press(screen.getByTestId('reject'));
    expect(onPressAction).toHaveBeenCalledTimes(1);
  });

  it('AddContactButton renders its translated label and fires onPressAction', () => {
    const onPressAction = jest.fn();
    renderWithProviders(<AddContactButton onPressAction={onPressAction} testID="add-contact" />);

    expect(screen.getByText('Add')).toBeTruthy();

    fireEvent.press(screen.getByTestId('add-contact'));
    expect(onPressAction).toHaveBeenCalledTimes(1);
  });

  it('follows the active language', async () => {
    await setLanguage('es');
    renderWithProviders(<AcceptButton onPressAction={jest.fn()} testID="accept" />);

    expect(screen.getByText('Aceptar')).toBeTruthy();
  });

  it('CancelRequestButton fires onPressAction', () => {
    const onPressAction = jest.fn();
    renderWithProviders(<CancelRequestButton onPressAction={onPressAction} />);

    // NOTE: this label is hardcoded in English, unlike its siblings.
    fireEvent.press(screen.getByText('Cancel Request'));
    expect(onPressAction).toHaveBeenCalledTimes(1);
  });
});
