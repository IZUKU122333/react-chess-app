export const getInitialBoard = () => {
  const board = Array(8).fill(null).map(() => Array(8).fill(null));

  const createPiece = (type, color) => ({ type, color });

  // Black pieces (Top of board, Row 0 & 1)
  const blackMain = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
  blackMain.forEach((type, col) => {
    board[0][col] = createPiece(type, 'black');
  });
  for (let col = 0; col < 8; col++) {
    board[1][col] = createPiece('pawn', 'black');
  }

  // White pieces (Bottom of board, Row 6 & 7)
  const whiteMain = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
  whiteMain.forEach((type, col) => {
    board[7][col] = createPiece(type, 'white');
  });
  for (let col = 0; col < 8; col++) {
    board[6][col] = createPiece('pawn', 'white');
  }

  return board;
};