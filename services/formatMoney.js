const formatMoney = (value) => {
  const number = Number(value);
  if (isNaN(number)) return '$0.0';
  return '$' + number.toFixed(1);
};

export default formatMoney;