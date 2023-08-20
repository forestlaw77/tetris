import React, { useCallback, useState, useRef, useEffect } from "react";
import { Flex, Box, Button, Text } from "@chakra-ui/react";
import { GRID_SIZE, SQUARE_SIZE } from "../constants";
import Title from "./Title";
import ScoreBoard from "./ScoreBoard";
import Usage from "./Usage";
import GameBoard from "./GameBoard";

/**
 * Represents the Tetris game stage.
 */
const Stage: React.FC = () => {
  const [score, setScore] = useState(0);
  const scoreRef = useRef(score);
  const [showTetris, setShowTetris] = useState(true);

  useEffect(() => {
    /**
     * Update the scoreRef when the score changes.
     */
    scoreRef.current = score;
  }, [score]);

  /**
   * Add score to the current score.
   * @param {number} add - The score to add.
   */
  const addScore = useCallback((add: number) => {
    setScore((current) => current + add);
  }, []);

  /**
   * Handle the game over event.
   */
  const handleGameOver = () => {
    alert("Game Over!");
    setShowTetris(false);
  };

  /**
   * Handle the play again event.
   */
  const handlePlayAgain = () => {
    setShowTetris(true);
    setScore(0);
  };

  return (
    <>
      <Flex alignItems="center">
        <Box>
          <Title />
          <Text fontSize="sm">
            {/* Copyright Tsutomu FUNADA 2023. All rights reserved. */}
          </Text>
          <ScoreBoard score={score} />
          <Usage />
          <Box
            bgColor="white"
            w={GRID_SIZE.columns * SQUARE_SIZE}
            h={GRID_SIZE.rows * SQUARE_SIZE}
          >
            {showTetris && (
              <GameBoard onGameOver={handleGameOver} addScore={addScore} />
            )}
          </Box>
          {!showTetris && (
            <Button bgColor="green" onClick={handlePlayAgain}>
              Play Again
            </Button>
          )}
        </Box>
      </Flex>
    </>
  );
};

export default Stage;
