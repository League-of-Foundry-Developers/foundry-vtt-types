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
  /**
   * Get a Circular area of effect given a radius of effect
   */
  protected _getCircleShape(distance: number): PIXI.Circle;

  /**
   * Get a Conical area of effect given a direction, angle, and distance
   * @private
   */
  protected _getConeShape(
    direction: number,
    angle: number,
    distance: number
  ): PIXI.Polygon;

  /**
   * Get a Rectangular area of effect given a width and height
   */
  protected _getRectShape(
    direction: number,
    distance: number
  ): NormalizedRectangle;

  /**
   * Get a rotated Rectangular area of effect given a width, height, and direction
   */
  protected _getRayShape(
    direction: number,
    distance: number,
    width: number
  ): PIXI.Polygon;

  /**
   * Draw the Text label used for the MeasuredTemplate
   */
  protected _drawRulerText(): PIXI.Text;

  /**
   * Draw the rotation control handle and assign event listeners
   */
  protected _drawRotationHandle(radius): void;

  /**
   * Update the displayed ruler tooltip text
   */
  protected _refreshRulerText(): void;

  /**
   * Highlight the grid squares which should be shown under the area of effect
   */
  highlightGrid();
}
