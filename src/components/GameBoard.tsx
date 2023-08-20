import React, { useState, useEffect, useCallback } from "react";
import { Box } from "@chakra-ui/react";
import { useSwipeable } from "react-swipeable";
import { TETROMINOS, GRID_SIZE, SQUARE_SIZE, DROP_SPEED } from "../constants";
import { Tetromino, TetrominoPosition } from "../types";
import Hint from "./Hint";
import { renderDropDownTetromino } from "./TetrominoUtils";

/**
 * Represents the initial grid for the game, filled with empty strings.
 * @type {string[][]}
 */
const initialGrid: string[][] = Array.from({ length: GRID_SIZE.rows }, () =>
  Array(GRID_SIZE.columns).fill("")
);

/**
 * Generates a random tetromino from the available tetrominos.
 * @returns {Tetromino} A randomly selected tetromino.
 */
const generateRandomTetromino = (): Tetromino => {
  const randomTetromino =
    TETROMINOS[Math.floor(Math.random() * TETROMINOS.length)];
  return randomTetromino;
};

/**
 * Props interface for the GameBoard component.
 * @interface GameBoardProps
 * @property { () => void} onGameOver - Callback function when the game is over.
 * @property { (add: number) => void} addScore - Callback function to add score.
 */
interface GameBoardProps {
  onGameOver: () => void;
  addScore: (add: number) => void;
}

/**
 * A game board component for the Tetris game.
 * @component
 * @param {Object} props - The props for the GameBoard component.
 * @param {()=> void} props.onGameOver - Callback function to handle game over event.
 * @param {(add: number) => void} props.addScore - Callback function to add scores.
 * @returns {JSX.Element} A JSX element representing the game board.
 */
