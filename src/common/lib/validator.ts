export const isValidBase64Image = (value: string): boolean => {
  const pattern = /^data:image\/[a-z]+;base64,/i;
  return pattern.test(value);
};
