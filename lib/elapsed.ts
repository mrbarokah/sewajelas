// A clock measures elapsed wall time only; it does not prove that the provider is still working.
export function elapsedLabel(start: string | number | undefined, end: number): string | null {
 const from = typeof start === 'number' ? start : typeof start === 'string' ? Date.parse(start) : NaN;
 if (!Number.isFinite(from) || !Number.isFinite(end)) return null;
 const seconds = Math.max(0, Math.floor((end - from) / 1000));
 const hours = Math.floor(seconds / 3600), minutes = Math.floor((seconds % 3600) / 60), remainder = seconds % 60;
 return `${hours ? `${hours} jam ` : ''}${minutes} menit ${remainder} detik`;
}
