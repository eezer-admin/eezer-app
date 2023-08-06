import { parseISO } from 'date-fns';

export function uuid(): string {
  let d = new Date().getTime(),
    d2 = (performance && performance.now && performance.now() * 1000) || 0;
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    let r = Math.random() * 16;
    if (d > 0) {
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === 'x' ? r : (r & 0x7) | 0x8).toString(16);
  });
}

export function formatDuration(startDate: string, endDate: string): string {
  const timeDiff = Math.abs(parseISO(endDate) - parseISO(startDate));

  return new Date(timeDiff).toISOString().slice(11, 19);
}
