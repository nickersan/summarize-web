export const secondsToMillis = (seconds: number): number =>
{
  return seconds * 1000;
}

export const utc = (date: Date = new Date()): number =>
{
  return Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
    date.getUTCMilliseconds()
  );
}