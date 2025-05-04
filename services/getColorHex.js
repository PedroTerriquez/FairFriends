export const getColorHex = (value) => {
  let color;

  switch (true) {
    case (value <= 20):
      color = '#FF6F61';
      break;
    case (value <= 40):
      color = '#FFB84D';
      break;
    case (value <= 60):
      color = '#F2E205';
      break;
    case (value <= 80):
      color = '#A8D08D';
      break;
    case (value >= 81):
      color = '#4caf50';
      break;
    default:
      color = '#FF6F61';
  }

  return color;
};