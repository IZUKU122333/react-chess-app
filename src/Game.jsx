import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import Confetti from "react-confetti";
import FallingBackground from "./FallingBackground";

export default function Game({ mode, onBack, players }) {
  const [game, setGame] = useState(new Chess());
  const [winner, setWinner] = useState(null);
  const [boardWidth, setBoardWidth] = useState(window.innerWidth < 500 ? window.innerWidth - 40 : 450);

  useEffect(() => {
    function handleResize() { setBoardWidth(window.innerWidth < 500 ? window.innerWidth - 40 : 450); }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (mode === "bot" && game.turn() === "b" && !winner) {
      setTimeout(() => {
        const moves = game.moves();
        if (moves.length > 0) {
          const randomMove = moves[Math.floor(Math.random() * moves.length)];
          const newGame = new Chess(game.fen());
          newGame.move(randomMove);
          setGame(newGame);
          checkGameOver(newGame);
        }
      }, 500);
    }
  }, [game, mode, winner]);

  function checkGameOver(currentGame) {
    if (currentGame.isGameOver()) {
      if (currentGame.isCheckmate()) {
        const winnerName = currentGame.turn() === "w" ? players.black : players.white;
        setWinner(`${winnerName} Wins!`);
      } else if (currentGame.isDraw()) {
        setWinner("It's a Draw!");
      } else {
        setWinner("Game Over");
      }
    }
  }

  function onDrop(sourceSquare, targetSquare) {
    if (winner) return false;
    if (mode === "bot" && game.turn() === "b") return false;
    try {
      const newGame = new Chess(game.fen());
      const move = newGame.move({ from: sourceSquare, to: targetSquare, promotion: "q" });
      if (move === null) return false;
      setGame(newGame);
      checkGameOver(newGame);
      return true;
    } catch (error) { return false; }
  }

  const getCaptured = (board) => {
    const pieces = { w: [], b: [] };
    const total = { p: 8, n: 2, b: 2, r: 2, q: 1, k: 1 };
    const current = { w: { p:0,n:0,b:0,r:0,q:0,k:0 }, b: { p:0,n:0,b:0,r:0,q:0,k:0 } };
    board.forEach(row => row.forEach(p => { if(p) current[p.color][p.type]++; }));
    ['w', 'b'].forEach(color => {
      Object.keys(total).forEach(type => {
        for(let i=0; i < total[type] - current[color][type]; i++) pieces[color].push(type);
      });
    });
    return pieces;
  };
  
  const captured = getCaptured(game.board());
  const turnColor = game.turn() === 'w' ? 'white' : 'black';
  const turnName = game.turn() === 'w' ? players.white : players.black;

  return (
    <div style={styles.container}>
      <FallingBackground />
      {winner && <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={200} />}
      
      <div style={styles.header}>
        <button onClick={onBack} style={styles.backBtn}>❮ Exit</button>
        <div style={styles.turnIndicator}>
           Turn: <span style={{color: turnColor === 'white' ? '#4ade80' : '#ff6b6b', fontWeight: 'bold'}}>{turnName}</span>
        </div>
      </div>
      
      <div style={styles.gameArea}>
        <div style={styles.boardColumn}>
          <div style={styles.playerLabelTop}><span style={styles.avatar}>👤</span> {players.black} (Black)</div>
          
          <div style={styles.boardWrapper}>
            <Chessboard 
              position={game.fen()} onPieceDrop={onDrop} boardWidth={boardWidth}
              customDarkSquareStyle={{ backgroundColor: '#779954' }}
              customLightSquareStyle={{ backgroundColor: '#e9edcc' }}
              customBoardStyle={{ borderRadius: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
            />
            {/* ELEGANT VICTORY WINDOW */}
            {winner && (
              <div style={styles.overlay}>
                <div style={styles.modal}>
                  <div style={styles.trophyIcon}>🏆</div>
                  <h2 style={styles.winnerText}>{winner}</h2>
                  <p style={{color: '#aaa', margin: '0 0 20px 0'}}>The battle is decided!</p>
                  <div style={styles.modalButtons}>
                    <button onClick={() => { setGame(new Chess()); setWinner(null); }} style={styles.restartBtn}>Play Again 🔄</button>
                    <button onClick={onBack} style={styles.quitBtn}>Home 🏠</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div style={styles.playerLabelBottom}><span style={styles.avatar}>👤</span> {players.white} (White)</div>
        </div>

        <div style={styles.infoArea}>
          <div style={styles.panel}>
            <h3 style={styles.panelTitle}>Lost Pieces</h3>
            <div style={styles.capturedRow}>
              <span style={{color: '#aaa', fontSize: '12px'}}>{players.white}:</span>
              <div style={styles.pieces}>{captured.w.map((p,i)=> <span key={i} style={styles.pieceIcon}>{p==='p'?'♟':p.toUpperCase()}</span>)}</div>
            </div>
            <div style={{height: '10px'}}></div>
            <div style={styles.capturedRow}>
              <span style={{color: '#aaa', fontSize: '12px'}}>{players.black}:</span>
              <div style={styles.pieces}>{captured.b.map((p,i)=> <span key={i} style={{...styles.pieceIcon, color: '#ff6b6b'}}>{p==='p'?'♟':p.toUpperCase()}</span>)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center',
    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    fontFamily: '"Segoe UI", sans-serif', color: 'white', padding: '10px',
    position: 'relative', overflow: 'hidden'
  },
  header: { width: '100%', maxWidth: '600px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '0 10px', zIndex: 2 },
  backBtn: { background: 'rgba(255,255,255,0.1)', border: '1px solid #475569', color: '#cbd5e1', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', cursor: 'pointer', backdropFilter: 'blur(5px)' },
  turnIndicator: { background: 'rgba(255,255,255,0.1)', padding: '8px 20px', borderRadius: '20px', fontSize: '16px', backdropFilter: 'blur(5px)', border: '1px solid rgba(255,255,255,0.1)' },
  gameArea: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%', zIndex: 2 },
  boardColumn: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' },
  boardWrapper: { position: 'relative' },
  playerLabelTop: { width: '100%', textAlign: 'left', background: 'rgba(0,0,0,0.4)', padding: '5px 15px', borderRadius: '8px', color: '#ff6b6b', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', backdropFilter: 'blur(4px)' },
  playerLabelBottom: { width: '100%', textAlign: 'left', background: 'rgba(255,255,255,0.15)', padding: '5px 15px', borderRadius: '8px', color: '#4ade80', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', backdropFilter: 'blur(4px)' },
  avatar: { fontSize: '18px' },
  infoArea: { width: '100%', maxWidth: '450px', display: 'flex', justifyContent: 'center' },
  panel: { width: '100%', background: 'rgba(30, 41, 59, 0.6)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' },
  panelTitle: { margin: '0 0 10px 0', fontSize: '14px', color: '#94a3b8', textTransform: 'uppercase' },
  capturedRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  pieces: { display: 'flex', flexWrap: 'wrap', gap: '2px', fontSize: '18px' },
  pieceIcon: { color: '#e2e8f0' },
  
  // ELEGANT WIN WINDOW STYLES
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
    display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '8px', zIndex: 10,
    animation: 'fadeIn 0.5s ease'
  },
  modal: {
    background: 'rgba(20, 20, 30, 0.95)', padding: '40px', borderRadius: '24px', textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
    maxWidth: '85%', width: '300px',
    animation: 'popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
  },
  trophyIcon: { fontSize: '50px', marginBottom: '10px', filter: 'drop-shadow(0 0 15px gold)' },
  winnerText: { 
    fontSize: '28px', margin: '0 0 10px 0', 
    background: 'linear-gradient(45deg, #FFD700, #FDB931)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    fontWeight: '800', letterSpacing: '1px'
  },
  modalButtons: { display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '20px' },
  restartBtn: {
    padding: '12px 24px', background: 'linear-gradient(45deg, #22c55e, #16a34a)', color: 'white', border: 'none', 
    borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px',
    boxShadow: '0 4px 15px rgba(34, 197, 94, 0.4)', transition: 'transform 0.2s'
  },
  quitBtn: {
    padding: '12px 24px', background: 'transparent', border: '2px solid #475569', color: '#cbd5e1', 
    borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px',
    transition: 'background 0.2s'
  }
};

// Add keyframes to global styles for the modal pop-in
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes popIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
`;
document.head.appendChild(styleSheet);
