export type PatternGrid = boolean[][];

export function encodePattern(grid: PatternGrid): string {
  return btoa(JSON.stringify(grid));
}

export function decodePattern(hash: string): PatternGrid | null {
  try {
    const clean = hash.replace(/^#/, "");
    if (!clean) return null;
    return JSON.parse(atob(clean)) as PatternGrid;
  } catch {
    return null;
  }
}

export function triggerTrack(ctx: AudioContext, trackIdx: number): void {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.frequency.value = 80 + trackIdx * 95;
  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.13);
}
