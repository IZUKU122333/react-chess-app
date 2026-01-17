import { useState } from 'react';
import Game from './Game';

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

  if (view === 'bot') {
    return <Game mode="bot" players={{ white: 'You', black: 'Bot' }} onBack={() => setView('home')} />;
  }

  if (view === 'friend') {
    return <Game mode="friend" players={players} onBack={() => setView('home')} />;
  }

  if (view === 'setup') {
    return (
      <div style={styles.menuContainer}>
        <div style={styles.card}>
          <h2 style={styles.subtitle}>Enter Player Names</h2>
          <form onSubmit={startFriendGame} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input name="white" placeholder="White Player Name" style={styles.input} maxLength="10" />
            <input name="black" placeholder="Black Player Name" style={styles.input} maxLength="10" />
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="button" onClick={() => setView('home')} style={styles.backBtn}>Back</button>
              <button type="submit" style={styles.startBtn}>Start Game ⚔️</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.menuContainer}>
      <div style={styles.card}>
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
      </div>
    </div>
  );
}

const styles = {
  menuContainer: {
    height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    fontFamily: '"Segoe UI", sans-serif', color: 'white', padding: '20px'
  },
  card: {
    background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)',
    padding: '40px', borderRadius: '20px', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.18)', maxWidth: '400px', width: '100%'
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

export default App;
