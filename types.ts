
export interface Site {
  name: string;
  url: string;
  favicon: string;
}

export interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  spin: number;
  opacity: number;
  gravity: number;
}

export interface CursorConfig {
  fillOpacity: number;
  blurRadius: number;
  edgeThickness: number;
  edgeOpacity: number;
  borderOpacity: number;
}

export interface ConfettiConfig {
  count: number;
  size: number;
  velocity: number;
  gravity: number;
  fadeOut: number;
}

export interface GlowConfig {
  blur: number;
  spread: number;
  color: {
    r: number;
    g: number;
    b: number;
    a: number;
  };
}