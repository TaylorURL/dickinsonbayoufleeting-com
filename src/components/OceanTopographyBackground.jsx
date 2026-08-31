import { useEffect, useRef } from "react";

// Procedural ocean surface — a dotted topographic field whose points all ride
// one shared, smooth flow field, so the grid reads as a single living sea
// rather than a static lattice or independent jitter.
//
// The flow is a sum of layered traveling sine waves (a cheap Perlin-style
// field) sampled by each dot's (x, y) and time t. From it we derive:
// - a height channel  → vertical lift + crest brightness/size banding
// - an orbital channel → horizontal sway, 90° out of phase with height,
// so each dot traces the small ellipse a real water particle follows
// as a swell rolls through.
// Neighbouring dots share wavefronts, producing rolling swells, crests and
// troughs that sweep across the field. Pure sinusoids close on themselves,
// so the field never resets or jumps.
//
// Canvas 2D, DPR-capped at 2, ~60 FPS, GPU-light (flat arcs). Paused when the
// tab is hidden or the hero scrolls out of view, and rendered as a single
// static frame when prefers-reduced-motion is set.

const DPR_CAP = 2;
// ~60 FPS ceiling. The 65-target headroom guarantees a true 60 Hz display's
// ~16.6 ms frames always clear the gate instead of dropping to half rate.
const FRAME_MIN_MS = 1000 / 65;

const CONTOUR_LINES = 6;
const SAMPLES_PER_LINE = 96;

// Crest banding. The water's colour is a ramp of tokens (--ocean-dot-1 at the
// trough, -6 at the crest) rather than a lerp computed here, so retuning the
// sea is an edit in the token file. Banding also means six fillStyle changes
// a frame instead of one per dot.
const DOT_BANDS = 6;

// Per-cell drift caps as fractions of grid spacing. Vertical lift dominates
// (swells rise and fall) with a gentler horizontal sway; both stay well under
// a full cell so dots never visibly trade places with their neighbours.
const DRIFT_AMP_Y = 0.52;
const DRIFT_AMP_X = 0.34;
const CONTOUR_AMP_Y = 0.055;

// Layered plane-wave swells. Each is a traveling sinusoid with wave vector
// (kx, ky) in radians across the normalised field, angular speed omega in
// rad/s, amplitude and a phase offset. A dominant long swell carries a
// diagonal cross-swell and a finer surface ripple, giving calm ocean chop.
// Periods (2π / omega) are ~17 s / ~13 s / ~9.5 s — a slow, premium cadence
// that clearly travels without ever reading as fast jitter.
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