const GameBoard: React.FC<GameBoardProps> = ({
  onGameOver,
  addScore,
}): JSX.Element => {
  const [grid, setGrid] = useState<string[][]>(structuredClone(initialGrid));
  const [nextTetromino, setNextTetromino] = useState<Tetromino>(
    generateRandomTetromino()
  );
  const [currentTetromino, setCurrentTetromino] = useState<Tetromino>(
    generateRandomTetromino()
  );
  const [currentTetrominoPosition, setCurrentTetrominoPosition] =
    useState<TetrominoPosition>({
      col: Math.floor(
        (GRID_SIZE.columns - currentTetromino.shape[0].length) / 2
      ),
      row: 0,
    });

  /**
   * Writes the current tetromino's shape and color to the grid at its current position.
   */
  const writeToGrid = useCallback(() => {
    const { shape, color } = currentTetromino;
    const { col, row } = currentTetrominoPosition;

    setGrid((prevGrid) => {
      const newGrid = structuredClone(prevGrid);

      for (let tetrominoRow = 0; tetrominoRow < shape.length; tetrominoRow++) {
        for (
          let tetrominoCol = 0;
          tetrominoCol < shape[0].length;
          tetrominoCol++
        ) {
          if (shape[tetrominoRow][tetrominoCol] !== 0) {
            const gridCol = col + tetrominoCol;
            const gridRow = row + tetrominoRow;
            newGrid[gridRow][gridCol] = color;
          }
        }
      }

      return newGrid;
    });
  }, [currentTetromino, currentTetrominoPosition]);

  /**
   * Checks if the tetromino can be moved to the specified position.
   * @param {Object} position - The position to check.
   * @param {number} position.col - The column of the position.
   * @param {number} position.row - The row of the position.
   * @returns {boolean} True if the tetromino can be moved to the position, false otherwise.
   */
  const canMoveToPosition = useCallback(
    (position: { col: number; row: number }, shape: number[][]): Boolean => {
      //const shape = currentTetromino.shape;
      for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[0].length; col++) {
          if (shape[row][col] !== 0) {
            const gridCol = col + position.col;
            const gridRow = row + position.row;

            if (
              gridCol < 0 ||
              gridRow < 0 ||
              gridCol >= GRID_SIZE.columns ||
              gridRow >= GRID_SIZE.rows
            ) {
              return false;
            } else if (grid[gridRow][gridCol] !== "") {
              return false;
            }
          }
        }
      }
      return true;
    },
    [currentTetromino.shape, grid]
  );

  /**
   * Moves the tetromino to the specified position if possible.
   * @param {Object} position - The position to move to.
   * @param {number} position.col - The column of the position.
   * @param {number} position.row - The row of the position.
   * @returns {boolean} True if the tetromino was moved, false otherwise.
   */
  const tetrominoMove = useCallback(
    (position: { col: number; row: number }): Boolean => {
      if (canMoveToPosition(position, currentTetromino.shape)) {
        setCurrentTetrominoPosition(position);
        return true;
      }
      return false;
    },
    [canMoveToPosition, currentTetromino]
  );

  /**
   * Moves the tetromino to the left if possible.
   * @returns {boolean} True if the tetromino was moved, false otherwise.
   */
  const moveLeft = useCallback((): Boolean => {
    const newPosition = { ...currentTetrominoPosition };
    newPosition.col--;
    return tetrominoMove(newPosition);
  }, [currentTetrominoPosition, tetrominoMove]);

  /**
   * Moves the tetromino to the right if possible.
   * @returns {boolean} True if the tetromino was moved, false otherwise.
   */
  const moveRight = useCallback((): Boolean => {
    const newPosition = { ...currentTetrominoPosition };
    newPosition.col++;
    return tetrominoMove(newPosition);
  }, [currentTetrominoPosition, tetrominoMove]);

  /**
   * Moves the tetromino down if possible.
   * @returns {boolean} True if the tetromino was moved, false otherwise.
   */
  const moveDown = useCallback((): Boolean => {
    const newPosition = { ...currentTetrominoPosition };
    newPosition.row++;
    if (!tetrominoMove(newPosition)) {
      writeToGrid();
      return false;
    }
    return true;
  }, [currentTetrominoPosition, tetrominoMove, writeToGrid]);

  /**
   * Rotates the current tetromino clockwise by 90 degrees.
   */
  const rotateTetromino = useCallback(() => {
    const shapeRow = currentTetromino.shape.length;
    const shapeCol = currentTetromino.shape[0].length;
    const newShape: number[][] = [];

    for (let row = 0; row < shapeCol; row++) {
      const newRow: number[] = [];
      for (let col = shapeRow - 1; col >= 0; col--) {
        newRow.push(currentTetromino.shape[col][row]);
      }
      newShape.push(newRow);
    }

    // Check for overflow from grid
    const newPosition = { ...currentTetrominoPosition };
    if (newPosition.col < 0) {
      newPosition.col = 0;
    } else if (newPosition.col + newShape[0].length > GRID_SIZE.columns) {
      newPosition.col = GRID_SIZE.columns - newShape[0].length;
    }
    if (newPosition.row < 0) {
      newPosition.row = 0;
    } else if (newPosition.row + newShape.length > GRID_SIZE.rows) {
      newPosition.row = GRID_SIZE.rows - newShape.length;
    }

    if (canMoveToPosition(newPosition, newShape)) {
      setCurrentTetromino((prev) => {
        const newTetromino = { ...prev };
        newTetromino.shape = newShape;
        return newTetromino;
      });
      setCurrentTetrominoPosition(newPosition);
    }
    /* Cansel rotate */
  }, [currentTetromino.shape, currentTetrominoPosition, canMoveToPosition]);

  /**
   * Handles the key press event and performs corresponding actions.
   * @param {KeyboardEvent} event - The key press event.
   */
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
          moveLeft();
          break;
        case "ArrowRight":
          moveRight();
          break;
        case "ArrowDown":
          moveDown();
          break;
        case "ArrowUp":
          rotateTetromino();
          break;
        default:
          break;
      }
    },
    [moveLeft, moveRight, moveDown, rotateTetromino]
  );

  /**
   * Handles swipe gestures using the react-swipeable library.
   */
  const handlers = useSwipeable({
    onSwipedLeft: () => moveLeft(),
    onSwipedRight: () => moveRight(),
    onSwipedDown: () => moveDown(),
    onTap: () => rotateTetromino(),
  });

  /**
   * Checks if a row is completely filled with tetrominos.
   * @param {string[]} row - The row to check.
   * @returns {boolean} True if the row is filled, otherwise false.
   */
  const checkIfRowIsFilled = (row: string[]): boolean => {
    return row.every((cell) => cell !== "");
  };

  /**
   * Clears filled rows from the grid and returns the updated grid and the number of cleared rows.
   * @param {string[][]} grid - The game grid to process.
   * @returns {Object} An object containing the new grid and the number of cleared rows.
   */
  const clearFilledRow = useCallback(
    (grid: string[][]): { newGrid: string[][]; clearedRows: number } => {
      let wkGrid = [...grid];
      let newGrid = structuredClone(initialGrid);

      let clearedRows = 0;
      let newRow = GRID_SIZE.rows - 1;
      for (let row = GRID_SIZE.rows - 1; row >= 0; row--) {
        if (checkIfRowIsFilled(wkGrid[row])) {
          clearedRows++;
        } else {
          //Transcribe unfilled lines
          for (let col = 0; col < GRID_SIZE.columns; col++) {
            newGrid[newRow][col] = wkGrid[row][col];
          }
          newRow--;
        }
      }
      return { newGrid, clearedRows };
    },
    []
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  // Game loop
  useEffect(() => {
    const gameLoop = setInterval(() => {
      if (!moveDown()) {
        if (currentTetrominoPosition.row === 0) {
          onGameOver();
        } else {
          const { newGrid, clearedRows } = clearFilledRow(grid);
          if (clearedRows) {
            setGrid(newGrid);
            const score = Math.pow(2, clearedRows) * 100;
            addScore(score);
          }

          // Next
          setCurrentTetrominoPosition({
            col: Math.floor(
              (GRID_SIZE.columns - nextTetromino.shape[0].length) / 2
            ),
            row: 0,
          });
          setCurrentTetromino(nextTetromino);
          const randomTetromino = generateRandomTetromino();
          setNextTetromino(randomTetromino);
        }
      }
    }, 1000 / DROP_SPEED); // Move down every second

    return () => {
      clearInterval(gameLoop);
    };
  }, [
    currentTetrominoPosition,
    addScore,
    clearFilledRow,
    grid,
    moveDown,
    nextTetromino,
    onGameOver,
  ]);

  return (
    <div {...handlers}>
      <Box>
        <Hint
          currentTetromino={currentTetromino}
          nextTetromino={nextTetromino}
        />
      </Box>
      <Box
        w={GRID_SIZE.columns * SQUARE_SIZE}
        h={GRID_SIZE.rows * SQUARE_SIZE}
        pos="relative"
        bgColor="gray.600"
        overflow="hidden"
      >
        {/* Render the grid */}
        {grid.map((row, y) =>
          row.map((cell, x) => {
            if (cell !== "") {
              return (
                <div
                  key={`${x}-${y}`}
                  className={`cell tetromino-${cell}`}
                  style={{
                    position: "absolute",
                    top: y * SQUARE_SIZE + "px",
                    left: x * SQUARE_SIZE + "px",
                    width: SQUARE_SIZE,
                    height: SQUARE_SIZE,
                  }}
                />
              );
            }
            return null;
          })
        )}

        {renderDropDownTetromino({
          currentTetromino,
          currentTetrominoPosition,
        })}
      </Box>
    </div>
  );
};

export default GameBoard;
