/**
 * An AmbientLight is an implementation of PlaceableObject which represents a dynamic light source within the Scene.
 *
 * @example
 * ```typescript
 * AmbientLight.create<AmbientLight>({
 *   t: "l",
 *   x: 1000,
 *   y: 1000,
 *   rotation: 0,
 *   dim: 30,
 *   bright: 15,
 *   angle: 360,
 *   tintColor: "#FF0000",
 *   tintAlpha: 0.05
 * });
 * ```
 */
declare class AmbientLight extends PlaceableObject<AmbientLight.Data> {
  /**
   * A reference to the PointSource object which defines this light source area of effect
   */
  source: PointSource;

  /** @override */
  static get embeddedName(): 'AmbientLight';

  /** @override */
  get bounds(): NormalizedRectangle;

  /**
   * Test whether a specific AmbientLight source provides global illumination
   */
  get global(): boolean;

  /**
   * Get the pixel radius of dim light emitted by this light source
   */
  get dimRadius(): number;

  /**
   * Get the pixel radius of bright light emitted by this light source
   */
  get brightRadius(): number;

  /**
   * Return whether the light source is currently visible in the scene
   */
  get isVisible(): boolean;

  /** @override */
  draw(): Promise<this>;

  /**
   * Draw the ControlIcon for the AmbientLight
   */
  protected _drawControlIcon(): ControlIcon;

  /** @override */
  refresh(): this;

  /**
   * The named identified for the source object associated with this light
   */
  get sourceId(): string;

  /**
   * Update the source object associated with this light
   * @param defer   - Defer refreshing the LightingLayer to manually call that refresh later.
   * @param deleted - Indicate that this light source has been deleted.
   */
  updateSource({ defer, deleted }?: { defer: boolean; deleted: boolean }): boolean | null | void;

  /** @override */
  protected _onCreate(): void;

  /** @override */
  protected _onUpdate(data: AmbientLight.Data): void;

  /** @override */
  protected _onDelete(): void;

  /** @override */
  protected _canHUD(user: User, event?: any): boolean;

  /** @override */
  protected _canConfigure(user: User, event?: any): boolean;

  /** @override */
  protected _onClickRight(event: PIXI.InteractionEvent): Promise<this>;

  /** @override */
  protected _onDragLeftStart(event: PIXI.InteractionEvent): void;

  /** @override */
  protected _onDragLeftMove(event: PIXI.InteractionEvent): void;

  /** @override */
  protected _onDragLeftCancel(event: PIXI.InteractionEvent): void;
}

declare namespace AmbientLight {
  interface Data extends PlaceableObject.Data {
    angle: number;
    bright: number;
    darknessThreshold: number;
    dim: number;
    hidden: boolean;
    lightAnimation: { speed: number; intensity: number; type?: keyof typeof CONFIG['Canvas']['lightAnimations'] };
    locked: boolean;
    rotation: number;
    t: Const.SourceType;
    tintAlpha: number;
    x: number;
    y: number;
  }
}
