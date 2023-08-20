import { Text } from "@chakra-ui/react";

/**
 * Renders the title of the Tetris game.
 * @returns {JSX.Element} The rendered title component.
 */
const Title = () => {
  return (
    <>
      <Text pb="1.0rem" fontSize="1.5rem" fontWeight="700">
        Yet Another Tetris
      </Text>
    </>
  );
};

export default Title;
