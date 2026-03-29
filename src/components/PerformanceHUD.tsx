import { type CSSProperties, useState, useEffect, useRef, useCallback } from 'react';
import { tileCounter } from '../utils/tileCounter';

export function PerformanceHUD() {
  const [visible, setVisible] = useState(false);
  const [tileCount, setTileCount] = useState(0);
  const [fps, setFps] = useState(0);
  const frameTimesRef = useRef<number[]>([]);
  const rafRef = useRef<number>(0);

  // Toggle with backtick key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === '`') {
        setVisible((v) => !v);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // FPS measurement via requestAnimationFrame
  const measureFrame = useCallback((now: number) => {
    frameTimesRef.current.push(now);
    // Keep last 1 second of frame times
    const cutoff = now - 1000;
    frameTimesRef.current = frameTimesRef.current.filter((t) => t > cutoff);
    rafRef.current = requestAnimationFrame(measureFrame);
  }, []);

  useEffect(() => {
    if (!visible) return;
    rafRef.current = requestAnimationFrame(measureFrame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [visible, measureFrame]);

  // Update display every 500ms
  useEffect(() => {
    if (!visible) return;

    // Initial tile count
    setTileCount(tileCounter.getCount());

    const unsubTiles = tileCounter.onChange(setTileCount);

    const interval = setInterval(() => {
      setFps(frameTimesRef.current.length);
    }, 500);

    return () => {
      unsubTiles();
      clearInterval(interval);
    };
  }, [visible]);

  if (!visible) return null;

  const containerStyle: CSSProperties = {
    position: 'fixed',
    top: 12,
    right: 12,
    zIndex: 9999,
    background: 'rgba(0, 0, 0, 0.85)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: 6,
    padding: '10px 14px',
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#0f0',
    lineHeight: 1.6,
    pointerEvents: 'none',
    minWidth: 160,
  };

  return (
    <div style={containerStyle}>
      <div>FPS: {fps}</div>
      <div>Tiles: {tileCount}</div>
    </div>
  );
}
