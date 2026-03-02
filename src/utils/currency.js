export const formatPhp = (amount) =>
  `Php ${new Intl.NumberFormat('en-PH', {
    maximumFractionDigits: 0,
  }).format(amount)}`;
