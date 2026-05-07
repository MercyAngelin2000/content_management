export function getScheduleState(startTime, endTime) {
  const now = Date.now();
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  if (Number.isNaN(start) || Number.isNaN(end)) return 'unknown';
  if (now < start) return 'scheduled';
  if (now > end) return 'expired';
  return 'active';
}

export function toFilePreview(fileOrUrl) {
  if (!fileOrUrl) return '';
  if (typeof fileOrUrl === 'string') return fileOrUrl;
  return URL.createObjectURL(fileOrUrl);
}
