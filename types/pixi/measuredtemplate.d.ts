/**
 * A PIXI.Rectangle where the width and height are always positive and the x and y are always the top-left
 */
declare class NormalizedRectangle extends PIXI.Rectangle {}

/**
 * A MeasuredTemplate is an implementation of PlaceableObject which represents an area of the canvas grid which is
 * covered by some effect.
 * @extends {PlaceableObject}
 *
 * @example
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
 */
declare class MeasuredTemplate extends PlaceableObject {
  constructor(any);

  // TODO properly declare the creation data object

  /**
   * Get a Circular area of effect given a radius of effect
   * @private
   */
  _getCircleShape(distance: number): PIXI.Circle;

  /**
   * Get a Conical area of effect given a direction, angle, and distance
   * @private
   */
  _getConeShape(
    direction: number,
    angle: number,
    distance: number
  ): PIXI.Polygon;

  /**
   * Get a Rectangular area of effect given a width and height
   * @private
   */
  _getRectShape(direction: number, distance: number): NormalizedRectangle;

  /**
   * Get a rotated Rectangular area of effect given a width, height, and direction
   * @private
   */
  _getRayShape(
    direction: number,
    distance: number,
    width: number
  ): PIXI.Polygon;

  /**
   * Draw the Text label used for the MeasuredTemplate
   * @private
   */
  _drawRulerText(): PIXI.Text;

  /**
   * Draw the rotation control handle and assign event listeners
   * @private
   */
  _drawRotationHandle(radius): void;

  /**
   * Update the displayed ruler tooltip text
   * @private
   */
  _refreshRulerText(): void;

  /**
   * Highlight the grid squares which should be shown under the area of effect
   */
  highlightGrid();
}
