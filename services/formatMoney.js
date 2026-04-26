const formatMoneyShort = (value) => {
  const number = Number(value);
  if (isNaN(number)) return '';
  return '$' + number.toFixed(1);
};