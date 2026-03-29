import { useState, useEffect, useRef, useCallback } from 'react';
import { tileCounter } from '../utils/tileCounter';
import { scrollEngine } from '../engine/ScrollEngine';
import { hudStyles } from '../styles/componentStyles/hudStyles';

export function PerformanceHUD() {
  const [visible, setVisible] = useState(false);
  const [tileCount, setTileCount] = useState(0);
  const [fps, setFps] = useState(0);
  const [animCount, setAnimCount] = useState(0);
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

    setTileCount(tileCounter.getCount());
    const unsubTiles = tileCounter.onChange(setTileCount);

    const interval = setInterval(() => {
      setFps(frameTimesRef.current.length);
      setAnimCount(scrollEngine.getAnimationCount());
    }, 500);

    return () => {
      unsubTiles();
      clearInterval(interval);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div style={hudStyles.container}>
      <div>FPS: {fps}</div>
      <div>Tiles: {tileCount}</div>
      <div>Anims: {animCount}</div>
    </div>
  );
}
