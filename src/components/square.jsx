import React from 'react';

const Square = ({ row, col, piece, isSelected, onClick }) => {
  const isWhiteSquare = (row + col) % 2 === 0;
  const squareColorClass = isWhiteSquare ? 'white' : 'black';

  const getPieceSymbol = (p) => {
    if (!p) return null;
    
    // Standard Unicode Chess Pieces
    const symbols = {
      white: {
        pawn: '♙',
        rook: '♖',
        knight: '♘',
        bishop: '♗',
        queen: '♕',
        king: '♔'
      },
      black: {
        pawn: '♟',
        rook: '♜',
        knight: '♞',
        bishop: '♝',
        queen: '♛',
        king: '♚'
      }
    };

    return symbols[p.color][p.type];
  };

  return (
    <div 
      className={`square ${squareColorClass} ${isSelected ? 'selected' : ''}`} 
      onClick={onClick}
    >
      {getPieceSymbol(piece)}
    </div>
  );
};

export default Square;
