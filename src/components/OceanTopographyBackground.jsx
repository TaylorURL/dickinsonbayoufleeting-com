import { useEffect, useRef } from "react";
import "./styles/OceanTopographyBackground.css";

/* Procedural ocean topography — a dotted/contour field whose points and
 * polylines ride a slow, layered flow field that reads as a coastal current.
 * Cheap (Canvas 2D, deterministic, no perlin), DPR-capped at 2, frame-
 * budgeted to ~32 FPS, paused when the tab is hidden or the hero is scrolled
 * out of view, and downgraded to a single static frame when prefers-reduced-
 * motion is set. */

const COLS_DEFAULT = 56;
const ROWS_DEFAULT = 30;
const CONTOUR_LINES = 7;
const SAMPLES_PER_LINE = 88;
const FRAME_INTERVAL_MS = 1000 / 32;
const DPR_CAP = 2;

/* Per-cell drift caps, expressed as fractions of grid spacing. Bounded so
 * dots never visibly swap positions with their neighbours. */
const DRIFT_AMP_X = 0.55;
const DRIFT_AMP_Y = 0.42;
const CONTOUR_AMP_Y = 0.05;

/* Layered plane-wave swells. Each entry is a traveling sinusoid with wave
 * vector (kx, ky) in radians per unit grid, angular speed omega in rad/s,
 * amplitude (combined max ~1.0), and a phase offset. Combining three at
 * different directions, wavelengths and speeds produces ocean chop — a
 * dominant long swell with cross-swell and finer surface ripple riding it.
 * Periods (2π / omega) are ~10s / ~7.5s / ~5.5s — slow enough to read as
 * a calm sea but fast enough to clearly travel rather than appear static. */
const WAVES = [
  { kx: 2.6, ky: 0.8, omega: 0.62, amp: 0.52, phase: 0.0 },
  { kx: -1.6, ky: 2.0, omega: 0.84, amp: 0.32, phase: 1.7 },
  { kx: 4.2, ky: -2.4, omega: 1.14, amp: 0.16, phase: 0.9 },
];
const WAVE_DIRS = WAVES.map((w) => {
  const len = Math.hypot(w.kx, w.ky) || 1;
  return { ux: w.kx / len, uy: w.ky / len };
});

