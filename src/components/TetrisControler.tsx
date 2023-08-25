import React, { useState } from "react";
import { Button, Grid, GridItem, Kbd } from "@chakra-ui/react";
import {
  AiFillCaretDown,
  AiFillCaretLeft,
  AiFillCaretRight,
  AiOutlineRotateLeft,
  AiOutlineRotateRight,
  AiOutlineVerticalAlignBottom,
} from "react-icons/ai";
import Desktop from "../utils/Desktop";
import Mobile from "../utils/Mobile";

interface TetrisControlerProps {
  hold: () => void;
  pause: () => void;
  hardDrop: () => void;
  rotateLeft: () => void;
  rotateRight: () => void;
  moveDown: () => void;
  moveLeft: () => void;
  moveRight: () => void;
}

const MobileControler: React.FC<TetrisControlerProps> = (props) => {
  /*
  const [moveInterval, setMoveInterval] = useState<number | null>(null);

  const startMoving = (moveFunction: () => void) => {
    moveFunction();
    const intervalId = setInterval(() => {
      moveFunction();
    }, 200);
    setMoveInterval(intervalId as unknown as number);
  };

  const stopMoving = () => {
    if (moveInterval !== null) {
      clearInterval(moveInterval);
      setMoveInterval(null);
    }
  };
*/
  return (
    <>
      <Grid padding="1" w="300px" templateColumns="repeat(4, 1fr)">
        <GridItem>
          <Button onClick={props.hold}>
            <Kbd> Hold</Kbd>
          </Button>
        </GridItem>
        <GridItem>
          <Button onClick={props.hardDrop}>
            <AiOutlineVerticalAlignBottom />
          </Button>
        </GridItem>
        <GridItem>
          <Button onClick={props.pause}>
            <Kbd>Pause</Kbd>
          </Button>
        </GridItem>
        <GridItem>
          <Button onClick={props.rotateLeft}>
            <AiOutlineRotateLeft />
          </Button>
        </GridItem>
      </Grid>
      <Grid padding="1" w="300px" templateColumns="repeat(4,1fr)">
        <GridItem>
          <Button
            onClick={props.moveLeft}
            //onTouchStart={() => startMoving(props.moveLeft)}
            //onTouchEnd={stopMoving}
          >
            <AiFillCaretLeft />
          </Button>
        </GridItem>
        <GridItem>
          <Button
            onClick={props.moveDown}
            //onTouchStart={() => startMoving(props.moveDown)}
            //onTouchEnd={stopMoving}
          >
            <AiFillCaretDown />
          </Button>
        </GridItem>
        <GridItem>
          <Button
            onClick={props.moveRight}
            //onTouchStart={() => startMoving(props.moveRight)}
            //onTouchEnd={stopMoving}
          >
            <AiFillCaretRight />
          </Button>
        </GridItem>
        <GridItem>
          <Button onClick={props.rotateRight}>
            <AiOutlineRotateRight />
          </Button>
        </GridItem>
      </Grid>
    </>
  );
};

const DesktopControler: React.FC<TetrisControlerProps> = (props) => {
  const [moveInterval, setMoveInterval] = useState<number | null>(null);

  const startMoving = (moveFunction: () => void) => {
    moveFunction();
    const intervalId = setInterval(() => {
      moveFunction();
    }, 200);
    setMoveInterval(intervalId as unknown as number);
  };

  const stopMoving = () => {
    if (moveInterval !== null) {
      clearInterval(moveInterval);
      setMoveInterval(null);
    }
  };

  return (
    <>
      <Grid padding="1" w="300px" templateColumns="repeat(4, 1fr)">
        <GridItem>
          <Button onClick={props.hold}>
            <Kbd> Hold</Kbd>
          </Button>
        </GridItem>
        <GridItem>
          <Button onClick={props.hardDrop}>
            <AiOutlineVerticalAlignBottom />
          </Button>
        </GridItem>
        <GridItem>
          <Button onClick={props.pause}>
            <Kbd>Pause</Kbd>
          </Button>
        </GridItem>
        <GridItem>
          <Button onClick={props.rotateLeft}>
            <AiOutlineRotateLeft />
          </Button>
        </GridItem>
      </Grid>
      <Grid padding="1" w="300px" templateColumns="repeat(4,1fr)">
        <GridItem>
          <Button
            onMouseDown={() => startMoving(props.moveLeft)}
            onMouseUp={stopMoving}
            onMouseLeave={stopMoving}
          >
            <AiFillCaretLeft />
          </Button>
        </GridItem>
        <GridItem>
          <Button
            onMouseDown={() => startMoving(props.moveDown)}
            onMouseUp={stopMoving}
            onMouseLeave={stopMoving}
          >
            <AiFillCaretDown />
          </Button>
        </GridItem>
        <GridItem>
          <Button
            onMouseDown={() => startMoving(props.moveRight)}
            onMouseUp={stopMoving}
            onMouseLeave={stopMoving}
          >
            <AiFillCaretRight />
          </Button>
        </GridItem>
        <GridItem>
          <Button onClick={props.rotateRight}>
            <AiOutlineRotateRight />
          </Button>
        </GridItem>
      </Grid>
    </>
  );
};

const TetrisControler: React.FC<TetrisControlerProps> = (handlers) => {
  return (
    <>
      <Desktop>
        <DesktopControler {...handlers} />
      </Desktop>
      <Mobile>
        <MobileControler {...handlers} />
      </Mobile>
    </>
  );
};

export default TetrisControler;
