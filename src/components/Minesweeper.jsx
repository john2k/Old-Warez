import React, { useState, useEffect } from 'react';

export default function Minesweeper() {
  const size = 9;
  const mineCount = 10;
  const [grid, setGrid] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [minesLeft, setMinesLeft] = useState(mineCount);

  // Initialize board
  const initBoard = () => {
    // Empty board
    let newGrid = Array(size).fill(null).map(() => 
      Array(size).fill(null).map(() => ({
        isMine: false,
        neighborMines: 0,
        revealed: false,
        flagged: false
      }))
    );

    // Place mines
    let placed = 0;
    while (placed < mineCount) {
      const r = Math.floor(Math.random() * size);
      const c = Math.floor(Math.random() * size);
      if (!newGrid[r][c].isMine) {
        newGrid[r][c].isMine = true;
        placed++;
      }
    }

    // Calculate neighbors
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (newGrid[r][c].isMine) continue;
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
              if (newGrid[nr][nc].isMine) count++;
            }
          }
        }
        newGrid[r][c].neighborMines = count;
      }
    }

    setGrid(newGrid);
    setGameOver(false);
    setWon(false);
    setMinesLeft(mineCount);
  };

  useEffect(() => {
    initBoard();
  }, []);

  const revealCell = (r, c) => {
    if (gameOver || won || grid[r][c].revealed || grid[r][c].flagged) return;
    localStorage.setItem('minesweeper_played', 'true');

    const next = [...grid.map(row => [...row])];
    
    if (next[r][c].isMine) {
      // Game Over, reveal all mines
      next.forEach(row => row.forEach(cell => {
        if (cell.isMine) cell.revealed = true;
      }));
      setGrid(next);
      setGameOver(true);
      return;
    }

    // Flood fill algorithm
    const floodFill = (row, col) => {
      if (row < 0 || row >= size || col < 0 || col >= size || next[row][col].revealed || next[row][col].flagged) return;
      
      next[row][col].revealed = true;
      
      if (next[row][col].neighborMines === 0 && !next[row][col].isMine) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            floodFill(row + dr, col + dc);
          }
        }
      }
    };

    floodFill(r, c);

    // Check Win
    let unrevealedSafe = 0;
    next.forEach(row => row.forEach(cell => {
      if (!cell.isMine && !cell.revealed) unrevealedSafe++;
    }));

    setGrid(next);
    if (unrevealedSafe === 0) {
      setWon(true);
    }
  };

  const toggleFlag = (e, r, c) => {
    e.preventDefault();
    if (gameOver || won || grid[r][c].revealed) return;

    const next = [...grid.map(row => [...row])];
    const flagged = !next[r][c].flagged;
    next[r][c].flagged = flagged;
    setGrid(next);
    setMinesLeft(prev => prev + (flagged ? -1 : 1));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'var(--win-gray)', padding: '6px', fontSize: '11px', fontFamily: 'monospace', color: '#000', height: '100%' }}>
      {/* Control panel header */}
      <div className="win-inset" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '6px 12px', background: '#ccc', marginBottom: '8px', border: '2px inset #fff', fontWeight: 'bold' }}>
        <span>💣 {minesLeft.toString().padStart(3, '0')}</span>
        <button className="win-btn" onClick={initBoard} style={{ padding: '0 8px', fontSize: '14px', lineHeight: '1.2' }}>
          {gameOver ? '😵' : won ? '😎' : '🙂'}
        </button>
        <span>⏱️ 000</span>
      </div>

      {/* Grid container */}
      <div className="win-inset" style={{ background: '#808080', border: '3px inset #fff', padding: '2px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${size}, 20px)`, gap: '1px' }}>
          {grid.map((row, r) => 
            row.map((cell, c) => {
              let content = '';
              let bg = 'var(--win-gray)';
              let borderStyle = '3px outset #fff';

              if (cell.revealed) {
                borderStyle = '1px solid #999';
                bg = '#ccc';
                if (cell.isMine) {
                  content = '💣';
                  bg = '#ff3333';
                } else if (cell.neighborMines > 0) {
                  content = cell.neighborMines;
                }
              } else if (cell.flagged) {
                content = '🚩';
              }

              // Color mapping for numbers
              const numColors = ['transparent', 'blue', 'green', 'red', 'purple', 'maroon', 'turquoise', 'black', 'gray'];
              const cellColor = cell.revealed && !cell.isMine ? numColors[cell.neighborMines] : '#000';

              return (
                <div 
                  key={`${r}-${c}`}
                  onClick={() => revealCell(r, c)}
                  onContextMenu={(e) => toggleFlag(e, r, c)}
                  style={{
                    width: '20px',
                    height: '20px',
                    background: bg,
                    border: borderStyle,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '11px',
                    color: cellColor,
                    cursor: 'default',
                    userSelect: 'none'
                  }}
                >
                  {content}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
