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
  nextMino: Tetromino;
  nextMinos: Tetromino[];
  holdMino: Tetromino | null;
}> = ({ nextMino, nextMinos, holdMino }) => {
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

  // Render next tetrominos
  const renderNextMino = renderTetromino(nextMino);
  const render3rdMino = renderTetromino(nextMinos[nextMinos.length - 1]);
  const render4thMino = renderTetromino(nextMinos[nextMinos.length - 2]);
  const render5thMino = renderTetromino(nextMinos[nextMinos.length - 3]);
  //const render6thMino = renderTetromino(nextMinos[nextMinos.length - 4]);
  //const render7thMino = renderTetromino(nextMinos[nextMinos.length - 5]);

  let renderHoldMino = null;
  if (holdMino !== null) {
    renderHoldMino = renderTetromino(holdMino);
  }

  return (
    <>
      <HStack spacing={10}>
        {/*
        <Box>
          <Text color="black">Current</Text>
          <Box w="60px" h="50px" pos="relative">
            {renderCurrentTetromino}
          </Box>
        </Box>
          */}

        <Box>
          <Text color="black">Next</Text>
          <Box
            w={SQUARE_SIZE * 4 + 12 + "px"}
            h={SQUARE_SIZE * 3 + "px"}
            border="1px"
            borderColor="black"
            padding="2"
          >
            <Box pos="relative">{renderNextMino}</Box>
          </Box>
          <Box h="4px"></Box>
          <Box
            w={SQUARE_SIZE * 4 + 12 + "px"}
            border="1px"
            borderColor="black"
            padding="2"
          >
            <Box h={SQUARE_SIZE * 3 + "px"} pos="relative">
              {render3rdMino}
            </Box>
            <Box h={SQUARE_SIZE * 3 + "px"} pos="relative">
              {render4thMino}
            </Box>
            <Box h={SQUARE_SIZE * 3 + "px"} pos="relative">
              {render5thMino}
            </Box>
            {/*
              <Box h={SQUARE_SIZE * 3 + "px"} pos="relative">
              {render6thMino}
            </Box>
            <Box h={SQUARE_SIZE * 3 + "px"} pos="relative">
              {render7thMino}
            </Box>
           */}
          </Box>
          <Text color="black">Hold</Text>
          <Box
            w={SQUARE_SIZE * 4 + 12 + "px"}
            h={SQUARE_SIZE * 3 + "px"}
            border="1px"
            borderColor="black"
            padding="2"
          >
            <Box pos="relative">{renderHoldMino}</Box>
          </Box>
        </Box>
      </HStack>
    </>
  );
};

export default Hint;
