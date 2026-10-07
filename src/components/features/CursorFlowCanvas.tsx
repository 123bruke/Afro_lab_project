import React, { useEffect, useRef } from 'react';
import { FlowAccentTheme } from '../../types/contextflow';

interface CursorFlowCanvasProps {
  flowSpeed: number;
  particleDensity: number;
  cursorRadius: number;
  accentTheme: FlowAccentTheme;
  showMeshLinks: boolean;
  onCursorTelemetry?: (coords: { x: number; y: number; activeNodes: number }) => void;
}

interface FlowNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseSpeed: number;
  phase: number;
  size: number;
}

const THEME_RGB: Record<FlowAccentTheme, { primary: string; secondary: string }> = {
  sky: { primary: '56, 189, 248', secondary: '16, 185, 129' },
  emerald: { primary: '16, 185, 129', secondary: '56, 189, 248' },
  amber: { primary: '245, 158, 11', secondary: '56, 189, 248' },
  zinc: { primary: '228, 228, 231', secondary: '161, 161, 170' },
};

export const CursorFlowCanvas: React.FC<CursorFlowCanvasProps> = ({
  flowSpeed,
  particleDensity,
  cursorRadius,
  accentTheme,
  showMeshLinks,
  onCursorTelemetry,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    active: boolean;
  }>({
    x: -1000,
    y: -1000,
    vx: 0,
    vy: 0,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId = 0;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    const count = Math.max(20, Math.min(160, particleDensity));
    const nodes: FlowNode[] = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (0.4 + Math.random() * 0.7) * flowSpeed,
      vy: (Math.random() - 0.5) * 0.4 * flowSpeed,
      baseSpeed: 0.45 + (i % 5) * 0.14,
      phase: Math.random() * Math.PI * 2,
      size: i % 6 === 0 ? 2.2 : 1.4,
    }));

    let frameCounter = 0;
    const palette = THEME_RGB[accentTheme] || THEME_RGB.sky;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nx = e.clientX - rect.left;
      const ny = e.clientY - rect.top;
      pointerRef.current.vx = (nx - pointerRef.current.x) * 0.25;
      pointerRef.current.vy = (ny - pointerRef.current.y) * 0.25;
      pointerRef.current.x = nx;
      pointerRef.current.y = ny;
      pointerRef.current.active =
        nx >= 0 && nx <= rect.width && ny >= 0 && ny <= rect.height;
    };

    const handleMouseLeave = () => {
      pointerRef.current.active = false;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const render = (time: number) => {
      frameCounter += 1;
      ctx.clearRect(0, 0, width, height);

      const t = time * 0.001 * flowSpeed;
      const ptr = pointerRef.current;
      let nearCursorCount = 0;

      // Subtle cursor radial field ring when pointer is inside hero
      if (ptr.active) {
        const grad = ctx.createRadialGradient(
          ptr.x,
          ptr.y,
          4,
          ptr.x,
          ptr.y,
          cursorRadius
        );
        grad.addColorStop(0, `rgba(${palette.primary}, 0.16)`);
        grad.addColorStop(0.55, `rgba(${palette.secondary}, 0.05)`);
        grad.addColorStop(1, 'rgba(9, 9, 11, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(ptr.x, ptr.y, cursorRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Update and draw each flowing context node
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        // Continuous harmonic vector field
        const fieldAngle =
          Math.sin(n.x * 0.003 + t * 0.8 + n.phase) * 0.65 +
          Math.cos(n.y * 0.004 - t * 0.6) * 0.45;

        const targetVx = Math.cos(fieldAngle) * n.baseSpeed * flowSpeed * 1.35;
        const targetVy = Math.sin(fieldAngle) * n.baseSpeed * flowSpeed * 0.95;

        n.vx += (targetVx - n.vx) * 0.05;
        n.vy += (targetVy - n.vy) * 0.05;

        // Cursor-dependent continuous flow attraction + tangential swirl
        if (ptr.active) {
          const dx = ptr.x - n.x;
          const dy = ptr.y - n.y;
          const dist = Math.hypot(dx, dy);

          if (dist < cursorRadius && dist > 1) {
            nearCursorCount += 1;
            const influence = (1 - dist / cursorRadius) * 0.85;
            // Swirl + gentle pull + cursor velocity transfer
            const nx = dx / dist;
            const ny = dy / dist;
            n.vx += (nx * 0.35 - ny * 0.45) * influence * flowSpeed + ptr.vx * 0.015 * influence;
            n.vy += (ny * 0.35 + nx * 0.45) * influence * flowSpeed + ptr.vy * 0.015 * influence;

            // Draw direct cursor-to-node context link
            ctx.strokeStyle = `rgba(${palette.primary}, ${(influence * 0.42).toFixed(3)})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(ptr.x, ptr.y);
            ctx.lineTo(n.x, n.y);
            ctx.stroke();
          }
        }

        n.x += n.vx;
        n.y += n.vy;

        // Seamless wrap-around across viewport edges
        if (n.x > width + 20) n.x = -20;
        if (n.x < -20) n.x = width + 20;
        if (n.y > height + 20) n.y = -20;
        if (n.y < -20) n.y = height + 20;

        // Draw short directional velocity trail
        ctx.strokeStyle = `rgba(${palette.primary}, 0.38)`;
        ctx.lineWidth = n.size * 0.7;
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(n.x - n.vx * 5, n.y - n.vy * 5);
        ctx.stroke();

        // Draw node point
        ctx.fillStyle = `rgba(${palette.primary}, 0.82)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw subtle mesh connections between neighboring nodes
      if (showMeshLinks) {
        const linkDist = 115;
        ctx.lineWidth = 0.6;
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const distSq = dx * dx + dy * dy;
            if (distSq < linkDist * linkDist) {
              const alpha = (1 - Math.sqrt(distSq) / linkDist) * 0.22;
              ctx.strokeStyle = `rgba(${palette.primary}, ${alpha.toFixed(3)})`;
              ctx.beginPath();
              ctx.moveTo(nodes[i].x, nodes[i].y);
              ctx.lineTo(nodes[j].x, nodes[j].y);
              ctx.stroke();
            }
          }
        }
      }

      // Decay pointer velocity smoothly
      ptr.vx *= 0.9;
      ptr.vy *= 0.9;

      if (onCursorTelemetry && frameCounter % 12 === 0 && ptr.active) {
        onCursorTelemetry({
          x: Math.round(ptr.x),
          y: Math.round(ptr.y),
          activeNodes: nearCursorCount,
        });
      }

      animationFrameId = window.requestAnimationFrame(render);
    };

    animationFrameId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [flowSpeed, particleDensity, cursorRadius, accentTheme, showMeshLinks, onCursorTelemetry]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
    />
  );
};
