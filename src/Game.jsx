import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

export default function Game({ mode, onBack }) {
  const [game, setGame] = useState(new Chess());
  const [winner, setWinner] = useState(null);

  // Bot Logic (Simple Random Mover)
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
      }, 500); // Bot thinks for 0.5 seconds
    }
  }, [game, mode, winner]);

  function checkGameOver(currentGame) {
    if (currentGame.isGameOver()) {
      if (currentGame.isCheckmate()) {
        setWinner(currentGame.turn() === "w" ? "Black Wins!" : "White Wins!");
      } else if (currentGame.isDraw()) {
        setWinner("Draw!");
      } else {
        setWinner("Game Over");
      }
    }
  }

  function onDrop(sourceSquare, targetSquare) {
    if (winner) return false;
    // Prevent moving for Bot (Black)
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

  // Calculate Captured Pieces
  const getCaptured = (board) => {
    const pieces = { w: [], b: [] };
    // Standard count
    const total = { p: 8, n: 2, b: 2, r: 2, q: 1, k: 1 };
    
    // Count current pieces
    const current = { w: { p:0, n:0, b:0, r:0, q:0, k:0 }, b: { p:0, n:0, b:0, r:0, q:0, k:0 } };
    board.forEach(row => row.forEach(p => { if(p) current[p.color][p.type]++; }));

    // Diff
    ['w', 'b'].forEach(color => {
      Object.keys(total).forEach(type => {
        const lost = total[type] - current[color][type];
        for(let i=0; i<lost; i++) pieces[color].push(type);
      });
    });
    return pieces;
  };
  
  const captured = getCaptured(game.board());

  return (
    <div style={styles.container}>
      <button onClick={onBack} style={styles.backBtn}>← Home</button>
      
      <div style={styles.gameArea}>
        {/* Left Side: Info */}
        <div style={styles.panel}>
          <h3>Mode: {mode === 'bot' ? 'vs Bot' : 'vs Friend'}</h3>
          <div style={styles.captured}>
            <h4>White Lost:</h4>
            {captured.w.map((p, i) => <span key={i}>{p === 'p' ? '♟' : p.toUpperCase()} </span>)}
          </div>
          <div style={styles.captured}>
            <h4>Black Lost:</h4>
            {captured.b.map((p, i) => <span key={i}>{p === 'p' ? '♟' : p.toUpperCase()} </span>)}
          </div>
        </div>

        {/* Center: Board */}
        <div style={styles.boardWrapper}>
          <Chessboard position={game.fen()} onPieceDrop={onDrop} boardWidth={400} />
          {winner && (
            <div style={styles.modal}>
              <h2>{winner}</h2>
              <button onClick={() => { setGame(new Chess()); setWinner(null); }} style={styles.btn}>
                Rematch
              </button>
            </div>
          )}
        </div>

        {/* Right Side: History */}
        <div style={styles.panel}>
          <h3>History</h3>
          <div style={styles.historyList}>
            {game.history().map((move, i) => (
              <div key={i}>{i+1}. {move}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'Arial, sans-serif' },
  backBtn: { alignSelf: 'flex-start', margin: '10px', padding: '10px', cursor: 'pointer' },
  gameArea: { display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' },
  panel: { width: '200px', padding: '10px', background: '#f0f0f0', borderRadius: '8px', height: '400px', overflowY: 'auto' },
  boardWrapper: { position: 'relative', border: '5px solid #333' },
  historyList: { maxHeight: '300px', overflowY: 'auto', textAlign: 'left', paddingLeft: '10px' },
  captured: { marginBottom: '10px', fontSize: '20px' },
  modal: {
    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
    background: 'rgba(0,0,0,0.85)', color: 'white', padding: '20px', borderRadius: '10px', textAlign: 'center', zIndex: 10
  },
  btn: { padding: '10px 20px', fontSize: '16px', cursor: 'pointer', marginTop: '10px' }
};
