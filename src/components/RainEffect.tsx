import { useEffect, useRef } from "react";

type Raindrop = {
  x: number;
  y: number;
  length: number;
  speed: number;
  slant: number;
  opacity: number;
};

type RainEffectProps = {
  active: boolean;
};

function RainEffect({ active }: RainEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context || !active) {
      return;
    }

    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let drops: Raindrop[] = [];

    function resizeCanvas() {
      if (!canvas || !context) {
        return;
      }

      width = window.innerWidth;
      height = window.innerHeight;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.25);

      canvas.width = Math.max(1, Math.round(width * pixelRatio));
      canvas.height = Math.max(1, Math.round(height * pixelRatio));
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      drops = Array.from({ length: Math.min(280, Math.round(width / 5)) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        length: 10 + Math.random() * 18,
        speed: 5 + Math.random() * 5,
        slant: -1.5 - Math.random() * 2,
        opacity: 0.12 + Math.random() * 0.22,
      }));
    }

    function drawRain() {
      if (!context) {
        return;
      }

      context.clearRect(0, 0, width, height);
      context.strokeStyle = "#d5dfe0";
      context.lineWidth = 1;
      context.lineCap = "round";

      for (const drop of drops) {
        context.globalAlpha = drop.opacity;
        context.beginPath();
        context.moveTo(drop.x, drop.y);
        context.lineTo(drop.x + drop.slant, drop.y + drop.length);
        context.stroke();
        drop.x += drop.slant * 0.5;
        drop.y += drop.speed;

        if (drop.y > height + drop.length) {
          drop.x = Math.random() * width;
          drop.y = -drop.length;
        }

        if (drop.x < -5) {
          drop.x = width + 5;
        }
      }

      context.globalAlpha = 1;
      animationFrame = window.requestAnimationFrame(drawRain);
    }

    resizeCanvas();
    drawRain();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resizeCanvas);
      context.clearRect(0, 0, width, height);
    };
  }, [active]);

  return <canvas className="rain-effect" ref={canvasRef} aria-hidden="true" />;
}

export default RainEffect;
