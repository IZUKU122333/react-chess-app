import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

export default function Game({ mode, onBack }) {
  const [game, setGame] = useState(new Chess());
  const [winner, setWinner] = useState(null);

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
        setWinner(currentGame.turn() === "w" ? "Black Wins! 🏁" : "White Wins! 🏆");
      } else if (currentGame.isDraw()) {
        setWinner("It's a Draw! 🤝");
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
      const move = newGame.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });
      if (move === null) return false;
      setGame(newGame);
      checkGameOver(newGame);
      return true;
    } catch (error) {
      return false;
    }
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

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={onBack} style={styles.backBtn}>❮ Exit</button>
        <span style={styles.modeBadge}>{mode === 'bot' ? '🤖 Bot Match' : '⚔️ PvP Mode'}</span>
      </div>
      
      <div style={styles.gameArea}>
        {/* Left Panel */}
        <div style={styles.panel}>
          <h3 style={styles.panelTitle}>Captured</h3>
          <div style={styles.capturedBox}>
            <div style={styles.capturedRow}>
              <span style={{color: '#aaa', fontSize: '14px'}}>White Lost</span>
              <div style={styles.pieces}>{captured.w.map((p,i)=> <span key={i} style={styles.pieceIcon}>{p==='p'?'♟':p.toUpperCase()}</span>)}</div>
            </div>
            <div style={styles.divider}></div>
            <div style={styles.capturedRow}>
              <span style={{color: '#aaa', fontSize: '14px'}}>Black Lost</span>
              <div style={styles.pieces}>{captured.b.map((p,i)=> <span key={i} style={{...styles.pieceIcon, color: '#ff6b6b'}}>{p==='p'?'♟':p.toUpperCase()}</span>)}</div>
            </div>
          </div>
        </div>

        {/* Board */}
        <div style={styles.boardWrapper}>
          <Chessboard 
            position={game.fen()} 
            onPieceDrop={onDrop} 
            boardWidth={450}
            customDarkSquareStyle={{ backgroundColor: '#779954' }}
            customLightSquareStyle={{ backgroundColor: '#e9edcc' }}
            customBoardStyle={{
              borderRadius: '8px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            }}
          />
          {winner && (
            <div style={styles.overlay}>
              <div style={styles.modal}>
                <h2 style={styles.winnerText}>{winner}</h2>
                <div style={styles.modalButtons}>
                  <button onClick={() => { setGame(new Chess()); setWinner(null); }} style={styles.restartBtn}>New Game</button>
                  <button onClick={onBack} style={styles.quitBtn}>Quit</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div style={styles.panel}>
          <h3 style={styles.panelTitle}>History</h3>
          <div style={styles.historyList}>
            {game.history().map((move, i) => (
              <div key={i} style={i % 2 === 0 ? styles.moveRowEven : styles.moveRowOdd}>
                <span style={{color: '#888', marginRight: '10px'}}>{Math.floor(i/2) + 1}.</span>
                {move}
              </div>
            ))}
            <div ref={el => el?.scrollIntoView()} />
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    fontFamily: '"Segoe UI", sans-serif', color: 'white', padding: '20px'
  },
  header: {
    width: '100%', maxWidth: '900px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'
  },
  backBtn: {
    background: 'transparent', border: '1px solid #475569', color: '#cbd5e1', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer',
    transition: 'all 0.2s', fontSize: '14px'
  },
  modeBadge: {
    background: '#3b82f6', padding: '5px 12px', borderRadius: '15px', fontSize: '13px', fontWeight: 'bold', boxShadow: '0 0 10px rgba(59, 130, 246, 0.4)'
  },
  gameArea: {
    display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start'
  },
  panel: {
    width: '220px', background: 'rgba(30, 41, 59, 0.7)', padding: '15px', borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  panelTitle: { margin: '0 0 15px 0', fontSize: '16px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' },
  capturedBox: { display: 'flex', flexDirection: 'column', gap: '10px' },
  capturedRow: { display: 'flex', flexDirection: 'column', gap: '5px' },
  pieces: { display: 'flex', flexWrap: 'wrap', gap: '2px', fontSize: '20px', minHeight: '25px' },
  pieceIcon: { color: '#e2e8f0' },
  divider: { height: '1px', background: 'rgba(255,255,255,0.1)', margin: '5px 0' },
  boardWrapper: { position: 'relative' },
  historyList: { height: '350px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px', paddingRight: '5px' },
  moveRowEven: { padding: '4px 8px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', fontSize: '14px' },
  moveRowOdd: { padding: '4px 8px', fontSize: '14px' },
  
  // Winning Modal
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
    display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '8px', zIndex: 10
  },
  modal: {
    background: 'linear-gradient(135deg, #1e293b, #0f172a)',
    padding: '30px', borderRadius: '16px', textAlign: 'center',
    border: '1px solid rgba(255,255,255,0.1)',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px rgba(59, 130, 246, 0.3)'
  },
  winnerText: { fontSize: '24px', margin: '0 0 20px 0', background: 'linear-gradient(to right, #4ade80, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  modalButtons: { display: 'flex', gap: '10px', justifyContent: 'center' },
  restartBtn: {
    padding: '10px 20px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold',
    boxShadow: '0 0 15px rgba(34, 197, 94, 0.4)'
  },
  quitBtn: {
    padding: '10px 20px', background: 'transparent', border: '1px solid #475569', color: '#94a3b8', borderRadius: '6px', cursor: 'pointer'
  }
};
