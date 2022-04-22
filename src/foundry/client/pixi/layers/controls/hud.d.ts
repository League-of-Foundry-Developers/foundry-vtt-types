/**
 * An extension of PIXI.Transform.
 * This uses a different DisplayObject than the current parent as the reference for the worldTransform.
 */
declare class SynchronizedTransform extends PIXI.Transform {
  constructor(transform: PIXI.Transform);

  /**
   * A list of attributes from the transform reference which should be synchronized
   * @defaultValue
   * ```javascript
   * [
   *   "localTransform", "position", "scale", "pivot", "skew", "_rotation",
   *   "_cx", "_sx", "_cy", "_sy", "_localID", "_currentLocalID"
   * ];
   * ```
   */
  static synchronizedAttributes: string[];

  /**
   * A Transform instance which defines the reference point for the worldTransform
   */
  get reference(): PIXI.Transform;

  set reference(value: PIXI.Transform);

  /** @internal */
  protected _reference: PIXI.Transform;

  /** @internal */
  protected _syncLocalID: number;

  override updateTransform(parentTransform: PIXI.Transform): void;

  override updateLocalTransform(): void;
}

/**
 * An extension of PIXI.Container used as the interface frame for a PlaceableObject on the ControlsLayer
 *
 * @see {@link PlaceableObject}
 * @see {@link ControlsLayer}
 */
declare class ObjectHUD extends PIXI.Container {
  constructor(object: PIXI.DisplayObject);

  /**
   * The object that this HUD container is linked to
   */
  object: PIXI.DisplayObject;

  /**
   * Use the linked object's transform matrix to easily synchronize position
   */
  transform: PIXI.Transform;

  // @ts-expect-error this is a property in `PIXI.Container` but foundry overrides it as an accessor.
  override get visible(): boolean;
  override set visible(value: boolean);

  // @ts-expect-error this is a property in `PIXI.Container` but foundry overrides it as an accessor.
  override get renderable(): boolean;
  override set renderable(value: boolean);

  /**
   * Display scrolling status text originating from this ObjectHUD container.
   * @param content - The text content to display
   * @param options - (default: `{}`)
   * @returns The created PreciseText object which is scrolling
   */
  createScrollingText(
    content: string,
    options?: ObjectHUD.CreateScrollingTextOptions | undefined
  ): Promise<PreciseText | null>;

  /**
   * Orchestrate the animation of the scrolling text in this HUD
   * @param text     - The PrecisText instance to animate
   * @param duration - A desired duration of animation
   * @param dx       - A horizontal distance to animate the text
   *                   (default: `0`)
   * @param dy       - A vertical distance to animate the text
   *                   (default: `0`)
   * @internal
   */
  protected _animateScrollText(text: PreciseText, duration: number, dx?: number, dy?: number): Promise<void>;
}

type TextStyleProperties = Exclude<ConstructorParameters<typeof PIXI.TextStyle>[0], undefined>;

declare namespace ObjectHUD {
  interface CreateScrollingTextOptions extends TextStyleProperties {
    /**
     * The original anchor point where the text first appears
     * @defaultValue `CONST.TEXT_ANCHOR_POINTS.CENTER`
     */
    anchor?: foundry.CONST.TEXT_ANCHOR_POINTS | undefined;

    /**
     * The direction in which the text scrolls
     * @defaultValue `CONST.TEXT_ANCHOR_POINTS.TOP`
     */
    direction?: foundry.CONST.TEXT_ANCHOR_POINTS | undefined;

    /**
     * The duration of the scrolling effect in milliseconds
     * @defaultValue `2000`
     */
    duration?: number | undefined;

    /**
     * An amount of randomization between 0 and 1 to apply to the initial Position
     * @defaultValue `0`
     */
    jitter?: number | undefined;
  }
}
