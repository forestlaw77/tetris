/**
 * Interface representing a tetromino in the game.
 * @interface Tetromino
 */
export interface Tetromino {
  /**
   * Name of the tetromino.
   * @type {string}
   */
  name: string;

  /**
   * 2D array representing the shape of the tetromino.
   * @type {number[][]}
   */
  shape: number[][];

  /**
   * Color associated with the tetromino.
   * @type {string}
   */
  color: string;
}

/**
 * Interface representing the position of a tetromino on the game grid.
 * @interface TetrominoPosition
 */
export interface TetrominoPosition {
  /**
   * Column index of the tetromino's position.
   * @type {number}
   */
  col: number;

  /**
   * Row index of the tetromino's position.
   * @type {number}
   */
  row: number;
}
