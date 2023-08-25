/**
 * Constants related to the Tetris game.
 */

/**
 * Size of each square in pixels.
 * @type {number}
 */
export const SQUARE_SIZE: number = 20;

/**
 * Size of the game grid in rows and columns.
 * @type {{rows: number, columns: number}}
 */
export const GRID_SIZE: { rows: number; columns: number } = {
  rows: 20,
  columns: 10,
};

/**
 * Speed at which tetrominos drop in blocks per second.
 * @type {number}
 */
export const DROP_SPEED: number = 2;

/**
 * Array of tetrominos, each defined by its shape, name, and color.
 * @type {Array<{ name: string, shape: number[][], color: string }>}
 */
export const TETROMINOS: Array<{
  name: string;
  shape: number[][];
  color: string;
}> = [
  {
    name: "I",
    shape: [[1, 1, 1, 1]],
    color: "cyan",
  },
  {
    name: "J",
    shape: [
      [1, 0, 0],
      [1, 1, 1],
    ],
    color: "blue",
  },
  {
    name: "L",
    shape: [
      [0, 0, 1],
      [1, 1, 1],
    ],
    color: "orange",
  },
  {
    name: "O",
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: "yellow",
  },
  {
    name: "S",
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    color: "green",
  },
  {
    name: "T",
    shape: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    color: "purple",
  },
  {
    name: "Z",
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    color: "red",
  },
];
