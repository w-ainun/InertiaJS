// utils/format-date.ts
export function formatDateForMySQL(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // bulan 0-11
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function parseMySQLDate(mysqlDate: string): Date | undefined {
  const parts = mysqlDate.split('-');
  if (parts.length !== 3) return undefined;
  const [year, month, day] = parts.map(Number);
  return new Date(year, month - 1, day); // month is 0-based
}
