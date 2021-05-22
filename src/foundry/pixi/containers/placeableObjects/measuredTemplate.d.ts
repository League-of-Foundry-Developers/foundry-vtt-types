/**
 * A MeasuredTemplate is an implementation of PlaceableObject which represents an area of the canvas grid which is
 * covered by some effect.
 *
 * @example
 * ```typescript
 * MeasuredTemplate.create<MeasuredTemplate>({
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
declare class MeasuredTemplate extends PlaceableObject<MeasuredTemplate.Data> {
  // Draw portions of the content
  controlIcon: ControlIcon | null;

  template: PIXI.Graphics | null;

  ruler: PreciseText | null;

  /**
   * The tiling texture used for this template, if any
   */
  texture: PIXI.Texture;

  /**
   * The template shape used for testing point intersection
   */
  shape: PIXI.Circle | PIXI.Ellipse | PIXI.Polygon | PIXI.Rectangle | PIXI.RoundedRectangle;

  /**
   * Internal property used to configure the control border thickness
   */
  protected _borderThickness: number;

  /** @override */
  static get embeddedName(): 'MeasuredTemplate';

  /**
   * @remarks
   * Not implemented by MeasuredTemplate
   */
  get bounds(): never;

  /**
   * A convenience accessor for the border color as a numeric hex code
   */
  get borderColor(): number;

  /**
   * A convenience accessor for the fill color as a numeric hex code
   */
  get fillColor(): string;

  /** @override */
  get owner(): boolean;

  /** @override */
  draw(): Promise<this>;

  /**
   * Draw the ControlIcon for the MeasuredTemplate
   */
  protected _drawControlIcon(): ControlIcon;

  /**
   * Draw the Text label used for the MeasuredTemplate
   */
  protected _drawRulerText(): PreciseText;

  /** @override */
  refresh(): this;

  /**
   * Get a Circular area of effect given a radius of effect
   */
  protected _getCircleShape(distance: number): PIXI.Circle;

  /**
   * Get a Conical area of effect given a direction, angle, and distance
   */
  protected _getConeShape(direction: number, angle: number, distance: number): PIXI.Polygon;

  /**
   * Get a Rectangular area of effect given a width and height
   */
  protected _getRectShape(direction: number, distance: number): NormalizedRectangle;

  /**
   * Get a rotated Rectangular area of effect given a width, height, and direction
   */
  protected _getRayShape(direction: number, distance: number, width: number): PIXI.Polygon;

  /**
   * Draw the rotation control handle and assign event listeners
   */
  protected _drawRotationHandle(radius: number): void;

  /**
   * Update the displayed ruler tooltip text
   */
  protected _refreshRulerText(): void;

  /**
   * Highlight the grid squares which should be shown under the area of effect
   */
  highlightGrid(): void;

  /** @override */
  rotate(angle: number, snap: number): Promise<this>;

  /** @override */
  protected _canControl(user: User, event?: any): boolean;

  /** @override */
  protected _canConfigure(user: User, event?: any): boolean;

  /** @override */
  protected _canView(user: User, event?: any): boolean;

  /** @override */
  protected _onUpdate(data: MeasuredTemplate.Data): void;

  /** @override */
  protected _onDelete(): void;
}

declare namespace MeasuredTemplate {
  interface Data extends PlaceableObject.Data {
    angle: number | null;
    borderColor: string;
    direction: number;
    distance: number;
    fillColor: string;
    id: string;
    locked: boolean;
    t: 'circle' | 'rectangle' | 'cone' | 'ray';
    texture: string;
    user: string;
    width: number | null;
    x: number;
    y: number;
  }
}
