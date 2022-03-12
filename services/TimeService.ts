export function formatDuration(startDate: string, endDate: string): string {
  const timeDiff = Math.abs(new Date(endDate) - new Date(startDate));

  return new Date(timeDiff).toISOString().slice(11, 19);
}
