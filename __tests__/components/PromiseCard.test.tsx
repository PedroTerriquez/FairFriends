import React from 'react';

import PromiseCard from '@/presentational/PromiseCard';
import { renderWithProviders, screen, fireEvent } from '../helpers/renderWithProviders';

const basePromise = {
  id: 12,
  title: 'Concert tickets',
  user: 'Beto',
  status: 'accepted',
  total: 1200,
  paid_amount: 300,
  percentage: 25,
};

const renderCard = (overrides = {}) =>
  renderWithProviders(<PromiseCard {...basePromise} {...overrides} />);

describe('PromiseCard', () => {
  beforeEach(() => global.__router.reset());

  it('shows the counterpart, the title and the money split', () => {
    renderCard();

    expect(screen.getByText('Beto')).toBeTruthy();
    expect(screen.getByText('Concert tickets')).toBeTruthy();
    expect(screen.getByText('$300')).toBeTruthy(); // paid
    expect(screen.getByText('$1,200')).toBeTruthy(); // total
    expect(screen.getByText('$900')).toBeTruthy(); // remaining
  });

  it('rounds the progress label', () => {
    renderCard({ percentage: 24.6 });

    expect(screen.getByText('25% paid')).toBeTruthy();
  });

  it.each([
    ['pending', 'Editable'],
    ['accepted', 'Open'],
    ['close', 'Finished'],
    ['rejected', 'Rejected'],
  ])('maps the "%s" status to the "%s" badge', (status, label) => {
    renderCard({ status });

    expect(screen.getByText(label)).toBeTruthy();
  });

  it('falls back to the raw status when it is unknown', () => {
    renderCard({ status: 'archived' });

    expect(screen.getByText('archived')).toBeTruthy();
  });

  it('hides the interest line when there is no interest', () => {
    renderCard({ interest: 0 });

    expect(screen.queryByText(/interest/)).toBeNull();
  });

  it('shows the interest line when the promise carries interest', () => {
    renderCard({ interest: 5 });

    expect(screen.getByText('+5% interest')).toBeTruthy();
  });

  it('opens the promise detail when tapped', () => {
    renderCard();

    fireEvent.press(screen.getByText('Concert tickets'));

    expect(global.__router.router.push).toHaveBeenCalledWith({
      pathname: '/promiseShow',
      params: { id: 12 },
    });
  });
});
