import { parseISO } from 'date-fns';

export function formatDuration(startDate: string, endDate: string): string {
  const timeDiff = Math.abs(parseISO(endDate) - parseISO(startDate));

  return new Date(timeDiff).toISOString().slice(11, 19);
}
