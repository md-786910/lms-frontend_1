const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const formatLeaveDays = (value) => {
  const numericValue = Number(value);
  const normalized = Number.isFinite(numericValue) ? numericValue : 0;
  const rounded = Math.round(normalized * 100) / 100;
  const absolute = Math.abs(rounded);
  const formattedNumber =
    Number.isInteger(absolute) || Number.isNaN(absolute)
      ? absolute.toString()
      : absolute.toFixed(2).replace(/\.?0+$/, "");
  const sign = rounded < 0 ? "-" : "";
  return `${sign}${formattedNumber} days`;
};

export { capitalizeFirstLetter, formatLeaveDays };
