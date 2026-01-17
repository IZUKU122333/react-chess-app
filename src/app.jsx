import React from 'react'
import ChessBoard from './components/ChessBoard'
import './App.css'

function App() {
  return (
    <div className="app-container">
      <h1>React Chess</h1>
      <div className="game-board">
        <ChessBoard />
      </div>
      <p className="instructions">Click a piece to select, then click a valid square to move.</p>
    </div>
  )
}


export default App
Trigger deployment
