import {
  calculateFairnessInsight,
  isBalanceFair,
  calculatePaceInsight,
  calculateSettlements,
} from '@/services/balanceIntelligence';

const member = (name, money) => ({ user_id: name.toLowerCase(), name, money });

describe('calculateFairnessInsight', () => {
  it('points at the member who has paid the least', () => {
    const balance = {
      id: '1',
      total: 300,
      balance_members: [member('Ana', 200), member('Beto', 100), member('Caro', 0)],
    };

    const insight = calculateFairnessInsight(balance);

    expect(insight.name).toBe('Caro');
    expect(insight.amount).toBe(100); // average is 100, Caro paid 0
    expect(insight.percentage).toBe('100');
    expect(insight.title).toBe('Caro should pay next');
    expect(insight.subtitle).toBe('100% below average ($100 less)');
  });

  it('treats a missing money field as zero', () => {
    const balance = {
      id: '1',
      total: 100,
      balance_members: [member('Ana', 100), { user_id: 'b', name: 'Beto' }],
    };

    expect(calculateFairnessInsight(balance).name).toBe('Beto');
  });

  it('keeps the first member on ties', () => {
    const balance = {
      id: '1',
      total: 100,
      balance_members: [member('Ana', 50), member('Beto', 50)],
    };

    expect(calculateFairnessInsight(balance).name).toBe('Ana');
  });
});

describe('isBalanceFair', () => {
  it('is fair when everyone is within 10% of the average', () => {
    const balance = {
      id: '1',
      total: 300,
      balance_members: [member('Ana', 105), member('Beto', 100), member('Caro', 95)],
    };

    expect(isBalanceFair(balance)).toBe(true);
  });

  it('is unfair when someone drifts past the 10% tolerance', () => {
    const balance = {
      id: '1',
      total: 300,
      balance_members: [member('Ana', 200), member('Beto', 100), member('Caro', 0)],
    };

    expect(isBalanceFair(balance)).toBe(false);
  });
});

describe('calculatePaceInsight', () => {
  const NOW = new Date('2026-03-11T00:00:00Z'); // day 10 of a 20-day window

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(NOW);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  const withDates = (total, budget) => ({
    id: '1',
    total,
    budget,
    start_date: '2026-03-01T00:00:00Z',
    end_date: '2026-03-21T00:00:00Z',
    balance_members: [member('Ana', total)],
  });

  it('returns null when budget or dates are missing', () => {
    const base = { id: '1', total: 100, balance_members: [member('Ana', 100)] };

    expect(calculatePaceInsight(base)).toBeNull();
    expect(calculatePaceInsight({ ...base, budget: 500 })).toBeNull();
    expect(calculatePaceInsight({ ...base, budget: 500, start_date: '2026-03-01' })).toBeNull();
  });

  it('reports on-track when spending matches elapsed time', () => {
    const insight = calculatePaceInsight(withDates(500, 1000)); // 50% spent, 50% elapsed

    expect(insight.daysElapsed).toBe(10);
    expect(insight.totalDays).toBe(20);
    expect(insight.timeProgress).toBe(50);
    expect(insight.spendingProgress).toBe(50);
    expect(insight.status).toBe('on-track');
    expect(insight.message).toBe('On track with budget');
    expect(insight.projectedTotal).toBe('1000');
  });

  it('reports ahead of pace when spending outruns time by more than 15 points', () => {
    const insight = calculatePaceInsight(withDates(800, 1000)); // 80% spent, 50% elapsed

    expect(insight.status).toBe('ahead');
    expect(insight.message).toBe('30% ahead of pace - spending too fast');
  });

  it('reports behind pace when spending lags time by more than 15 points', () => {
    const insight = calculatePaceInsight(withDates(200, 1000)); // 20% spent, 50% elapsed

    expect(insight.status).toBe('behind');
    expect(insight.message).toBe('30% behind pace - under budget');
  });

  it('stays on-track inside the +/-15 point tolerance', () => {
    expect(calculatePaceInsight(withDates(640, 1000)).status).toBe('on-track'); // +14
    expect(calculatePaceInsight(withDates(360, 1000)).status).toBe('on-track'); // -14
  });
});

describe('calculateSettlements', () => {
  it('moves money from under-payers to over-payers', () => {
    const balance = {
      id: '1',
      total: 300,
      balance_members: [member('Ana', 300), member('Beto', 0), member('Caro', 0)],
    };

    // average 100: Ana is owed 200, Beto and Caro owe 100 each.
    expect(calculateSettlements(balance)).toEqual([
      { from: 'Beto', to: 'Ana', amount: 100 },
      { from: 'Caro', to: 'Ana', amount: 100 },
    ]);
  });

  it('splits a debt across several creditors', () => {
    const balance = {
      id: '1',
      total: 300,
      balance_members: [member('Ana', 150), member('Beto', 150), member('Caro', 0)],
    };

    // average 100: Caro owes 100, Ana and Beto are owed 50 each.
    expect(calculateSettlements(balance)).toEqual([
      { from: 'Caro', to: 'Ana', amount: 50 },
      { from: 'Caro', to: 'Beto', amount: 50 },
    ]);
  });

  it('returns no settlements when everyone paid the average', () => {
    const balance = {
      id: '1',
      total: 200,
      balance_members: [member('Ana', 100), member('Beto', 100)],
    };

    expect(calculateSettlements(balance)).toEqual([]);
  });
});
