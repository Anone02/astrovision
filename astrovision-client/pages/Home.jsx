import { useEffect, useRef } from 'react';
import { initScene } from '../three/scene';

export default function Home() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const cleanup = initScene(containerRef.current);

    return () => {
      cleanup && cleanup();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: '100vw', height: '100vh' }}
    />
  );
}