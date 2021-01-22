/**
 * A MeasuredTemplate is an implementation of PlaceableObject which represents an area of the canvas grid which is
 * covered by some effect.
 * @example
 * ```javascript
 * MeasuredTemplate.create({
 *   t: "cone",
 *   user: game.user._id,
 *   x: 1000,
 *   y: 1000,
 *   direction: 0.45,
 *   angle: 63.13,
 *   distance: 30,
 *   borderColor: "#FF0000",
 *   fillColor: "#FF3366",
 *   texture: "tiles/fire.jpg"
 * });
 * ```
 */
declare class MeasuredTemplate extends PlaceableObject {
  constructor (any: any)

  get bounds (): NormalizedRectangle

  /**
   * Draw the rotation control handle and assign event listeners
   * @internal
   */
  _drawRotationHandle (radius: any): void;

  /**
   * Draw the Text label used for the MeasuredTemplate
   * @internal
   */
  _drawRulerText (): PIXI.Text;

  // TODO properly declare the creation data object

  /**
   * Get a Circular area of effect given a radius of effect
   * @internal
   */
  _getCircleShape (distance: number): PIXI.Circle;

  /**
   * Get a Conical area of effect given a direction, angle, and distance
   * @internal
   */
  _getConeShape (
    direction: number,
    angle: number,
    distance: number
  ): PIXI.Polygon;

  /**
   * Get a rotated Rectangular area of effect given a width, height, and direction
   * @internal
   */
  _getRayShape (
    direction: number,
    distance: number,
    width: number
  ): PIXI.Polygon;

  /**
   * Get a Rectangular area of effect given a width and height
   * @internal
   */
  _getRectShape (direction: number, distance: number): NormalizedRectangle;

  /**
   * Update the displayed ruler tooltip text
   * @internal
   */
  _refreshRulerText (): void;

  draw (): Promise<PlaceableObject>

  /**
   * Highlight the grid squares which should be shown under the area of effect
   */
  highlightGrid (): void;

  refresh (): PlaceableObject
}
