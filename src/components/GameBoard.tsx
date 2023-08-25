import React, { useState, useEffect, useCallback, useRef } from "react";
import { Box, HStack } from "@chakra-ui/react";
import { TETROMINOS, GRID_SIZE, SQUARE_SIZE, DROP_SPEED } from "../constants";
import { Tetromino, TetrominoPosition } from "../types";
import Hint from "./Hint";
import { renderDropDownTetromino } from "./TetrominoUtils";
import TetrisControler from "./TetrisControler";

/**
 * Represents the initial grid for the game, filled with empty strings.
 * @type {string[][]}
 */
const initialGrid: string[][] = Array.from({ length: GRID_SIZE.rows }, () =>
  Array(GRID_SIZE.columns).fill("")
);

/**
 * Shuffles an array.
 *
 * @param {Array} array - The array to be shuffled.
 * @returns {Array} The shuffled array.
 */
export const shuffleArray = (array: Tetromino[]) => {
  const shuffledArray = structuredClone(array);

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // swap elements
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const makeNextMinos = (): Tetromino[] => {
  return shuffleArray(TETROMINOS);
};

interface GhostTetrominoProps {
  mino: Tetromino;
  position: TetrominoPosition;
  grid: string[][];
}

const GhostTetromino: React.FC<GhostTetrominoProps> = ({
  mino,
  position,
  grid,
}) => {
  const [ghostPosition, setGhostPosition] = useState({ col: 0, row: 0 });

  useEffect(() => {
    // Calculate the ghost position based on current tetromino and board
    const calculateGhostPosition = () => {
      let newPosition = { ...position };

      while (canMoveToPosition(newPosition, mino.shape, grid)) {
        newPosition.row++;
      }

      newPosition.row--; // Adjust to the last valid position
      setGhostPosition(newPosition);
    };

    calculateGhostPosition();
  }, [mino, position, grid]);

  /**
   * Renders the individual cells of the tetromino.
   * @param {number} cell - The cell value from the tetromino's shape.
   * @param {number} x - The x-coordinate of the cell.
   * @param {number} y - The y-coordinate of the cell.
   * @returns {JSX.Element|null} The rendered cell or null if empty.
   */
  const renderCell = (
    cell: number,
    x: number,
    y: number
  ): JSX.Element | null => {
    if (cell !== 0) {
      return (
        <div
          key={`${x}-${y}`}
          className={`tetromino tetromino-ghost`}
          style={{
            position: "absolute",
            top: y * SQUARE_SIZE + "px",
            left: x * SQUARE_SIZE + "px",
            width: SQUARE_SIZE + "px",
            height: SQUARE_SIZE + "px",
          }}
        ></div>
      );
    }
    return null;
  };

  const renderTetromino = mino.shape.map((row, y) =>
    row.map((cell, x) =>
      renderCell(cell, x + ghostPosition.col, y + ghostPosition.row)
    )
  );

  return (
    <>
      {/* Render the ghost tetromino shape here */}
      {renderTetromino}
    </>
  );
};

/**
 * Checks if a tetromino can be moved to the specified position on the grid.
 *
 * @param {Object} position - The position to check.
 * @param {number} position.col - The column of the position.
 * @param {number} position.row - The row of the position.
 * @param {number[][]} shape - The shape of the tetromino.
 * @param {string[][]} grid - The game grid.
 * @returns {boolean} True if the tetromino can be moved, false otherwise.
 */
const canMoveToPosition = (
  position: { col: number; row: number },
  shape: number[][],
  grid: string[][]
): boolean => {
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[0].length; col++) {
      if (shape[row][col] !== 0) {
        const gridCol = col + position.col;
        const gridRow = row + position.row;
        if (
          gridCol < 0 ||
          gridRow < 0 ||
          gridCol >= GRID_SIZE.columns ||
          gridRow >= GRID_SIZE.rows ||
          grid[gridRow][gridCol] !== ""
        ) {
          return false;
        }
      }
    }
  }
  return true;
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
  playSound: (sndL: HTMLAudioElement) => void;
}

