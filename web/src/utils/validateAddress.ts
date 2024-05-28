export const ethAddressPattern = /^0x[a-fA-F0-9]{40}$/;
export const ensDomainPattern = /^[a-zA-Z0-9-]{1,}\.eth$/;

export const validateAddress = (input: string) => {
  return ethAddressPattern.test(input) || ensDomainPattern.test(input);
};
