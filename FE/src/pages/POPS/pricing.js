export const discountRateForArea = (area) => {
  const value = Number(area);
  if (value >= 1500) return 0.2;
  if (value >= 1000) return 0.15;
  if (value >= 500) return 0.1;
  return 0;
};

export const discountLabelForArea = (area) =>
  discountRateForArea(area) > 0
    ? `Giảm ${discountRateForArea(area) * 100}%`
    : "Giá gốc";
