import { useMemo } from 'react';

const PIECE_PATHS = [
  "M9 26c0 2-1.5 3-4 3S1 28 1 26s1.5-3 4-3 4 1 4 3zm0 0", 
  "M16 23c0 4-4 7-8 7S0 27 0 23s4-7 8-7 8 3 8 7zm0 0", 
  "M12.5 25c0 3-2.5 5-6.5 5S-.5 28-.5 25s2.5-5 6.5-5 6.5 2 6.5 5zm0 0", 
  "M12 27c0 3-2.5 5-6 5s-6-2-6-5 2.5-5 6-5 6 2 6 5zm0 0", 
  "M22 26c0 4-4.5 7-11 7S0 30 0 26s4.5-7 11-7 11 3 11 7zm0 0", 
];
const NEON_COLORS = ['#ff00ff', '#00ffff', '#ffdd00', '#00ff00', '#ff3333', '#9900ff'];

export default function FallingBackground() {
  const pieces = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      path: PIECE_PATHS[Math.floor(Math.random() * PIECE_PATHS.length)],
      color: NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)],
      left: Math.random() * 100 + 'vw',
      duration: Math.random() * 20 + 15 + 's', 
      delay: Math.random() * -30 + 's',
      size: Math.random() * 30 + 20 + 'px',
    }));
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes fall {
            0% { transform: translateY(-10vh) rotate(0deg); opacity: 0; }
            20% { opacity: 0.6; }
            80% { opacity: 0.6; }
            100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
          }
        `}
      </style>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
        {pieces.map((p) => (
          <div
            key={p.id}
            style={{
              position: 'absolute', top: '-10%', opacity: 0,
              animationName: 'fall', animationTimingFunction: 'linear', animationIterationCount: 'infinite',
              filter: 'drop-shadow(0 0 5px currentColor)',
              left: p.left, color: p.color, width: p.size, height: p.size,
              animationDuration: p.duration, animationDelay: p.delay,
            }}
          >
            <svg viewBox="0 0 30 35" fill="currentColor" width="100%" height="100%">
               <path d={p.path} />
            </svg>
          </div>
        ))}
      </div>
    </>
  );
}
