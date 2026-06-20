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
const DRIFT_AMP_X = 0.6;
const DRIFT_AMP_Y = 0.48;
const CONTOUR_AMP_Y = 0.055;

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
 * t in seconds. Returns horizontal drift, vertical undulation, and a
 * brightness/scale modulation channel — each layered from three sine/cosine
 * terms of differing frequency, phase, and time rate. Row- and column-
 * dependent phases create the parallax (adjacent rows lag slightly), while
 * the slowest terms dominate so the motion reads as a calm current rather
 * than a busy ripple. */
function flowAt(x, y, t) {
  const dx =
    Math.sin(y * 2.6 + t * 0.14) * 0.55 +
    Math.sin(x * 1.8 + y * 1.3 - t * 0.09) * 0.30 +
    Math.cos(x * 4.6 + y * 3.2 + t * 0.22) * 0.16;

  const dy =
    Math.sin(x * 3.1 + t * 0.12) * 0.42 +
    Math.cos(x * 2.2 - y * 3.8 + t * 0.18) * 0.28 +
    Math.sin(x * 6.8 + y * 4.4 - t * 0.26) * 0.14;

  const mod =
    Math.sin(x * 4.8 + y * 2.1 + t * 0.18) * 0.55 +
    Math.cos(x * 2.4 - y * 3.6 + t * 0.24) * 0.35;

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
