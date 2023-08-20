import React, { useCallback, useState } from "react";
import { AiFillSound, AiOutlineSound } from "react-icons/ai";
import { Flex, Box, Button, Text, Center } from "@chakra-ui/react";
import { GRID_SIZE, SQUARE_SIZE } from "../constants";
import Title from "./Title";
import ScoreBoard from "./ScoreBoard";
import Usage from "./Usage";
import GameBoard from "./GameBoard";

const audioBGM = new Audio("/MusMus-BGM-162.mp3");
const audioAddScore = new Audio("/btn07.mp3");

/**
 * Represents the Tetris game stage.
 */
const Stage: React.FC = () => {
  const [score, setScore] = useState(0);
  const [toggleBGM, setToggleBGM] = useState(false);
  const [showTetris, setShowTetris] = useState(false);

  /**
   * Add score to the current score.
   * @param {number} add - The score to add.
   */
  const addScore = useCallback((add: number) => {
    audioAddScore.play();
    setScore((current) => current + add);
  }, []);

  /**
   * Handle the game over event.
   */
  const handleGameOver = () => {
    const utterance = new SpeechSynthesisUtterance("Game Over");
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
    setShowTetris(false);
  };

  /**
   * Handle the play again event.
   */
  const handlePlayAgain = () => {
    setShowTetris(true);
    //const utterance = new SpeechSynthesisUtterance("Let's Start");
    //utterance.lang = "en-US";
    //speechSynthesis.speak(utterance);
    setScore(0);
  };

  const handleToggleBGM = () => {
    if (toggleBGM) {
      audioBGM.pause();
      audioBGM.currentTime = 0;
    } else {
      audioBGM.currentTime = 0;
      audioBGM.loop = true;
      audioBGM.play();
    }
    setToggleBGM(!toggleBGM);
  };

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      //w={GRID_SIZE.columns * SQUARE_SIZE}
    >
      <Box>
        <Title />
        <Button onClick={handleToggleBGM} size="xs">
          {toggleBGM ? <AiFillSound /> : <AiOutlineSound />} BGM : MUSMUS
        </Button>
        <Text align="center"></Text>
        <Text fontSize="sm">
          {/* Copyright Tsutomu FUNADA 2023. All rights reserved. */}
        </Text>
        <ScoreBoard score={score} />
        <Usage />
        <Box h={GRID_SIZE.rows * SQUARE_SIZE + 50}>
          {showTetris ? (
            <>
              <Box
                bgColor="white"
                //w={GRID_SIZE.columns * SQUARE_SIZE}
                //h={GRID_SIZE.rows * SQUARE_SIZE + 50}
              >
                <GameBoard onGameOver={handleGameOver} addScore={addScore} />
              </Box>
            </>
          ) : (
            <>
              <Text align="center" fontSize="3xl" fontWeight="bold">
                Game Over
              </Text>
              <Box padding="10">
                <Center verticalAlign="center">
                  <Button
                    fontSize="2xl"
                    fontWeight="bold"
                    onClick={handlePlayAgain}
                  >
                    Play again
                  </Button>
                </Center>
              </Box>
            </>
          )}
        </Box>
      </Box>
      <Center></Center>
    </Flex>
  );
};

export default Stage;
