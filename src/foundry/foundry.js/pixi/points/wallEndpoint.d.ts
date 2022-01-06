import type { ConfiguredObjectClassForName } from '../../../../types/helperTypes.js';

declare global {
  /**
   * A special subclass of PIXI.Point which is used for modeling Wall endpoints.
   * A wall endpoint must have integer coordinates.
   *
   * This was used for the RadialSweepPolygon but can now be deleted once that is
   * @deprecated since v9d2
   */
  class WallEndpoint extends PIXI.Point {
    /**
     * @param x - The integer x-coordinate
     * @param y - The integer y-coordinate
     */
    constructor(x: number, y: number);

    /**
     * Express the point as a 32-bit integer with 16 bits allocated to x and 16 bits allocated to y
     */
    key: number;

    /**
     * The angle between this point and the polygon origin
     * @defaultValue `undefined`
     */
    angle: number | undefined;

    /**
     * Record the set of walls which connect to this Endpoint
     */
    walls: Set<ConfiguredObjectClassForName<'Wall'>>;

    /**
     * Record whether this point is the endpoint of any Wall
     * @defaultValue `false`
     */
    isEndpoint: boolean;

    /**
     * Record whether this point is a midpoint of any wall?
     * @defaultValue `false`
     */
    isMidpoint: boolean;

    /**
     * Record whether this point is the termination of the Ray
     * @defaultValue `false`
     */
    isTerminal: boolean;

    /**
     * Aggregate the maximum of each wall restriction type
     */
    types: Record<foundry.CONST.WALL_RESTRICTION_TYPES, number>;

    /**
     * An intermediate variable used to store the proportional distance of this point from a SightRay origin
     * @defaultValue `undefined`
     */
    protected _r: number | undefined;

    /**
     * An intermediate variable used to cache the continuation attributes for a certain point
     * @defaultValue `undefined`
     */
    protected _c: { left: boolean; right: boolean } | undefined;

    attachWall(wall: ConfiguredObjectClassForName<'Wall'>): this;

    /**
     * Does this endpoint equal some other endpoint?
     * @param other - Some other point with x and y coordinates
     * @returns Are the points equal?
     */
    equals(other: Point): boolean;

    /**
     * Is this point one that provides only limited perspective?
     * @param type - The perspective type being tested
     * @returns Is perspective limited?
     */
    isLimited(type: foundry.CONST.WALL_RESTRICTION_TYPES): boolean;

    /**
     * Encode a x/y coordinate as a 32-bit integer
     * @param x - The x-coordinate
     * @param y - The y-coordinate
     */
    static getKey(x: number, y: number): number;
  }
}
