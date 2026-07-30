export const formatPhone = (phone?: string | null): string => {
  if (!phone) return '-';

  const digits = phone.replace(/\D/g, '');

  if (digits.length !== 11) return phone;

  const normalized = digits.startsWith('8')
    ? '7' + digits.slice(1)
    : digits;

  const country = normalized[0];
  const code = normalized.slice(1, 4);
  const part1 = normalized.slice(4, 7);
  const part2 = normalized.slice(7, 9);
  const part3 = normalized.slice(9, 11);

  return `+${country} (${code}) ${part1}-${part2}-${part3}`;
};