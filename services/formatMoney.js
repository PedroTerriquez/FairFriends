const formatMoney = (value) => {
    const number = Number(value);
    if (isNaN(number)) return '';
    return '$' + number.toLocaleString('en-US');
};

export default formatMoney;