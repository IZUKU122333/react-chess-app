import { useState } from 'react';
import Game from './Game';

function App() {
  const [view, setView] = useState('home'); // 'home', 'bot', or 'friend'

  if (view === 'bot') {
    return <Game mode="bot" onBack={() => setView('home')} />;
  }

  if (view === 'friend') {
    return <Game mode="friend" onBack={() => setView('home')} />;
  }

  return (
    <div style={styles.menuContainer}>
      <h1 style={styles.title}>♟️ React Chess</h1>
      <div style={styles.btnGroup}>
        <button style={styles.menuBtn} onClick={() => setView('bot')}>
          🤖 Play vs Bot
        </button>
        <button style={styles.menuBtn} onClick={() => setView('friend')}>
          👥 Play vs Friend
        </button>
      </div>
      <p style={{marginTop: '20px', color: '#666'}}>Select a mode to start</p>
    </div>
  );
}

const styles = {
  menuContainer: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    height: '100vh', fontFamily: 'Arial, sans-serif', background: '#e9ecef'
  },
  title: { fontSize: '3rem', color: '#2c3e50', marginBottom: '40px' },
  btnGroup: { display: 'flex', gap: '20px' },
  menuBtn: {
    padding: '20px 40px', fontSize: '1.5rem', cursor: 'pointer',
    background: '#3498db', color: 'white', border: 'none', borderRadius: '10px',
    transition: 'transform 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  }
};

export default App;
