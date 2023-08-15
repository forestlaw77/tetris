import { Box } from "@chakra-ui/react";
import { SQUARE_SIZE } from "../../../constants";
import { Tetromino } from "../../../types";

/**
 * Renders the current tetromino on the game board.
 * @param {Object} props - The component props.
 * @param {Tetromino} props.currentTetromino - The current tetromino to be rendered.
 * @returns {JSX.Element} The rendered current tetromino component.
 */
const CurrentTetromino: React.FC<{ currentTetromino: Tetromino }> = ({
  currentTetromino,
}: {
  currentTetromino: Tetromino;
}): JSX.Element => {
  const { shape, color } = currentTetromino;

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
          className={`tetromino tetromino-${color}`}
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

  // Render the tetromino cells
  const renderTetromino = shape.map((row, y) =>
    row.map((cell, x) => renderCell(cell, x, y))
  );

  return (
    <>
      <Box bgColor="gray.100">Current Tetromino</Box>
      <Box w="140px" h="150px" pos="relative" bgColor="gray">
        {renderTetromino}
      </Box>
    </>
  );
};
export default CurrentTetromino;
