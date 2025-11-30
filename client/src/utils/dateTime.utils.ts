export const formatMinuteSec = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;

  const mm = m.toString().padStart(2, '0');
  const ss = s.toString().padStart(2, '0');

  return `${mm}:${ss}`;
};
