import formatMoney from '@/services/formatMoney';

describe('formatMoney', () => {
  it('prefixes with $ and groups thousands', () => {
    expect(formatMoney(1000)).toBe('$1,000');
    expect(formatMoney(1234567)).toBe('$1,234,567');
  });

  it('formats zero', () => {
    expect(formatMoney(0)).toBe('$0');
  });

  it('accepts numeric strings', () => {
    expect(formatMoney('2500')).toBe('$2,500');
  });

  it('keeps decimals as-is (toLocaleString rounds to 3 places)', () => {
    expect(formatMoney(12.5)).toBe('$12.5');
  });

  it('formats negative amounts', () => {
    expect(formatMoney(-450)).toBe('$-450');
  });

  it('returns an empty string for values that are not numbers', () => {
    expect(formatMoney('abc')).toBe('');
    expect(formatMoney(undefined)).toBe('');
    expect(formatMoney(NaN)).toBe('');
  });

  // Documents a real edge case: null coerces to 0, so an absent amount renders "$0".
  it('treats null as zero', () => {
    expect(formatMoney(null)).toBe('$0');
  });
});
