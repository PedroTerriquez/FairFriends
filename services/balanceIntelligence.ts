/**
 * Balance Intelligence Calculations
 *
 * Provides insights for individual balances:
 * - Fairness analysis (who should pay next)
 * - Settlement optimization (minimal transactions)
 * - Pace tracking (budget vs spending velocity)
 */

interface BalanceMember {
  user_id: string;
  name: string;
  money: number;
}

interface BalanceData {
  id: string;
  total: number;
  balance_members: BalanceMember[];
  budget?: number;
  start_date?: string;
  end_date?: string;
}

/**
 * Calculate fairness insight: who should pay next
 */
export const calculateFairnessInsight = (balance: BalanceData) => {
  const { total, balance_members } = balance;
  const average = total / balance_members.length;

  // Find member who paid least
  const membersWithMoney = balance_members.map(member => ({
    name: member.name,
    money: member.money || 0,
    difference: (member.money || 0) - average,
  }));

  const minPaidMember = membersWithMoney.reduce((min, current) =>
    current.money < min.money ? current : min
  );

  const differenceAmount = Math.abs(minPaidMember.difference);
  const differencePercent = ((differenceAmount / average) * 100).toFixed(0);

  return {
    name: minPaidMember.name,
    amount: differenceAmount,
    percentage: differencePercent,
    title: `${minPaidMember.name} should pay next`,
    subtitle: `${differencePercent}% below average ($${differenceAmount.toFixed(0)} less)`,
  };
};

/**
 * Calculate if balance is fair (all within 10% of average)
 */
export const isBalanceFair = (balance: BalanceData): boolean => {
  const { total, balance_members } = balance;
  const average = total / balance_members.length;
  const threshold = average * 0.1; // 10% tolerance

  return balance_members.every(member => {
    const difference = Math.abs((member.money || 0) - average);
    return difference <= threshold;
  });
};

/**
 * Calculate pace insight (spending velocity vs time)
 * Only applicable if balance has budget and dates
 */
export const calculatePaceInsight = (balance: BalanceData) => {
  if (!balance.budget || !balance.end_date || !balance.start_date) {
    return null; // Pace tracking not available
  }

  const { total, budget, start_date, end_date } = balance;

  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  const startMs = new Date(start_date).getTime();
  const endMs = new Date(end_date).getTime();
  const nowMs = Date.now();

  const totalDays = Math.max((endMs - startMs) / MS_PER_DAY, 1);
  const daysElapsed = Math.max(Math.floor((nowMs - startMs) / MS_PER_DAY), 0);

  const timeProgress = (daysElapsed / totalDays) * 100;
  const spendingProgress = (total / budget) * 100;
  const pace = spendingProgress - timeProgress;

  // Determine status
  let status: 'on-track' | 'ahead' | 'behind';
  let message: string;

  if (pace > 15) {
    status = 'ahead';
    message = `${pace.toFixed(0)}% ahead of pace - spending too fast`;
  } else if (pace < -15) {
    status = 'behind';
    message = `${Math.abs(pace).toFixed(0)}% behind pace - under budget`;
  } else {
    status = 'on-track';
    message = 'On track with budget';
  }

  // Calculate projection
  const dailyRate = total / (daysElapsed || 1);
  const projectedTotal = dailyRate * totalDays;

  return {
    daysElapsed,
    totalDays,
    timeProgress,
    spendingProgress,
    pace,
    status,
    message,
    projectedTotal: projectedTotal.toFixed(0),
  };
};

/**
 * Generate settlement suggestions (simplified)
 * In a real app, this would use a graph algorithm for minimal transactions
 */
export const calculateSettlements = (balance: BalanceData) => {
  const { total, balance_members } = balance;
  const average = total / balance_members.length;

  // Calculate who owes and who should receive
  const debtors = balance_members
    .filter(member => (member.money || 0) < average)
    .map(member => ({
      name: member.name,
      amount: average - (member.money || 0),
    }));

  const creditors = balance_members
    .filter(member => (member.money || 0) > average)
    .map(member => ({
      name: member.name,
      amount: (member.money || 0) - average,
    }));

  // Simple settlement: match debtors with creditors
  const settlements: Array<{ from: string; to: string; amount: number }> = [];

  let debtorIndex = 0;
  let creditorIndex = 0;

  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const debtor = debtors[debtorIndex];
    const creditor = creditors[creditorIndex];

    const amount = Math.min(debtor.amount, creditor.amount);

    settlements.push({
      from: debtor.name,
      to: creditor.name,
      amount,
    });

    debtor.amount -= amount;
    creditor.amount -= amount;

    if (debtor.amount === 0) debtorIndex++;
    if (creditor.amount === 0) creditorIndex++;
  }

  return settlements;
};
