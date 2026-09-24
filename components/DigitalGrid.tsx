"use client";

import { useEffect, useRef } from "react";

/**
 * Full-viewport canvas: dot matrix + hairline grid that displaces around
 * the cursor. Dots and line intersections push outward from the pointer,
 * creating a subtle magnetic-repulsion lens effect.
 *
 * Disabled under reduced motion and coarse pointers.
 */

const DOT_SPACING = 28;
const DOT_RADIUS = 1;
const LINE_OPACITY = 0.15;
const DOT_OPACITY = 0.4;
const DISPLACE_RADIUS = 80;
const DISPLACE_STRENGTH = 10;

export default function DigitalGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -1000, y: -1000 });
  const raf = useRef(0);
  const dirty = useRef(true);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      canvas!.width = window.innerWidth * dpr;
      canvas!.height = window.innerHeight * dpr;
      canvas!.style.width = window.innerWidth + "px";
      canvas!.style.height = window.innerHeight + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    // Read CSS variable for grid color
    const style = getComputedStyle(document.documentElement);
    const frameColor = style.getPropertyValue("--frame").trim() || "#3d3a36";

    // Parse hex to rgb
    function hexToRgb(hex: string) {
      const h = hex.replace("#", "");
      return {
        r: parseInt(h.substring(0, 2), 16),
        g: parseInt(h.substring(2, 4), 16),
        b: parseInt(h.substring(4, 6), 16),
      };
    }
    const rgb = hexToRgb(frameColor);

    // Re-read --frame when theme class changes (light/dark toggle)
    const observer = new MutationObserver(() => {
      const newFrame = getComputedStyle(document.documentElement).getPropertyValue("--frame").trim() || "#3d3a36";
      const newRgb = hexToRgb(newFrame);
      rgb.r = newRgb.r;
      rgb.g = newRgb.g;
      rgb.b = newRgb.b;
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    function onMove(e: PointerEvent) {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      dirty.current = true;
    }

    function onLeave() {
      mouse.current.x = -1000;
      mouse.current.y = -1000;
      dirty.current = true;
    }

    function draw() {
      raf.current = requestAnimationFrame(draw);
      if (!dirty.current) return;
      dirty.current = false;

      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx!.clearRect(0, 0, w, h);

      const mx = mouse.current.x;
      const my = mouse.current.y;
      const spacing = DOT_SPACING;
      const r2 = DISPLACE_RADIUS * DISPLACE_RADIUS;

      // Draw grid lines (hairlines)
      ctx!.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${LINE_OPACITY})`;
      ctx!.lineWidth = 0.5;

      // Vertical lines
      for (let x = 0; x <= w; x += spacing) {
        ctx!.beginPath();
        for (let y = -spacing; y <= h + spacing; y += 4) {
          const dx = x - mx;
          const dy = y - my;
          const dist2 = dx * dx + dy * dy;
          let px = x;
          let py = y;
          if (dist2 < r2 && dist2 > 0) {
            const dist = Math.sqrt(dist2);
            const force = (1 - dist / DISPLACE_RADIUS) * DISPLACE_STRENGTH;
            px += (dx / dist) * force;
            py += (dy / dist) * force;
          }
          if (y === -spacing) {
            ctx!.moveTo(px, py);
          } else {
            ctx!.lineTo(px, py);
          }
        }
        ctx!.stroke();
      }

      // Horizontal lines
      for (let y = 0; y <= h; y += spacing) {
        ctx!.beginPath();
        for (let x = -spacing; x <= w + spacing; x += 4) {
          const dx = x - mx;
          const dy = y - my;
          const dist2 = dx * dx + dy * dy;
          let px = x;
          let py = y;
          if (dist2 < r2 && dist2 > 0) {
            const dist = Math.sqrt(dist2);
            const force = (1 - dist / DISPLACE_RADIUS) * DISPLACE_STRENGTH;
            px += (dx / dist) * force;
            py += (dy / dist) * force;
          }
          if (x === -spacing) {
            ctx!.moveTo(px, py);
          } else {
            ctx!.lineTo(px, py);
          }
        }
        ctx!.stroke();
      }

      // Draw dots at intersections
      ctx!.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${DOT_OPACITY})`;
      for (let x = 0; x <= w; x += spacing) {
        for (let y = 0; y <= h + spacing; y += spacing) {
          const dx = x - mx;
          const dy = y - my;
          const dist2 = dx * dx + dy * dy;
          let px = x;
          let py = y;
          let dotR = DOT_RADIUS;

          if (dist2 < r2 && dist2 > 0) {
            const dist = Math.sqrt(dist2);
            const t = 1 - dist / DISPLACE_RADIUS;
            const force = t * DISPLACE_STRENGTH;
            px += (dx / dist) * force;
            py += (dy / dist) * force;
            // Dots grow slightly near cursor
            dotR = DOT_RADIUS + t * 0.8;
          }

          ctx!.beginPath();
          ctx!.arc(px, py, dotR, 0, Math.PI * 2);
          ctx!.fill();
        }
      }

    }

    raf.current = requestAnimationFrame(draw);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", () => { resize(); dirty.current = true; });

    return () => {
      cancelAnimationFrame(raf.current);
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
