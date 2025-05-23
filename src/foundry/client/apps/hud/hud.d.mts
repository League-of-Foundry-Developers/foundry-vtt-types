import type { MaybePromise } from "#utils";

declare global {
  /**
   * An abstract base class for displaying a heads-up-display interface bound to a Placeable Object on the canvas
   * @template Object - the type of the PlaceableObject
   * @template Options - the type of the options object
   */
  abstract class BasePlaceableHUD<
    Object extends PlaceableObject.Any = PlaceableObject,
    Options extends Application.Options = Application.Options,
  > extends Application<Options> {
    /**
     * Reference a PlaceableObject this HUD is currently bound to
     * @defaultValue `undefined`
     */
    object: Object | undefined;

    /**
     * @defaultValue
     * ```
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   classes: ["placeable-hud"],
     *   popOut: false
     * })
     * ```
     */
    static override get defaultOptions(): Application.Options;

    /**
     * Convenience access for the canvas layer which this HUD modifies
     * @remarks Returns undefined only if there's no object
     */
    get layer(): Object["layer"];

    /**
     * Bind the HUD to a new PlaceableObject and display it
     * @param object - A PlaceableObject instance to which the HUD should be bound
     */
    bind(object: Object): void;

    /**
     * Clear the HUD by fading out it's active HTML and recording the new display state
     */
    clear(): void;

    override _render(...args: Parameters<Application<Options>["_render"]>): Promise<void>;

    override getData(options?: Partial<Options>): MaybePromise<object>;

    override setPosition({ left, top, width, height, scale }?: Partial<Application.Position>): void;

    override activateListeners(html: JQuery): void;

    /**
     * Handle mouse clicks to control a HUD control button
     * @param event - The originating click event
     * @remarks This will always return a promise with documents is overridden by TokenHUD.
     */
    protected _onClickControl(event: JQuery.ClickEvent): void;

    /**
     * Toggle the visible state of all controlled objects in the Layer
     * @param event - The originating click event
     * @internal
     */
    protected _onToggleVisibility(event: JQuery.ClickEvent): Promise<Array<Object["document"]>>;

    /**
     * Toggle locked state of all controlled objects in the Layer
     * @param event - The originating click event
     * @internal
     */
    protected _onToggleLocked(event: JQuery.ClickEvent): Promise<Array<Object["document"]>>;

    /**
     * Handle sorting the z-order of the object
     * @param up    - Move the object upwards in the vertical stack?
     * @param event - The originating mouse click event
     */
    protected _onSort(up: boolean, event: JQuery.ClickEvent): Promise<Array<Object["document"]>>;
  }

  namespace BasePlaceableHUD {
    interface Any extends BasePlaceableHUD<any, any> {}
  }
}
