import { useState } from 'react';
import Game from './Game';

function App() {
  const [view, setView] = useState('home');

  if (view === 'bot') return <Game mode="bot" onBack={() => setView('home')} />;
  if (view === 'friend') return <Game mode="friend" onBack={() => setView('home')} />;

  return (
    <div style={styles.menuContainer}>
      <div style={styles.card}>
        <h1 style={styles.title}>👑 Royal Chess</h1>
        <p style={styles.subtitle}>Master the Board</p>
        
        <div style={styles.btnGroup}>
          <button 
            style={styles.menuBtn} 
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            onClick={() => setView('bot')}
          >
            🤖 VS Computer
          </button>
          
          <button 
            style={{...styles.menuBtn, background: 'linear-gradient(45deg, #FF512F, #DD2476)'}} 
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            onClick={() => setView('friend')}
          >
            ⚔️ VS Friend
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  menuContainer: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    color: 'white',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    padding: '60px',
    borderRadius: '20px',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.18)',
  },
  title: {
    fontSize: '4rem',
    margin: '0 0 10px 0',
    background: 'linear-gradient(to right, #fff, #a5b4fc)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: '800',
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#a5b4fc',
    marginBottom: '40px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
  },
  btnGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  menuBtn: {
    padding: '18px 40px',
    fontSize: '1.2rem',
    cursor: 'pointer',
    background: 'linear-gradient(45deg, #4776E6, #8E54E9)',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
    fontWeight: 'bold',
    width: '300px',
  }
};

export default App;