// Sample the shared flow field at normalised coordinate (x, y in 0..1) and
// time t (seconds). Returns:
// height ∈ [-1, 1] — surface elevation; +1 crest, -1 trough
// swayX           — horizontal orbital displacement (quadrature with height)
// Height uses sin(phase); sway uses cos(phase) projected onto each wave's
// direction — the 90° offset is what turns vertical bob into orbital roll.
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
  // The first frame lands a tick after mount. Until it does the plate below
  // holds the box, so the section never opens on an empty rectangle. The plate
  // is retired through the DOM rather than through state: nothing else on the
  // page reads whether the canvas has painted, and a render per frame for a
  // value only the plate uses is a render nobody needs.
  const plateRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reducedMotionMQ = window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : null;

    // Read tokens off the canvas element so the water inherits whichever
    // surface the section is mounted under.
    const css = getComputedStyle(canvas);
    const bandColour = Array.from({ length: DOT_BANDS }, (_, i) =>
      css.getPropertyValue(`--ocean-dot-${i + 1}`).trim(),
    );
    const lineColour =
      css.getPropertyValue("--ocean-line").trim() ||
      css.getPropertyValue("--color-accent").trim();
    // Without the ramp there is no water to draw, and inventing a colour here
    // would put a value on screen that no theme voted for.
    if (bandColour.some((c) => !c) || !lineColour) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let cols = 56;
    let rows = 30;
    let raf = 0;
    let lastDraw = 0;
    // Reused across frames so a 60 Hz redraw allocates nothing. Sized on the
    // first resize, once the grid density is known.
    let bandX = [];
    let bandY = [];
    let bandR = [];
    let bandA = [];
    const bandN = new Uint32Array(DOT_BANDS);

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
      // Scale grid density to viewport so dots stay visually consistent.
      const aspect = rect.width / Math.max(1, rect.height);
      cols = Math.round(Math.min(78, Math.max(34, rect.width / 26)));
      rows = Math.round(cols / Math.max(1.2, aspect));

      const capacity = cols * rows;
      if (!bandX.length || bandX[0].length < capacity) {
        bandX = Array.from(
          { length: DOT_BANDS },
          () => new Float32Array(capacity),
        );
        bandY = Array.from(
          { length: DOT_BANDS },
          () => new Float32Array(capacity),
        );
        bandR = Array.from(
          { length: DOT_BANDS },
          () => new Float32Array(capacity),
        );
        bandA = Array.from(
          { length: DOT_BANDS },
          () => new Float32Array(capacity),
        );
      }
    }

    function drawFrame(time) {
      ctx.clearRect(0, 0, width, height);

      const t = time * 0.001;
      const stepX = width / (cols - 1);
      const stepY = height / (rows - 1);
      const driftX = stepX * DRIFT_AMP_X;
      const driftY = stepY * DRIFT_AMP_Y;
      const dotR = Math.max(0.6, dpr * 0.9);

      // Dot field — every dot rides the shared flow. Height lifts it
      // vertically and drives brightness + radius so crests read as luminous
      // raised bands; the orbital channel sways it horizontally so the whole
      // surface rolls rather than merely bobbing. Dots are sorted into crest
      // bands first and drawn band by band, so the colour is set six times a
      // frame instead of once per dot.
      bandN.fill(0);
      for (let j = 0; j < rows; j++) {
        const v = j / (rows - 1);
        for (let i = 0; i < cols; i++) {
          const u = i / (cols - 1);
          const { height: h, swayX } = flowAt(u, v, t);
          const lift = (h + 1) * 0.5; // 0 trough → 1 crest
          const band = Math.min(
            DOT_BANDS - 1,
            (lift * lift * DOT_BANDS) | 0, // crest catches the light
          );
          const n = bandN[band]++;
          bandX[band][n] = i * stepX + swayX * driftX;
          bandY[band][n] = j * stepY - h * driftY; // crest rises (−y)
          bandR[band][n] = dotR * (0.7 + lift * 0.72);
          bandA[band][n] = 0.1 + lift * 0.34;
        }
      }

      for (let b = 0; b < DOT_BANDS; b++) {
        const count = bandN[b];
        if (!count) continue;
        ctx.fillStyle = bandColour[b];
        const xs = bandX[b];
        const ys = bandY[b];
        const rs = bandR[b];
        const as = bandA[b];
        for (let n = 0; n < count; n++) {
          ctx.globalAlpha = as[n];
          ctx.beginPath();
          ctx.arc(xs[n], ys[n], rs[n], 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Contour ridges — horizontal polylines undulating along the same
      // height field, so the dots and the topographic lines read as one
      // coherent current.
      ctx.lineWidth = Math.max(0.6, dpr * 0.7);
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.strokeStyle = lineColour;
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
        ctx.globalAlpha = 0.06 + (l % 2 === 0 ? 0.045 : 0);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    function loop(now) {
      if (disposed) return;
      raf = requestAnimationFrame(loop);
      if (!visible || !inView) return;
      if (now - lastDraw < FRAME_MIN_MS) return;
      lastDraw = now;
      drawFrame(now);
      retirePlate();
    }

    function staticFrame() {
      drawFrame(0);
      retirePlate();
    }

    function retirePlate() {
      const plate = plateRef.current;
      if (!plate || plate.dataset.painted === "true") return;
      plate.dataset.painted = "true";
      // Once the fade lands the plate leaves the tree. Holding it at zero
      // opacity would keep a full-bleed box stacked over the canvas for the
      // life of the page.
      plate.addEventListener(
        "transitionend",
        (e) => {
          if (e.propertyName === "opacity") plate.remove();
        },
        { once: true },
      );
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

  // The plate holds the box until the first frame lands, so the section never
  // opens on an unpainted rectangle a shade off the plate around it. Visibility
  // is delayed off the opacity so the fade runs before the box leaves the
  // hit-testing tree.
  return (
    <div
      className={`pointer-events-none absolute inset-0 block h-full w-full ${className}`.trim()}
      aria-hidden="true"
    >
      <span
        ref={plateRef}
        data-placeholder
        data-painted="false"
        className="absolute inset-0 min-h-full bg-bg-deep opacity-100 visible transition-[opacity,visibility] duration-settle ease-settle data-[painted=true]:invisible data-[painted=true]:opacity-0 data-[painted=true]:delay-[0ms,280ms]"
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block h-full w-full"
      />
    </div>
  );
}

export default OceanTopographyBackground;
