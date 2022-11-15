import { endOfDay, startOfDay } from 'date-fns';

export function atStartOfDay(date: Date): Date {
  return startOfDay(date);
}

export function atEndOfDay(date: Date): Date {
  return endOfDay(date);
}
