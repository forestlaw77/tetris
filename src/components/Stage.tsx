import React, { useState } from "react";
import { AiFillSound, AiOutlineSound } from "react-icons/ai";
import { Flex, Box, Button, Text, Center } from "@chakra-ui/react";
import { GRID_SIZE, SQUARE_SIZE } from "../constants";
import ScoreBoard from "./ScoreBoard";
import GameBoard from "./GameBoard";
import Desktop from "../utils/Desktop";
import Usage from "./Usage";

const audioBGM = new Audio("/audio/MusMus-BGM-108.mp3");
const audioAddScore = new Audio("/audio/btn07.mp3");

/**
 * Represents the Tetris game stage.
 */
const Stage: React.FC = () => {
  const [score, setScore] = useState(0);
  const [toggleBGM, setToggleBGM] = useState(false);
  const [toggleSND, setToggleSND] = useState(false);
  const [showTetris, setShowTetris] = useState(false);

  /**
   * Add score to the current score.
   * @param {number} add - The score to add.
   */
  const addScore = (add: number) => {
    playSound(audioAddScore);
    setScore((current) => current + add);
  };

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
    const utterance = new SpeechSynthesisUtterance("Hung in there!");
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
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

  const handleToggleSND = () => {
    setToggleSND(!toggleSND);
  };

  const playSound = (snd: HTMLAudioElement) => {
    if (toggleSND) {
      snd.play();
    }
  };

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      //w={GRID_SIZE.columns * SQUARE_SIZE}
    >
      <Box>
        <Flex justifyContent="space-between">
          <Button onClick={handleToggleBGM} size="sm">
            {toggleBGM ? <AiFillSound /> : <AiOutlineSound />} BGM : MusMus
          </Button>
          <Button onClick={handleToggleSND} size="sm">
            {toggleSND ? <AiFillSound /> : <AiOutlineSound />} SOUND
          </Button>
        </Flex>
        <Text align="center"></Text>
        <Text fontSize="sm">
          {/* Copyright Tsutomu FUNADA 2023. All rights reserved. */}
        </Text>
        <ScoreBoard score={score} />
        <Box h={GRID_SIZE.rows * SQUARE_SIZE + 50}>
          {showTetris ? (
            <>
              <Box bgColor="white">
                <GameBoard
                  onGameOver={handleGameOver}
                  addScore={addScore}
                  playSound={playSound}
                />
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
              <Desktop>
                <Usage />
              </Desktop>
            </>
          )}
        </Box>
      </Box>
    </Flex>
  );
};

export default Stage;
