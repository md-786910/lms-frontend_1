export const getCategoryIdFromType = (type) => {
  const map = {
    aadhaar: 1,
    pan: 2,
    matric: 3,
    license: 4,
  };
  return map[type];
};