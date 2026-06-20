import { useEffect, useRef } from "react";
import "./styles/OceanTopographyBackground.css";

/* Procedural ocean surface — a dotted topographic field whose points all ride
 * one shared, smooth flow field, so the grid reads as a single living sea
 * rather than a static lattice or independent jitter.
 *
 * The flow is a sum of layered traveling sine waves (a cheap Perlin-style
 * field) sampled by each dot's (x, y) and time t. From it we derive:
 *   - a height channel  → vertical lift + crest brightness/size banding
 *   - an orbital channel → horizontal sway, 90° out of phase with height,
 *     so each dot traces the small ellipse a real water particle follows
 *     as a swell rolls through.
 * Neighbouring dots share wavefronts, producing rolling swells, crests and
 * troughs that sweep across the field. Pure sinusoids loop seamlessly — no
 * reset or jump, ever.
 *
 * Canvas 2D, DPR-capped at 2, ~60 FPS, GPU-light (flat arcs). Paused when the
 * tab is hidden or the hero scrolls out of view, and rendered as a single
 * static frame when prefers-reduced-motion is set. */

const DPR_CAP = 2;
/* ~60 FPS ceiling. The 65-target headroom guarantees a true 60 Hz display's
 * ~16.6 ms frames always clear the gate instead of dropping to half rate. */
const FRAME_MIN_MS = 1000 / 65;

const CONTOUR_LINES = 6;
const SAMPLES_PER_LINE = 96;

/* Per-cell drift caps as fractions of grid spacing. Vertical lift dominates
 * (swells rise and fall) with a gentler horizontal sway; both stay well under
 * a full cell so dots never visibly trade places with their neighbours. */
const DRIFT_AMP_Y = 0.52;
const DRIFT_AMP_X = 0.34;
const CONTOUR_AMP_Y = 0.055;

/* Layered plane-wave swells. Each is a traveling sinusoid with wave vector
 * (kx, ky) in radians across the normalised field, angular speed omega in
 * rad/s, amplitude and a phase offset. A dominant long swell carries a
 * diagonal cross-swell and a finer surface ripple, giving calm ocean chop.
 * Periods (2π / omega) are ~17 s / ~13 s / ~9.5 s — a slow, premium cadence
 * that clearly travels without ever reading as fast jitter. */
const WAVES = [
  { kx: 1.8, ky: 0.55, omega: 0.37, amp: 0.6, phase: 0.0 },
  { kx: -1.25, ky: 1.7, omega: 0.48, amp: 0.3, phase: 1.7 },
  { kx: 3.4, ky: -2.1, omega: 0.66, amp: 0.16, phase: 0.9 },
];
const AMP_TOTAL = WAVES.reduce((sum, w) => sum + w.amp, 0);
const WAVE_DIRS = WAVES.map((w) => {
  const len = Math.hypot(w.kx, w.ky) || 1;
  return { ux: w.kx / len, uy: w.ky / len };
});

function parseHex(hex) {
  const m = hex.trim().replace(/^#/, "");
  if (m.length === 3) {
    return [0, 1, 2].map((i) => parseInt(m[i] + m[i], 16));
  }
  return [0, 2, 4].map((i) => parseInt(m.slice(i, i + 2), 16));
}

/* Sample the shared flow field at normalised coordinate (x, y in 0..1) and
 * time t (seconds). Returns:
 *   height ∈ [-1, 1] — surface elevation; +1 crest, -1 trough
 *   swayX           — horizontal orbital displacement (quadrature with height)
 * Height uses sin(phase); sway uses cos(phase) projected onto each wave's
 * direction — the 90° offset is what turns vertical bob into orbital roll. */
function flowAt(x, y, t) {
  let height = 0;
  let swayX = 0;
  for (let i = 0; i < WAVES.length; i++) {
    const w = WAVES[i];
    const phase = w.kx * x + w.ky * y - w.omega * t + w.phase;
    height += w.amp * Math.sin(phase);
    swayX += w.amp * Math.cos(phase) * WAVE_DIRS[i].ux;
  }
  return { height: height / AMP_TOTAL, swayX: swayX / AMP_TOTAL };
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

    /* Read tokens off the canvas element so it inherits whichever surface
     * variant the section is mounted under. Crests lift the accent toward a
     * lighter tint so swells catch the light like a real water surface. */
    const css = getComputedStyle(canvas);
    const accentHex =
      css.getPropertyValue("--ocean-accent").trim() ||
      css.getPropertyValue("--color-accent").trim() ||
      "#7ea4cc";
    const [baseR, baseG, baseB] = parseHex(accentHex);
    const crestR = Math.round(baseR + (255 - baseR) * 0.55);
    const crestG = Math.round(baseG + (255 - baseG) * 0.55);
    const crestB = Math.round(baseB + (255 - baseB) * 0.55);

    let width = 0;
    let height = 0;
    let dpr = 1;
    let cols = 56;
    let rows = 30;
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
      const dotR = Math.max(0.6, dpr * 0.9);

      /* Dot field — every dot rides the shared flow. Height lifts it
       * vertically and drives brightness + radius so crests read as luminous
       * raised bands; the orbital channel sways it horizontally so the whole
       * surface rolls rather than merely bobbing. */
      for (let j = 0; j < rows; j++) {
        const v = j / (rows - 1);
        for (let i = 0; i < cols; i++) {
          const u = i / (cols - 1);
          const { height: h, swayX } = flowAt(u, v, t);
          const lift = (h + 1) * 0.5; // 0 trough → 1 crest
          const cx = i * stepX + swayX * driftX;
          const cy = j * stepY - h * driftY; // crest rises (−y)
          const alpha = 0.1 + lift * 0.34;
          const r = dotR * (0.7 + lift * 0.72);
          const mix = lift * lift * 0.6; // crest catches the light
          const cr = Math.round(baseR + (crestR - baseR) * mix);
          const cg = Math.round(baseG + (crestG - baseG) * mix);
          const cb = Math.round(baseB + (crestB - baseB) * mix);
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha.toFixed(3)})`;
          ctx.fill();
        }
      }

      /* Contour ridges — horizontal polylines undulating along the same
       * height field, so the dots and the topographic lines read as one
       * coherent current. */
      ctx.lineWidth = Math.max(0.6, dpr * 0.7);
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      for (let l = 0; l < CONTOUR_LINES; l++) {
        const baseY = (l + 0.5) / CONTOUR_LINES;
        ctx.beginPath();
        for (let s = 0; s <= SAMPLES_PER_LINE; s++) {
          const u = s / SAMPLES_PER_LINE;
          const { height: h } = flowAt(u, baseY, t);
          const x = u * width;
          const y = baseY * height - h * height * CONTOUR_AMP_Y;
          if (s === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        const lineAlpha = 0.06 + (l % 2 === 0 ? 0.045 : 0);
        ctx.strokeStyle = `rgba(${baseR},${baseG},${baseB},${lineAlpha.toFixed(3)})`;
        ctx.stroke();
      }
    }

    function loop(now) {
      if (disposed) return;
      raf = requestAnimationFrame(loop);
      if (!visible || !inView) return;
      if (now - lastDraw < FRAME_MIN_MS) return;
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
