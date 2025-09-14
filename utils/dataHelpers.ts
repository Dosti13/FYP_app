// utils/dateHelpers.ts
export function getCurrentDateTime(): string {
  return new Date().toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM format
}

export function formatDateForInput(date: Date): string {
  return date.toISOString().slice(0, 16);
}

export function isValidDateTime(dateTime: string): boolean {
  const date = new Date(dateTime);
  return date instanceof Date && !isNaN(date.getTime());
}