function parseHex(hex) {
  const m = hex.trim().replace(/^#/, "");
  if (m.length === 3) {
    const r = parseInt(m[0] + m[0], 16);
    const g = parseInt(m[1] + m[1], 16);
    const b = parseInt(m[2] + m[2], 16);
    return [r, g, b];
  }
  const r = parseInt(m.slice(0, 2), 16);
  const g = parseInt(m.slice(2, 4), 16);
  const b = parseInt(m.slice(4, 6), 16);
  return [r, g, b];
}

/* Flow field sampled at a normalised grid coordinate (x,y in 0..1) and time
 * t in seconds. Sums each wave's contribution as orbital particle motion:
 * a surface point traces a small circle as a swell passes through, with
 * horizontal displacement along the wave's direction (cos) and vertical
 * lift in quadrature (sin). Neighbouring dots therefore move in phase-
 * shifted unison along the same wavefronts, so the field reads as
 * coordinated rolling swells rather than independent jitter. */
function flowAt(x, y, t) {
  let dx = 0;
  let dy = 0;
  let mod = 0;
  for (let i = 0; i < WAVES.length; i++) {
    const w = WAVES[i];
    const dir = WAVE_DIRS[i];
    const phase = w.kx * x + w.ky * y - w.omega * t + w.phase;
    const c = Math.cos(phase);
    const s = Math.sin(phase);
    dx += w.amp * c * dir.ux;
    dy += w.amp * s;
    mod += s * w.amp;
  }
  return { dx, dy, mod };
}

function OceanTopographyBackground({ className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reducedMotionMQ = window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : null;

    /* Read tokens off the canvas element so it picks up whichever
     * surface variant the section is mounted under. */
    const css = getComputedStyle(canvas);
    const accentHex =
      css.getPropertyValue("--ocean-accent").trim() ||
      css.getPropertyValue("--color-accent").trim() ||
      "#7ea4cc";
    const [R, G, B] = parseHex(accentHex);

    let width = 0;
    let height = 0;
    let dpr = 1;
    let cols = COLS_DEFAULT;
    let rows = ROWS_DEFAULT;
    let raf = 0;
    let lastDraw = 0;
    let visible = document.visibilityState !== "hidden";
    let inView = true;
    let reduced = reducedMotionMQ?.matches ?? false;
    let disposed = false;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const newDpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      const newW = Math.max(1, Math.round(rect.width * newDpr));
      const newH = Math.max(1, Math.round(rect.height * newDpr));
      if (newW === width && newH === height && newDpr === dpr) return;
      width = newW;
      height = newH;
      dpr = newDpr;
      canvas.width = width;
      canvas.height = height;
      /* Scale grid density to viewport so dots stay visually consistent. */
      const aspect = rect.width / Math.max(1, rect.height);
      cols = Math.round(Math.min(78, Math.max(34, rect.width / 26)));
      rows = Math.round(cols / Math.max(1.2, aspect));
    }

    function drawFrame(time) {
      ctx.clearRect(0, 0, width, height);

      const t = time * 0.001;
      const stepX = width / (cols - 1);
      const stepY = height / (rows - 1);
      const driftX = stepX * DRIFT_AMP_X;
      const driftY = stepY * DRIFT_AMP_Y;
      const dotR = Math.max(0.55, dpr * 0.85);

      /* Dot grid — each dot rides the flow field, drifting horizontally and
       * vertically with row/column phase offsets that mimic an ocean
       * current. Alpha and radius pulse with the mod channel. */
      for (let j = 0; j < rows; j++) {
        const v = j / (rows - 1);
        for (let i = 0; i < cols; i++) {
          const u = i / (cols - 1);
          const { dx, dy, mod } = flowAt(u, v, t);
          const cx = i * stepX + dx * driftX;
          const cy = j * stepY + dy * driftY;
          const alpha = Math.max(0.06, Math.min(0.48, 0.20 + (mod + 1) * 0.14));
          const r = dotR * (0.78 + (mod + 1.5) * 0.20);
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${R},${G},${B},${alpha.toFixed(3)})`;
          ctx.fill();
        }
      }

      /* Contour ridges — N horizontal polylines that undulate vertically
       * along the same flow field, so the dot drift and the ridges read as
       * one current. */
      ctx.lineWidth = Math.max(0.6, dpr * 0.7);
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      for (let l = 0; l < CONTOUR_LINES; l++) {
        const baseY = (l + 0.5) / CONTOUR_LINES;
        ctx.beginPath();
        for (let s = 0; s <= SAMPLES_PER_LINE; s++) {
          const u = s / SAMPLES_PER_LINE;
          const { dy } = flowAt(u, baseY, t);
          const x = u * width;
          const y = baseY * height + dy * height * CONTOUR_AMP_Y;
          if (s === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        const lineAlpha = 0.07 + (l % 2 === 0 ? 0.05 : 0);
        ctx.strokeStyle = `rgba(${R},${G},${B},${lineAlpha.toFixed(3)})`;
        ctx.stroke();
      }
    }

    function loop(now) {
      if (disposed) return;
      raf = requestAnimationFrame(loop);
      if (!visible || !inView) return;
      if (now - lastDraw < FRAME_INTERVAL_MS) return;
      lastDraw = now;
      drawFrame(now);
    }

    function staticFrame() {
      drawFrame(0);
    }

    resize();
    if (reduced) {
      staticFrame();
    } else {
      raf = requestAnimationFrame(loop);
    }

    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) staticFrame();
    });
    ro.observe(canvas);

    const onVisibility = () => {
      visible = document.visibilityState !== "hidden";
    };
    document.addEventListener("visibilitychange", onVisibility);

    const io = new IntersectionObserver(
      (entries) => {
        inView = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const onMQ = (e) => {
      reduced = e.matches;
      if (reduced) {
        cancelAnimationFrame(raf);
        staticFrame();
      } else {
        raf = requestAnimationFrame(loop);
      }
    };
    reducedMotionMQ?.addEventListener?.("change", onMQ);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      reducedMotionMQ?.removeEventListener?.("change", onMQ);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`oceanBg ${className}`.trim()}
      aria-hidden="true"
    />
  );
}

export default OceanTopographyBackground;
