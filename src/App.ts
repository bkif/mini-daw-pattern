import { decodePattern, encodePattern, triggerTrack, type PatternGrid } from "./audio/drumSynth";

export function mountApp(root: HTMLElement): void {
  const grid: PatternGrid =
    decodePattern(window.location.hash) ??
    Array.from({ length: 6 }, () => Array.from({ length: 16 }, () => false));

  root.innerHTML = `
    <div style="padding:20px;max-width:760px;margin:0 auto;">
      <h1 style="margin:0 0 12px;font-size:20px;">Mini DAW Pattern</h1>
      <button id="share-btn" type="button">Copy Share URL</button>
      <div id="matrix" style="margin-top:12px;display:flex;flex-direction:column;gap:4px;"></div>
    </div>
  `;

  const matrix = root.querySelector<HTMLElement>("#matrix")!;
  let ctx: AudioContext | null = null;

  const render = () => {
    matrix.innerHTML = "";
    grid.forEach((row, rIdx) => {
      const rowEl = document.createElement("div");
      rowEl.style.display = "grid";
      rowEl.style.gridTemplateColumns = "repeat(16, 1fr)";
      rowEl.style.gap = "4px";
      row.forEach((on, cIdx) => {
        const b = document.createElement("button");
        b.type = "button";
        b.style.height = "26px";
        b.style.border = "none";
        b.style.borderRadius = "4px";
        b.style.background = on ? "#38bdf8" : "#27272a";
        b.onclick = () => {
          if (!ctx) ctx = new AudioContext();
          grid[rIdx][cIdx] = !grid[rIdx][cIdx];
          if (grid[rIdx][cIdx]) triggerTrack(ctx, rIdx);
          window.location.hash = encodePattern(grid);
          render();
        };
        rowEl.appendChild(b);
      });
      matrix.appendChild(rowEl);
    });
  };
  render();

  root.querySelector<HTMLButtonElement>("#share-btn")!.onclick = () => {
    void navigator.clipboard?.writeText(window.location.href);
  };
}
