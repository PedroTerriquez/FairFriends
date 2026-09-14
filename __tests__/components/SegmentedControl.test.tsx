import React from 'react';

import SegmentedControl from '@/presentational/SegmentedControl';
import { renderWithProviders, screen, fireEvent } from '../helpers/renderWithProviders';

const segments = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending', count: 3 },
  { key: 'closed', label: 'Closed', count: 0 },
];

describe('SegmentedControl', () => {
  it('renders every segment label', () => {
    renderWithProviders(
      <SegmentedControl segments={segments} selectedKey="all" onSelect={jest.fn()} />
    );

    segments.forEach(({ label }) => expect(screen.getByText(label)).toBeTruthy());
  });

  it('reports the tapped segment key', () => {
    const onSelect = jest.fn();
    renderWithProviders(
      <SegmentedControl segments={segments} selectedKey="all" onSelect={onSelect} />
    );

    fireEvent.press(screen.getByText('Pending'));

    expect(onSelect).toHaveBeenCalledWith('pending');
  });

  it('badges a positive count and hides a zero count', () => {
    renderWithProviders(
      <SegmentedControl segments={segments} selectedKey="all" onSelect={jest.fn()} />
    );

    expect(screen.getByText('3')).toBeTruthy();
    expect(screen.queryByText('0')).toBeNull();
  });

  it('caps large counts at 99+', () => {
    renderWithProviders(
      <SegmentedControl
        segments={[{ key: 'all', label: 'All', count: 150 }]}
        selectedKey="all"
        onSelect={jest.fn()}
      />
    );

    expect(screen.getByText('99+')).toBeTruthy();
  });

  it('survives a selectedKey that matches no segment', () => {
    expect(() =>
      renderWithProviders(
        <SegmentedControl segments={segments} selectedKey="ghost" onSelect={jest.fn()} />
      )
    ).not.toThrow();
  });
});
