import formatDate from '@/services/formatDate';

// formatDate is relative to "now", so freeze the clock.
const NOW = new Date('2026-03-15T12:00:00Z');

const minutesAgo = (n: number) => new Date(NOW.getTime() - n * 60 * 1000).toISOString();
const hoursAgo = (n: number) => new Date(NOW.getTime() - n * 60 * 60 * 1000).toISOString();
const daysAgo = (n: number) => new Date(NOW.getTime() - n * 24 * 60 * 60 * 1000).toISOString();

describe('formatDate', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(NOW);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('renders minutes, singular and plural', () => {
    expect(formatDate(minutesAgo(0))).toBe('0 minutes ago');
    expect(formatDate(minutesAgo(1))).toBe('1 minute ago');
    expect(formatDate(minutesAgo(59))).toBe('59 minutes ago');
  });

  it('switches to hours at 60 minutes', () => {
    expect(formatDate(hoursAgo(1))).toBe('1 hour ago');
    expect(formatDate(hoursAgo(23))).toBe('23 hours ago');
  });

  it('switches to days at 24 hours', () => {
    expect(formatDate(daysAgo(1))).toBe('1 day ago');
    expect(formatDate(daysAgo(6))).toBe('6 days ago');
  });

  it('falls back to an absolute date after a week', () => {
    expect(formatDate(daysAgo(7))).toBe('Mar 08, 2026');
    expect(formatDate('2025-12-25T12:00:00Z')).toBe('Dec 25, 2025');
  });

  it('accepts a Date instance as well as an ISO string', () => {
    expect(formatDate(new Date(NOW.getTime() - 2 * 60 * 60 * 1000))).toBe('2 hours ago');
  });
});
