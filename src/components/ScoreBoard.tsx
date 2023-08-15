import { Box, Text } from "@chakra-ui/react";
import { GRID_SIZE, SQUARE_SIZE } from "../constants";

/**
 * Represents a component that displays the player's score.
 * @param {Object} props - Props for the ScoreBoard component.
 * @param {number} props.score - The player's current score.
 * @returns {JSX.Element} The rendered ScoreBoard component.
 */
const ScoreBoard: React.FC<{ score: number }> = ({ score }) => {
  return (
    <Box bgColor="green" w={GRID_SIZE.columns * SQUARE_SIZE}>
      <Text pb="1.0rem" fontSize="1.5rem" fontWeight="700">
        Score: {score.toLocaleString()}
      </Text>
    </Box>
  );
};

export default ScoreBoard;
