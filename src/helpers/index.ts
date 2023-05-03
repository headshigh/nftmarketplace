export const minifyAddress = (address: string) => {
  const start = address.substring(0, 5);
  const end = address.substring(address.length - 4);
  return `${start}...${end}`;
};
