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

  /** @override */
  // @ts-expect-error this is a property in `PIXI.Container` but foundry overrides it as an accessor.
  get visible(): boolean;
  set visible(value: boolean);

  /** @override */
  // @ts-expect-error this is a property in `PIXI.Container` but foundry overrides it as an accessor.
  get renderable(): boolean;
  set renderable(value: boolean);

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
