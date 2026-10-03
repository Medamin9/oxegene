import React, { useEffect, useRef } from 'react';

/**
 * SnowEffect Component
 * Renders an ambient falling snow background effect using the custom snow.png snowflake asset.
 * Features variant small dimensions, depth layers, realistic swaying, and smooth performance.
 */
function SnowEffect({
  imageSrc = '/snow.png',
  count, // optional custom flake count; otherwise responsive
  minSize = 4,
  maxSize = 20,
  speedMultiplier = 0.4,
  className = 'fixed inset-0 pointer-events-none z-0',
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let flakes = [];
    let isRunning = true;

    // Load snowflake image
    const snowImage = new Image();
    snowImage.src = imageSrc;

    // Handle high DPI displays for crisp rendering
    const updateCanvasSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      return { width, height };
    };

    let { width, height } = updateCanvasSize();

    // Create a single snowflake with variant sizes, depth, and dynamics
    const createFlake = (initialY = null) => {
      // 3 visual depth tiers to give variant sizes and realistic depth:
      // ~45% small & distant, ~35% medium, ~20% slightly larger foreground
      const tier = Math.random();
      let size, opacity, speedY, swayAmp;

      if (tier < 0.45) {
        // Small / Distant
        size = minSize + Math.random() * 5; // e.g. 9px - 14px
        opacity = 0.25 + Math.random() * 0.25; // 0.25 - 0.50
        speedY = (0.5 + Math.random() * 0.5) * speedMultiplier;
        swayAmp = 10 + Math.random() * 15;
      } else if (tier < 0.8) {
        // Medium
        size = minSize + 6 + Math.random() * 7; // e.g. 15px - 22px
        opacity = 0.45 + Math.random() * 0.25; // 0.45 - 0.70
        speedY = (0.9 + Math.random() * 0.6) * speedMultiplier;
        swayAmp = 15 + Math.random() * 20;
      } else {
        // Closer / Larger small dimension
        size = minSize + 14 + Math.random() * (maxSize - (minSize + 14)); // e.g. 23px - 28px
        opacity = 0.65 + Math.random() * 0.25; // 0.65 - 0.90
        speedY = (1.4 + Math.random() * 0.7) * speedMultiplier;
        swayAmp = 20 + Math.random() * 25;
      }

      return {
        x: Math.random() * width,
        y: initialY !== null ? initialY : -size - Math.random() * 50,
        size,
        opacity,
        speedY,
        swayAmp,
        swaySpeed: 0.008 + Math.random() * 0.015,
        phase: Math.random() * Math.PI * 2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.015,
        wind: 0.2 + Math.random() * 0.3,
      };
    };

    // Calculate flake count based on viewport width if not provided
    const getFlakeCount = () => {
      if (typeof count === 'number' && count > 0) return count;
      return Math.floor(Math.min(Math.max(window.innerWidth / 26, 32), 70));
    };

    // Initialize flakes distributed across the screen
    const initFlakes = () => {
      const total = getFlakeCount();
      flakes = [];
      for (let i = 0; i < total; i++) {
        // Distribute vertically from top to bottom on initial render
        const initialY = Math.random() * height;
        flakes.push(createFlake(initialY));
      }
    };

    initFlakes();

    // Render loop
    const render = () => {
      if (!isRunning) return;

      ctx.clearRect(0, 0, width, height);

      // Draw all snowflakes if image is ready
      const isImgReady = snowImage.complete && snowImage.naturalWidth !== 0;

      for (let i = 0; i < flakes.length; i++) {
        const flake = flakes[i];

        // Update physics
        flake.phase += flake.swaySpeed;
        flake.y += flake.speedY;
        flake.x += flake.wind;
        flake.rotation += flake.rotationSpeed;

        const currentX = flake.x + Math.sin(flake.phase) * flake.swayAmp;

        // Wrap around bottom
        if (flake.y - flake.size > height) {
          flake.y = -flake.size - Math.random() * 20;
          flake.x = Math.random() * width;
          flake.phase = Math.random() * Math.PI * 2;
        }

        // Wrap around sides
        if (currentX > width + flake.size + 30) {
          flake.x = -flake.size - 20;
        } else if (currentX < -flake.size - 30) {
          flake.x = width + flake.size + 20;
        }

        // Draw snowflake image scaled down to small variant dimensions
        if (isImgReady) {
          ctx.save();
          ctx.translate(currentX, flake.y);
          ctx.rotate(flake.rotation);
          ctx.globalAlpha = flake.opacity;
          ctx.drawImage(
            snowImage,
            -flake.size / 2,
            -flake.size / 2,
            flake.size,
            flake.size
          );
          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    // If image loads or is already cached, ensure smooth start
    if (snowImage.complete) {
      render();
    } else {
      snowImage.onload = () => {
        if (isRunning) render();
      };
      // Start anyway so timing is maintained
      render();
    }

    // Handle resize
    const handleResize = () => {
      const dims = updateCanvasSize();
      width = dims.width;
      height = dims.height;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      isRunning = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [imageSrc, count, minSize, maxSize, speedMultiplier]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{
        pointerEvents: 'none',
      }}
    />
  );
}

export default SnowEffect;
