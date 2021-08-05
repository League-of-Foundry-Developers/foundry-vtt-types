/**
 * An extension of the base PIXI.Polygon class designed for polygons which are constructed as a radius around
 * some central origin.
 */
declare class SourcePolygon extends PIXI.Polygon {
  constructor(x: number, y: number, radius: number, ...points: ({ x: number; y: number }[] | number[])[]);

  x: number;

  y: number;

  radius: number;

  /** @override */
  clone(): this;

  /**
   * Optimize Polygon membership test by first checking the hypotenuse of the candidate point against the known origin
   * @see PIXI.Polygon#contains
   * @param x - The candidate x-coordinate
   * @param y - The candidate y-coordinate
   * @returns Is the provided point contained within the SourcePolygon?
   */
  contains(x: number, y: number): boolean;
}
