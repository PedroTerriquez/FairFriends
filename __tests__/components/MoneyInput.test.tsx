import React from 'react';

import MoneyInput from '@/presentational/MoneyInput';
import { renderWithProviders, screen, fireEvent } from '../helpers/renderWithProviders';

describe('MoneyInput', () => {
  const defaults = { label: 'Amount', value: '', onChangeText: jest.fn() };

  it('renders the label and the currency symbol', () => {
    renderWithProviders(<MoneyInput {...defaults} />);

    expect(screen.getByText('Amount')).toBeTruthy();
    expect(screen.getByText('$')).toBeTruthy();
  });

  it('renders the optional subtitle only when given', () => {
    const { rerender } = renderWithProviders(<MoneyInput {...defaults} />);
    expect(screen.queryByText('Per person')).toBeNull();

    rerender(<MoneyInput {...defaults} subtitle="Per person" />);
    expect(screen.getByText('Per person')).toBeTruthy();
  });

  it('reports typing through onChangeText', () => {
    const onChangeText = jest.fn();
    renderWithProviders(<MoneyInput {...defaults} onChangeText={onChangeText} testID="amount" />);

    fireEvent.changeText(screen.getByTestId('amount'), '42.50');

    expect(onChangeText).toHaveBeenCalledWith('42.50');
  });

  it('uses a decimal keypad and the default placeholder', () => {
    renderWithProviders(<MoneyInput {...defaults} testID="amount" />);
    const input = screen.getByTestId('amount');

    expect(input.props.keyboardType).toBe('decimal-pad');
    expect(input.props.placeholder).toBe('0.00');
  });

  it('shows the error message when validation fails', () => {
    renderWithProviders(<MoneyInput {...defaults} error="Amount is required" />);

    expect(screen.getByText('Amount is required')).toBeTruthy();
  });
});
