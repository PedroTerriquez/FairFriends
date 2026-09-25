import formatMoney from '@/services/formatMoney';

describe('formatMoney', () => {
  it('prefixes with $ and always shows one decimal', () => {
    expect(formatMoney(1000)).toBe('$1000.0');
    expect(formatMoney(1234567)).toBe('$1234567.0');
  });

  it('formats zero', () => {
    expect(formatMoney(0)).toBe('$0.0');
  });

  it('accepts numeric strings', () => {
    expect(formatMoney('2500')).toBe('$2500.0');
  });

  it('rounds to a single decimal place', () => {
    expect(formatMoney(12.5)).toBe('$12.5');
    expect(formatMoney(12.46)).toBe('$12.5');
  });

  it('formats negative amounts', () => {
    expect(formatMoney(-450)).toBe('$-450.0');
  });

  it('falls back to $0.0 for values that are not numbers', () => {
    expect(formatMoney('abc')).toBe('$0.0');
    expect(formatMoney(undefined)).toBe('$0.0');
    expect(formatMoney(NaN)).toBe('$0.0');
  });

  // Documents a real edge case: null coerces to 0, so an absent amount renders "$0.0".
  it('treats null as zero', () => {
    expect(formatMoney(null)).toBe('$0.0');
  });
});
