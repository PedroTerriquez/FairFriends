import React from 'react';

import Avatar from '@/presentational/Avatar';
import { renderWithProviders, screen } from '../helpers/renderWithProviders';

const backgroundOf = (testInstance) =>
  // RN flattens the style array; the background color is the last one applied.
  [].concat(testInstance.props.style).filter(Boolean).reduce(
    (acc, style) => ({ ...acc, ...style }),
    {}
  ).backgroundColor;

describe('Avatar', () => {
  it('doubles the uppercased first letter of the name', () => {
    renderWithProviders(<Avatar name="ana" />);

    expect(screen.getByText('AA')).toBeTruthy();
  });

  it('falls back to "??" when there is no name', () => {
    renderWithProviders(<Avatar name={undefined} />);

    expect(screen.getByText('??')).toBeTruthy();
  });

  it('gives the same name the same color every time', () => {
    const first = renderWithProviders(<Avatar name="Beto" />);
    const firstColor = backgroundOf(first.toJSON());
    first.unmount();

    const second = renderWithProviders(<Avatar name="Beto" />);

    expect(backgroundOf(second.toJSON())).toBe(firstColor);
  });

  it('sizes the circle and keeps it round', () => {
    const { toJSON } = renderWithProviders(<Avatar name="Ana" size={64} />);
    const style = [].concat(toJSON().props.style).filter(Boolean).reduce(
      (acc, s) => ({ ...acc, ...s }),
      {}
    );

    expect(style.width).toBe(64);
    expect(style.height).toBe(64);
    expect(style.borderRadius).toBe(32);
  });
});
