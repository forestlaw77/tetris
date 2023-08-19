import { Box, Text, HStack } from "@chakra-ui/react";
import { SQUARE_SIZE, TETROMINOS } from "../constants";
import { Tetromino } from "../types";

/**
 * Represents a component that displays the current and next tetrominos.
 * @param {Object} props - Props for the Hint component.
 * @param {Tetromino} props.currentTetromino - The current tetromino to display.
 * @param {Tetromino} props.nextTetromino - The next tetromino to display.
 * @returns {JSX.Element} The rendered Hint component.
 */
const Hint: React.FC<{
  currentTetromino: Tetromino;
  nextTetromino: Tetromino;
}> = ({ currentTetromino, nextTetromino }) => {
  /**
   * Renders a tetromino on the grid based on its shape and color.
   * @param {Tetromino} tetromino - The tetromino to render.
   * @returns {JSX.Element[]} An array of JSX elements representing the rendered tetromino.
   */
  const renderTetromino = (tetromino: Tetromino) => {
    const { name } = tetromino;
    const { shape, color } = TETROMINOS.filter((tet) => tet.name === name)[0];

    return shape.map((row, y) => {
      return row.map((cell, x) => {
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
            />
          );
        }
        return null;
      });
    });
  };

  // Render current and next tetrominos
  const renderCurrentTetromino = renderTetromino(currentTetromino);
  const renderNextTetromino = renderTetromino(nextTetromino);

  return (
    <>
      <HStack spacing={10}>
        <Box>
          <Text color="black">Current</Text>
          <Box w="60px" h="50px" pos="relative">
            {renderCurrentTetromino}
          </Box>
        </Box>
        <Box>
          <Text color="black">Next</Text>
          <Box w="60px" h="50px" pos="relative">
            {renderNextTetromino}
          </Box>
        </Box>
      </HStack>
    </>
  );
};

export default Hint;
