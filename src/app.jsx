import { useState, useMemo } from 'react';
import Game from './Game';

// =============================
// MAIN APP COMPONENT
// =============================
function App() {
  const [view, setView] = useState('home'); // home, setup, bot, friend
  const [players, setPlayers] = useState({ white: 'Player 1', black: 'Player 2' });

  const startFriendGame = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setPlayers({
      white: formData.get('white') || 'White',
      black: formData.get('black') || 'Black'
    });
    setView('friend');
  };

  // Views
  if (view === 'bot') {
    return <Game mode="bot" players={{ white: 'You', black: 'Bot' }} onBack={() => setView('home')} />;
  }

  if (view === 'friend') {
    return <Game mode="friend" players={players} onBack={() => setView('home')} />;
  }

  // Home & Setup Screens
  return (
    <div style={styles.menuContainer}>
      {/* Add the Falling Animation Background */}
      <FallingBackground />
      
      <div style={view === 'home' ? styles.card : styles.cardSetup}>
        {view === 'home' ? (
          <>
            <h1 style={styles.title}>👑 Royal Chess</h1>
            <p style={styles.subtitle}>Master the Board</p>
            <div style={styles.btnGroup}>
              <button style={styles.menuBtn} onClick={() => setView('bot')}>
                🤖 VS Computer
              </button>
              <button 
                style={{...styles.menuBtn, background: 'linear-gradient(45deg, #FF512F, #DD2476)'}} 
                onClick={() => setView('setup')}
              >
                ⚔️ VS Friend
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 style={styles.subtitle}>Enter Player Names</h2>
            <form onSubmit={startFriendGame} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input name="white" placeholder="White Player Name" style={styles.input} maxLength="10" />
              <input name="black" placeholder="Black Player Name" style={styles.input} maxLength="10" />
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setView('home')} style={styles.backBtn}>Back</button>
                <button type="submit" style={styles.startBtn}>Start Game ⚔️</button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// =============================
// STYLES
// =============================
const styles = {
  menuContainer: {
    minHeight: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    fontFamily: '"Segoe UI", sans-serif', color: 'white', padding: '20px', boxSizing: 'border-box', margin: 0,
    position: 'relative', overflow: 'hidden' // Ensure animation stays within bounds
  },
  card: {
    background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)',
    padding: '40px', borderRadius: '20px', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.18)', maxWidth: '400px', width: '100%',
    zIndex: 2 // Sit on top of animation
  },
  cardSetup: {
    background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)',
    padding: '40px', borderRadius: '20px', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.18)', maxWidth: '400px', width: '100%',
    zIndex: 2
  },
  title: {
    fontSize: '3rem', margin: '0 0 10px 0',
    background: 'linear-gradient(to right, #fff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: '800'
  },
  subtitle: { fontSize: '1.2rem', color: '#a5b4fc', marginBottom: '30px', letterSpacing: '2px', textTransform: 'uppercase' },
  btnGroup: { display: 'flex', flexDirection: 'column', gap: '20px' },
  menuBtn: {
    padding: '15px', fontSize: '1.2rem', cursor: 'pointer',
    background: 'linear-gradient(45deg, #4776E6, #8E54E9)', color: 'white', border: 'none', borderRadius: '50px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)', fontWeight: 'bold', width: '100%'
  },
  input: {
    padding: '12px', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '16px', outline: 'none'
  },
  startBtn: {
    flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#2ecc71', color: 'white', fontWeight: 'bold', cursor: 'pointer'
  },
  backBtn: {
    padding: '12px 20px', borderRadius: '8px', border: '1px solid #aaa', background: 'transparent', color: '#aaa', cursor: 'pointer'
  }
};


// =============================
// FALLING BACKGROUND ANIMATION
// =============================
const PIECE_PATHS = [
  "M9 26c0 2-1.5 3-4 3S1 28 1 26s1.5-3 4-3 4 1 4 3zm0 0", // Pawn
  "M16 23c0 4-4 7-8 7S0 27 0 23s4-7 8-7 8 3 8 7zm0 0", // Rookish
  "M12.5 25c0 3-2.5 5-6.5 5S-.5 28-.5 25s2.5-5 6.5-5 6.5 2 6.5 5zm0 0", // Knightish
  "M12 27c0 3-2.5 5-6 5s-6-2-6-5 2.5-5 6-5 6 2 6 5zm0 0", // Bishopish
  "M22 26c0 4-4.5 7-11 7S0 30 0 26s4.5-7 11-7 11 3 11 7zm0 0", // Queenish
];
const NEON_COLORS = ['#ff00ff', '#00ffff', '#ffdd00', '#00ff00', '#ff3333', '#9900ff'];

function FallingBackground() {
  // Generate pieces only once on mount
  const pieces = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      path: PIECE_PATHS[Math.floor(Math.random() * PIECE_PATHS.length)],
      color: NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)],
      left: Math.random() * 100 + 'vw',
      duration: Math.random() * 20 + 15 + 's', // Slow: 15s to 35s duration
      delay: Math.random() * -30 + 's', // Negative delay to start immediately at different points
      size: Math.random() * 30 + 20 + 'px',
    }));
  }, []);

  return (
    <>
      {/* Inject CSS Keyframes */}
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
      <div style={animStyles.container}>
        {pieces.map((p) => (
          <div
            key={p.id}
            style={{
              ...animStyles.piece,
              left: p.left,
              color: p.color,
              width: p.size,
              height: p.size,
              animationDuration: p.duration,
              animationDelay: p.delay,
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

const animStyles = {
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    zIndex: 1, // Sit behind the main card
    pointerEvents: 'none' // Ensure clicks go through to the app
  },
  piece: {
    position: 'absolute',
    top: '-10%',
    opacity: 0,
    animationName: 'fall',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
    filter: 'drop-shadow(0 0 5px currentColor)' // Neon glow effect
  }
};
// =============================
// END FALLING BACKGROUND
// =============================

export default App;
