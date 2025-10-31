
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import type { ConfettiParticle, ConfettiConfig } from '../types';

export interface ConfettiHandles {
  create: (x: number, y: number, config: ConfettiConfig) => void;
}

interface ConfettiProps {
  config: ConfettiConfig;
}

const Confetti = forwardRef<ConfettiHandles, ConfettiProps>(({ config }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<ConfettiParticle[]>([]);
  const configRef = useRef(config);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  useImperativeHandle(ref, () => ({
    create(x: number, y: number, currentConfig: ConfettiConfig) {
      for (let i = 0; i < currentConfig.count; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const velocity = Math.random() * currentConfig.velocity + 3;
        particles.current.push({
          x,
          y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          size: Math.random() * currentConfig.size + 2,
          color: `hsl(${Math.random() * 360}, 90%, 65%)`,
          rotation: Math.random() * 360,
          spin: (Math.random() - 0.5) * 20,
          opacity: 1,
          gravity: currentConfig.gravity,
        });
      }
    }
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current = particles.current.filter(p => {
        // Update particle physics
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.spin;
        p.opacity -= configRef.current.fadeOut;

        // Draw particle
        if (p.opacity > 0) {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation * Math.PI / 180);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.opacity;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();
            return true;
        }
        return false; // Remove particle
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10000,
      }}
    />
  );
});

Confetti.displayName = 'Confetti';

export default Confetti;