const audioMove = new Audio("/audio/btn01.mp3");
const audioRotate = new Audio("/audio/btn10.mp3");
//const audioCollision = new Audio("/audio/cncl03.mp3");

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
  playSound,
}): JSX.Element => {
  const [pauseState, setPauseState] = useState(false);
  const [grid, setGrid] = useState<string[][]>(structuredClone(initialGrid));
  const [minos, setMinos] = useState<Tetromino[]>([]);
  const [currentMino, setCurrentMino] = useState<Tetromino>(TETROMINOS[0]);
  const [nextMino, setNextMino] = useState<Tetromino>(TETROMINOS[0]);
  const [holdMino, setHoldMino] = useState<Tetromino | null>(null);
  const [currentMinoPosition, setCurrentMinoPosition] =
    useState<TetrominoPosition>({ row: 0, col: 0 });
  const currentMinoPositionRef = useRef(currentMinoPosition);
  const minosRef = useRef(minos);

  useEffect(() => {
    if (minos.length <= 0) {
      let minos: Tetromino[];
      minos = [...makeNextMinos(), ...makeNextMinos()];
      const initialCurrentMino = minos.pop();
      if (!initialCurrentMino) {
        alert("Initial Error");
        return;
      }
      setCurrentMino(initialCurrentMino);
      setCurrentMinoPosition({
        col: Math.floor(
          (GRID_SIZE.columns - initialCurrentMino.shape[0].length) / 2
        ),
        row: 0,
      });
      setNextMino(minos.pop() || minos[0]);
      setMinos(minos);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    minosRef.current = minos;
  }, [minos]);

  useEffect(() => {
    currentMinoPositionRef.current = currentMinoPosition;
  }, [currentMinoPosition]);

  const getNextMino = () => {
    const nextMino = minos.pop() || minos[0];
    if (minos.length < TETROMINOS.length) {
      const nextMinos = makeNextMinos();
      setMinos([...nextMinos, ...minos]);
    }
    return nextMino;
  };

  /**
   * Writes the current tetromino's shape and color to the grid at its current position.
   */
  const writeToGrid = useCallback(() => {
    const { shape, color } = currentMino;
    const { col, row } = currentMinoPositionRef.current;

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
  }, [currentMino, currentMinoPositionRef]);

  /**
   * Moves the tetromino to the specified position if possible.
   * @param {Object} position - The position to move to.
   * @param {number} position.col - The column of the position.
   * @param {number} position.row - The row of the position.
   * @returns {boolean} True if the tetromino was moved, false otherwise.
   */
  const tetrominoMove = useCallback(
    (position: { col: number; row: number }): Boolean => {
      if (canMoveToPosition(position, currentMino.shape, grid)) {
        setCurrentMinoPosition((prev) => position);
        return true;
      }
      return false;
    },
    [grid, currentMino]
  );

  /**
   * Moves the tetromino to the left if possible.
   * @returns {boolean} True if the tetromino was moved, false otherwise.
   */
  const moveLeft = useCallback((): Boolean => {
    const newPosition = { ...currentMinoPositionRef.current };
    newPosition.col--;
    return tetrominoMove(newPosition);
  }, [currentMinoPositionRef, tetrominoMove]);

  /**
   * Moves the tetromino to the right if possible.
   * @returns {boolean} True if the tetromino was moved, false otherwise.
   */
  const moveRight = useCallback((): Boolean => {
    const newPosition = { ...currentMinoPositionRef.current };
    newPosition.col++;
    return tetrominoMove(newPosition);
  }, [currentMinoPositionRef, tetrominoMove]);

  /**
   * Moves the tetromino down if possible.
   * @returns {boolean} True if the tetromino was moved, false otherwise.
   */
  const moveDown = useCallback((): Boolean => {
    const newPosition = { ...currentMinoPositionRef.current };
    newPosition.row++;
    if (!tetrominoMove(newPosition)) {
      writeToGrid();
      return false;
    }

    return true;
  }, [currentMinoPositionRef, tetrominoMove, writeToGrid]);

  const hardDrop = useCallback(() => {
    let newPosition = { ...currentMinoPositionRef.current };

    while (canMoveToPosition(newPosition, currentMino.shape, grid)) {
      newPosition.row++;
    }

    newPosition.row--; // Adjust to the last valid position
    setCurrentMinoPosition(newPosition);
  }, [currentMinoPositionRef.current]);

  const hold = () => {
    const newPosition = { ...currentMinoPositionRef.current };
    if (holdMino === null) {
      if (newPosition.col + nextMino.shape[0].length > GRID_SIZE.columns) {
        newPosition.col = GRID_SIZE.columns - nextMino.shape[0].length;
      }
      if (newPosition.row + nextMino.shape.length > GRID_SIZE.rows) {
        newPosition.row = GRID_SIZE.rows - nextMino.shape.length;
      }
      setHoldMino(currentMino);
      setCurrentMino(nextMino);
      setNextMino(getNextMino());
    } else {
      if (newPosition.col + holdMino.shape[0].length > GRID_SIZE.columns) {
        newPosition.col = GRID_SIZE.columns - holdMino.shape[0].length;
      }
      if (newPosition.row + holdMino.shape.length > GRID_SIZE.rows) {
        newPosition.row = GRID_SIZE.rows - holdMino.shape.length;
      }
      setCurrentMino(holdMino);
      setHoldMino(currentMino);
    }
    setCurrentMinoPosition(newPosition);
  };

  const pause = () => {
    setPauseState(!pauseState);
  };

  const rotateLeft = () => rotateTetromino(false);
  const rotateRight = () => rotateTetromino(true);

  /**
   * Rotates the current tetromino clockwise by 90 degrees.
   */
  const rotateTetromino = useCallback(
    (clockwise: boolean) => {
      const shapeRow = currentMino.shape.length;
      const shapeCol = currentMino.shape[0].length;
      const newShape: number[][] = [];

      for (let col = 0; col < shapeCol; col++) {
        const newRow = [];
        for (let row = 0; row < shapeRow; row++) {
          clockwise
            ? newRow.push(currentMino.shape[shapeRow - row - 1][col])
            : newRow.push(currentMino.shape[row][shapeCol - col - 1]);
        }
        newShape.push(newRow);
      }

      // Check for overflow from grid
      const newPosition = { ...currentMinoPositionRef.current };
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

      if (canMoveToPosition(newPosition, newShape, grid)) {
        setCurrentMino((prev) => {
          const newTetromino = { ...prev };
          newTetromino.shape = newShape;
          return newTetromino;
        });
        setCurrentMinoPosition(newPosition);
        playSound(audioRotate);
      }
      /* Cansel rotate */
    },
    [grid, currentMino.shape, currentMinoPositionRef, playSound]
  );

  /**
   * Handles the key press event and performs corresponding actions.
   * @param {KeyboardEvent} event - The key press event.
   */
  // eslint-disable-next-line
  const handleKeyPress = (event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowLeft":
        moveLeft();
        playSound(audioMove);
        break;
      case "ArrowRight":
        moveRight();
        playSound(audioMove);
        break;
      case "ArrowDown":
        moveDown();
        playSound(audioMove);
        break;
      case "x":
      case "X":
        rotateRight();
        break;
      case "z":
      case "Z":
        rotateLeft();
        break;
      case "ArrowUp":
      case "End":
        hardDrop();
        break;
      case "Shift":
        hold();
        break;
      case "Pause":
        pause();
        break;
      default:
        console.log(event.key);
        break;
    }
  };

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

  // Keydown Event Listener
  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  // Game loop
  useEffect(() => {
    if (pauseState) {
      return;
    }
    const gameLoop = setInterval(() => {
      if (!moveDown()) {
        if (currentMinoPositionRef.current.row === 0) {
          onGameOver();
        } else {
          setGrid((prev) => {
            const { newGrid, clearedRows } = clearFilledRow(prev);
            if (clearedRows) {
              const score = Math.pow(2, clearedRows) * 100;
              addScore(score);
              return newGrid;
            }
            return prev;
          });

          // Next
          setCurrentMinoPosition({
            col: Math.floor((GRID_SIZE.columns - nextMino.shape[0].length) / 2),
            row: 0,
          });
          setCurrentMino(nextMino);
          setNextMino(getNextMino());
        }
      }
    }, 1000 / DROP_SPEED); // Move down every second

    return () => {
      clearInterval(gameLoop);
    };
  }, [
    currentMinoPosition,
    addScore,
    clearFilledRow,
    grid,
    moveDown,
    nextMino,
    onGameOver,
    getNextMino,
    pauseState,
  ]);

  return (
    <div>
      <HStack>
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
            currentTetromino: currentMino,
            currentTetrominoPosition: currentMinoPosition,
          })}
          <GhostTetromino
            mino={currentMino}
            position={currentMinoPosition}
            grid={grid}
          />
        </Box>
        <Box>
          {minosRef.current.length >= TETROMINOS.length && (
            <Hint
              nextMino={nextMino}
              nextMinos={minosRef.current}
              holdMino={holdMino}
            />
          )}
        </Box>
      </HStack>

      <Box padding="1" bgColor="grey">
        <TetrisControler
          moveDown={moveDown}
          moveLeft={moveLeft}
          moveRight={moveRight}
          rotateRight={rotateRight}
          rotateLeft={rotateLeft}
          hold={hold}
          pause={pause}
          hardDrop={hardDrop}
        />
      </Box>
    </div>
  );
};

export default GameBoard;
