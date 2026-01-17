import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import Confetti from "react-confetti";

export default function Game({ mode, onBack, players }) {
  const [game, setGame] = useState(new Chess());
  const [winner, setWinner] = useState(null);
  const [boardWidth, setBoardWidth] = useState(window.innerWidth < 500 ? window.innerWidth - 40 : 450);

  // Handle Resize for Mobile
  useEffect(() => {
    function handleResize() {
      setBoardWidth(window.innerWidth < 500 ? window.innerWidth - 40 : 450);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Bot Logic
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
        setWinner(`${winnerName} Wins! 🎉`);
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

  // Get Captured Pieces
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
      {winner && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      
      <div style={styles.header}>
        <button onClick={onBack} style={styles.backBtn}>❮ Exit</button>
        <div style={styles.turnIndicator}>
           Turn: <span style={{color: turnColor === 'white' ? '#4ade80' : '#ff6b6b', fontWeight: 'bold'}}>{turnName}</span>
        </div>
      </div>
      
      <div style={styles.gameArea}>
        {/* Board Section */}
        <div style={styles.boardWrapper}>
          <Chessboard 
            position={game.fen()} 
            onPieceDrop={onDrop} 
            boardWidth={boardWidth}
            customDarkSquareStyle={{ backgroundColor: '#779954' }}
            customLightSquareStyle={{ backgroundColor: '#e9edcc' }}
            customBoardStyle={{ borderRadius: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
          />
          {winner && (
            <div style={styles.overlay}>
              <div style={styles.modal}>
                <h2 style={styles.winnerText}>{winner}</h2>
                <button onClick={() => { setGame(new Chess()); setWinner(null); }} style={styles.restartBtn}>Rematch</button>
              </div>
            </div>
          )}
        </div>

        {/* Info Panels (Stack below on mobile) */}
        <div style={styles.infoArea}>
          <div style={styles.panel}>
            <h3 style={styles.panelTitle}>Lost Pieces</h3>
            <div style={styles.capturedRow}>
              <span style={{color: '#aaa', fontSize: '12px'}}>{players.white} Lost:</span>
              <div style={styles.pieces}>{captured.w.map((p,i)=> <span key={i} style={styles.pieceIcon}>{p==='p'?'♟':p.toUpperCase()}</span>)}</div>
            </div>
            <div style={{height: '10px'}}></div>
            <div style={styles.capturedRow}>
              <span style={{color: '#aaa', fontSize: '12px'}}>{players.black} Lost:</span>
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
    fontFamily: '"Segoe UI", sans-serif', color: 'white', padding: '10px'
  },
  header: {
    width: '100%', maxWidth: '600px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '0 10px'
  },
  backBtn: {
    background: 'transparent', border: '1px solid #475569', color: '#cbd5e1', padding: '8px 16px', borderRadius: '6px', fontSize: '14px'
  },
  turnIndicator: {
    background: 'rgba(255,255,255,0.1)', padding: '8px 20px', borderRadius: '20px', fontSize: '16px', backdropFilter: 'blur(5px)'
  },
  gameArea: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%'
  },
  boardWrapper: { position: 'relative' },
  infoArea: { width: '100%', maxWidth: '450px', display: 'flex', justifyContent: 'center' },
  panel: {
    width: '100%', background: 'rgba(30, 41, 59, 0.7)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)'
  },
  panelTitle: { margin: '0 0 10px 0', fontSize: '14px', color: '#94a3b8', textTransform: 'uppercase' },
  capturedRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  pieces: { display: 'flex', flexWrap: 'wrap', gap: '2px', fontSize: '18px' },
  pieceIcon: { color: '#e2e8f0' },
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
    display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '8px', zIndex: 10
  },
  modal: {
    background: '#1e293b', padding: '30px', borderRadius: '16px', textAlign: 'center', border: '1px solid #3b82f6', boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)'
  },
  winnerText: { fontSize: '24px', margin: '0 0 20px 0', color: '#fff' },
  restartBtn: {
    padding: '10px 20px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold'
  }
};
