import { Box, Kbd, Text } from "@chakra-ui/react";
import { GRID_SIZE, SQUARE_SIZE } from "../constants";

/**
 * Renders the keyboard controls usage information for the Tetris game.
 * @returns {JSX.Element} The rendered usage component.
 */
const Usage = () => {
  return (
    <Box bgColor="darkgray" w={(GRID_SIZE.columns + 5) * SQUARE_SIZE}>
      <Text>
        Move:<Kbd color="gray.700">←</Kbd>
        <Kbd color="gray.700">↓</Kbd>
        <Kbd color="gray.700">→</Kbd>
      </Text>
      <Text>
        Rotate:<Kbd color="gray.700">Z</Kbd> <Kbd color="gray.700">X</Kbd>
      </Text>
      <Text>
        Drop:<Kbd color="gray.700">↑</Kbd>
        <Kbd color="gray.700">End</Kbd>
      </Text>
      <Text>
        Hold:<Kbd color="gray.700">Shift</Kbd>
      </Text>
    </Box>
  );
};

export default Usage;
