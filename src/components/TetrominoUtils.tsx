import { Box } from "@chakra-ui/react";
import { SQUARE_SIZE } from "../constants";
import { Tetromino, TetrominoPosition } from "../types";

/**
 * Renders the current falling tetromino on the game board.
 * @param {Object} props - Props for the renderDropDownTetromino function.
 * @param {Tetromino} props.currentTetromino - The current falling tetromino.
 * @param {TetrominoPosition} props.currentTetrominoPosition - The position of the current falling tetromino.
 * @returns {JSX.Element} The rendered tetromino on the game board.
 */
export const renderDropDownTetromino: React.FC<{
  currentTetromino: Tetromino;
  currentTetrominoPosition: TetrominoPosition;
}> = ({ currentTetromino, currentTetrominoPosition }) => {
  const { shape, color } = currentTetromino;
  const renderTetromino = shape.map((row, y) => {
    return row.map((cell, x) => {
      if (cell !== 0) {
        const top = (y + currentTetrominoPosition.row) * SQUARE_SIZE;
        const left = (x + currentTetrominoPosition.col) * SQUARE_SIZE;
        return (
          <div
            key={`${x}-${y}`}
            className={`tetromino tetromino-${color}`}
            style={{
              position: "absolute",
              top: top + "px",
              left: left + "px",
              width: SQUARE_SIZE + "px",
              height: SQUARE_SIZE + "px",
            }}
          />
        );
      }
      return null;
    });
  });

  return (
    <>
      <Box w="120px" h="60px" pos="relative" bgColor="transparent">
        {renderTetromino}
      </Box>
    </>
  );
};
