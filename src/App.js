import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import './App.css';

const SIZE = 4; // 4x4 grid

const colors = {
  2: '#EEE4DA',
  4: '#EDE0C8',
  8: '#F2B179',
  16: '#F59563',
  32: '#F67C5F',
  64: '#F65E3B',
  128: '#EDCF72',
  256: '#EDCC61',
  512: '#EDC850',
  1024: '#EDC53F',
  2048: '#EDC22E',
};

const App = () => {
  const [grid, setGrid] = useState(generateGrid());
  const [score, setScore] = useState(0);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowUp') handleMove('up');
      if (e.key === 'ArrowDown') handleMove('down');
      if (e.key === 'ArrowLeft') handleMove('left');
      if (e.key === 'ArrowRight') handleMove('right');
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [grid]);

  function generateGrid() {
    const initialGrid = Array(SIZE)
      .fill(null)
      .map(() => Array(SIZE).fill(null));
    addRandomTile(initialGrid);
    addRandomTile(initialGrid);
    return initialGrid;
  }

  function addRandomTile(grid) {
    const emptyCells = [];
    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        if (!grid[row][col]) emptyCells.push([row, col]);
      }
    }
    if (emptyCells.length > 0) {
      const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      grid[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  function handleMove(direction) {
    const newGrid = grid.map((row) => row.slice());
    let moved = false;

    const mergeRow = (row) => {
      const newRow = row.filter((num) => num !== null);
      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          setScore((prevScore) => prevScore + newRow[i]);
          newRow[i + 1] = null;
        }
      }
      return newRow.filter((num) => num !== null);
    };

    const moveRowLeft = (row) => {
      const mergedRow = mergeRow(row);
      return [...mergedRow, ...Array(SIZE - mergedRow.length).fill(null)];
    };

    const moveGrid = (grid) => {
      const newGrid = Array(SIZE)
        .fill(null)
        .map(() => Array(SIZE).fill(null));
      if (direction === 'left') {
        for (let row = 0; row < SIZE; row++) {
          newGrid[row] = moveRowLeft(grid[row]);
        }
      } else if (direction === 'right') {
        for (let row = 0; row < SIZE; row++) {
          newGrid[row] = moveRowLeft(grid[row].reverse()).reverse();
        }
      } else if (direction === 'up') {
        for (let col = 0; col < SIZE; col++) {
          const colArray = moveRowLeft(grid.map((row) => row[col]));
          for (let row = 0; row < SIZE; row++) newGrid[row][col] = colArray[row];
        }
      } else if (direction === 'down') {
        for (let col = 0; col < SIZE; col++) {
          const colArray = moveRowLeft(grid.map((row) => row[col]).reverse()).reverse();
          for (let row = 0; row < SIZE; row++) newGrid[row][col] = colArray[row];
        }
      }
      return newGrid;
    };

    const movedGrid = moveGrid(newGrid);
    if (JSON.stringify(movedGrid) !== JSON.stringify(grid)) {
      addRandomTile(movedGrid);
      setGrid(movedGrid);
      moved = true;
    }
  }

  function resetGame() {
    setGrid(generateGrid());
    setScore(0);
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #9FA8DA, #283593)', color: '#fff', padding: 2 }}>
      <Box sx={{ textAlign: 'center', maxWidth: 400 }}>
        <Typography variant="h4" gutterBottom>2048 Game</Typography>
        <Typography variant="h6" gutterBottom>Score: {score}</Typography>
        <Box sx={{ display: 'grid', gap: 1, gridTemplateColumns: `repeat(${SIZE}, 1fr)`, backgroundColor: '#BBDEFB', padding: 1, borderRadius: 2 }}>
          {grid.map((row, rowIndex) =>
            row.map((value, colIndex) => (
              <Tile key={`${rowIndex}-${colIndex}`} value={value} />
            ))
          )}
        </Box>
        <Button onClick={resetGame} variant="contained" color="secondary" sx={{ marginTop: 2 }}>Reset Game</Button>
      </Box>
    </Box>
  );
};

const Tile = ({ value }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        width: '75px',
        height: '75px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: value ? colors[value] || '#EDC22E' : 'rgba(255, 255, 255, 0.1)',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: value === 2 || value === 4 ? '#776E65' : '#F9F6F2',
        transition: '0.3s',
      }}
    >
      {value || ''}
    </Paper>
  );
};

export default App;
