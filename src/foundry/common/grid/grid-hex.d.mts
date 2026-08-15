import type { BaseGrid, HexagonalGrid } from "#common/grid/_module.d.mts";
import type { Canvas } from "#client/canvas/_module.d.mts";

/**
 * A helper class which represents a single hexagon as part of a HexagonalGrid.
 * This class relies on having an active canvas scene in order to know the configuration of the hexagonal grid.
 */
declare class GridHex {
  /**
   * Construct a GridHex instance by providing a hex coordinate.
   * @param coordinates - The coordinates of the hex to construct
   * @param grid        - The hexagonal grid instance to which this hex belongs
   * @remarks
   * @throws If the cube coordinates the grid derives from `coordinates` are not integers summing to zero.
   */
  constructor(coordinates: HexagonalGrid.Coordinates2D, grid: HexagonalGrid);

  /**
   * The hexagonal grid to which this hex belongs.
   * @privateRemarks Defined at construction, not in the class body.
   */
  grid: HexagonalGrid;

  /**
   * The cube coordinate of this hex
   * @privateRemarks Defined at construction, not in the class body.
   */
  cube: HexagonalGrid.Cube2D;

  /**
   * The offset coordinate of this hex
   * @privateRemarks Defined at construction, not in the class body.
   */
  offset: BaseGrid.Offset2D;

  /** Return a reference to the pixel point in the center of this hexagon. */
  get center(): Canvas.Point;

  /** Return a reference to the pixel point of the top-left corner of this hexagon. */
  get topLeft(): Canvas.Point;

  /**
   * Return the array of hexagons which are neighbors of this one.
   * This result is un-bounded by the confines of the game canvas and may include hexes which are off-canvas.
   */
  getNeighbors(): GridHex[];

  /**
   * Get a neighboring hex by shifting along cube coordinates.
   * At least two of (dq, dr, ds) must be passed, an undefined third parameter may be inferred.
   * If all three are passed, they must sum to zero to represent a valid cube shift.
   * @param dq - A number of hexes to shift along the q axis
   * @param dr - A number of hexes to shift along the r axis
   * @param ds - A number of hexes to shift along the s axis
   * @returns The shifted hex
   * @remarks
   * @throws If all three shifts are passed and they do not sum to zero.
   */
  shiftCube(dq?: number, dr?: number, ds?: number): GridHex;

  /**
   * Return whether this {@linkcode GridHex} equals the same position as some other `GridHex` instance.
   * @param other - Some other `GridHex`
   * @returns Are the positions equal?
   */
  equals(other: GridHex): boolean;
}

declare namespace GridHex {}

export default GridHex;
