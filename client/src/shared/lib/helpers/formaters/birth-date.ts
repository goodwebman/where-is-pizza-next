export const formatBirthDate = (date?: string | null): string => {
  if (!date) return '-';

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return '-';

  const day = String(parsed.getDate()).padStart(2, '0');
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const year = parsed.getFullYear();

  return `${day}.${month}.${year}`;
};