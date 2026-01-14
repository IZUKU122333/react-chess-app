import React, { useState } from 'react';
import Square from './Square';
import { getInitialBoard } from '../utils/initialBoard';

const ChessBoard = () => {
  const [board, setBoard] = useState(getInitialBoard());
  const [selected, setSelected] = useState(null); // {row, col}
  const [turn, setTurn] = useState('white'); // 'white' or 'black'

  const handleSquareClick = (row, col) => {
    const clickedPiece = board[row][col];

    // Logic 1: Selecting a piece
    if (!selected) {
      if (!clickedPiece) return; // Cannot select empty square
      if (clickedPiece.color !== turn) return; // Cannot move opponent's piece
      
      setSelected({ row, col });
      return;
    }

    // Logic 2: Moving a piece
    // If clicked the exact same square, deselect
    if (selected.row === row && selected.col === col) {
      setSelected(null);
      return;
    }

    // If clicked another friendly piece, switch selection
    if (clickedPiece && clickedPiece.color === turn) {
      setSelected({ row, col });
      return;
    }

    // Execute Move (Basic logic: allows capturing enemies or moving to empty spots)
    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = newBoard[selected.row][selected.col]; // Place piece
    newBoard[selected.row][selected.col] = null; // Remove from old spot

    setBoard(newBoard);
    setTurn(turn === 'white' ? 'black' : 'white');
    setSelected(null);
  };

  return (
    <div>
      <div className="turn-indicator">
        Current Turn: {turn.charAt(0).toUpperCase() + turn.slice(1)}
      </div>
      <div className="chess-board">
        {board.map((row, rowIndex) => (
          row.map((piece, colIndex) => (
            <Square
              key={`${rowIndex}-${colIndex}`}
              row={rowIndex}
              col={colIndex}
              piece={piece}
              isSelected={selected && selected.row === rowIndex && selected.col === colIndex}
              onClick={() => handleSquareClick(rowIndex, colIndex)}
            />
          ))
        ))}
      </div>
    </div>
  );
};

export default ChessBoard;