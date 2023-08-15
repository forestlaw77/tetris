import { Box, Kbd, Text } from "@chakra-ui/react";
import { GRID_SIZE, SQUARE_SIZE } from "../constants";

/**
 * Renders the keyboard controls usage information for the Tetris game.
 * @returns {JSX.Element} The rendered usage component.
 */
const Usage = () => {
  return (
    <Box bgColor="darkgray" w={GRID_SIZE.columns * SQUARE_SIZE}>
      <Text align="center">
        左：<Kbd color="gray.700">←</Kbd>&emsp; 右：
        <Kbd color="gray.700">→</Kbd>&emsp; 下：
        <Kbd color="gray.700">↓</Kbd>&emsp; 回転：
        <Kbd color="gray.700">↑</Kbd>
      </Text>
    </Box>
  );
};

export default Usage;
