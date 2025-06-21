import React, { useEffect, useRef } from 'react';

const WaveformCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      
      const centerY = canvas.offsetHeight / 2;
      const width = canvas.offsetWidth;
      
      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, '#A64BFF');
      gradient.addColorStop(0.5, '#1EC8FF');
      gradient.addColorStop(1, '#A64BFF');
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      
      // Draw waveform
      ctx.beginPath();
      for (let x = 0; x < width; x += 2) {
        const frequency1 = 0.01;
        const frequency2 = 0.02;
        const amplitude1 = 50 * Math.sin(time * 0.005);
        const amplitude2 = 30 * Math.cos(time * 0.003);
        
        const y = centerY + 
          Math.sin(x * frequency1 + time * 0.02) * amplitude1 +
          Math.sin(x * frequency2 + time * 0.015) * amplitude2;
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      
      // Draw particles
      ctx.fillStyle = gradient;
      for (let i = 0; i < 20; i++) {
        const x = (Math.sin(time * 0.01 + i) + 1) * width / 2;
        const y = centerY + Math.sin(time * 0.02 + i * 0.5) * 100;
        const size = (Math.sin(time * 0.03 + i) + 1) * 1 + 0.5;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      
      time += 1;
      animationId = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full opacity-80"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default WaveformCanvas;