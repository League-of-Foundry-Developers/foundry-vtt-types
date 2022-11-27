import type { ConfiguredDocumentClass } from "../../../../types/helperTypes";

declare global {
  /**
   * A tool for fine tuning the grid in a Scene
   * @typeParam Options - the type of the options object
   */
  class GridConfig<Options extends FormApplicationOptions = FormApplicationOptions> extends FormApplication<
    Options,
    InstanceType<ConfiguredDocumentClass<typeof Scene>>
  > {
    constructor(
      scene: InstanceType<ConfiguredDocumentClass<typeof Scene>>,
      sheet: GridConfig["sheet"],
      options?: Partial<Options>
    );

    /**
     * Track the Scene Configuration sheet reference
     */
    sheet: SceneConfig;

    /**
     * The counter-factual dimensions being evaluated
     * @defaultValue `{}`
     * @internal
     */
    protected _dimensions: ReturnType<Scene["getDimensions"]> | Record<string, never>;

    /**
     * A reference to the bound key handler function so it can be removed
     * @defaultValue `null`
     * @internal
     */
    protected _keyHandler: ((event: KeyboardEvent) => void) | null;

    /**
     * A reference to the bound mousewheel handler function so it can be removed
     * @defaultValue `null`
     * @internal
     */
    protected _wheelHandler: ((event: WheelEvent) => void) | null;

    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   id: "grid-config",
     *   template: "templates/scene/grid-config.html",
     *   title: game.i18n.localize("SCENES.GridConfigTool"),
     *   width: 480,
     *   height: "auto",
     *   closeOnSubmit: true,
     *   submitOnChange: true
     * })
     * ```
     */
    static override get defaultOptions(): typeof FormApplication["defaultOptions"];

    override getData(options?: Partial<Options>): MaybePromise<object>;

    protected override _render(force?: boolean, options?: Application.RenderOptions<Options>): Promise<void>;

    override activateListeners(html: JQuery): void;

    override close(options?: FormApplication.CloseOptions): ReturnType<FormApplication["close"]>;

    /**
     * Handle keyboard events.
     * @param event - The original keydown event
     * @internal
     */
    protected _onKeyDown(event: KeyboardEvent): void;

    /**
     * Handle mousewheel events.
     * @param event - The original wheel event
     * @internal
     */
    protected _onWheel(event: WheelEvent): void;

    /**
     * Handle resetting the form and re-drawing back to the original dimensions
     * @param event - The original click event
     * @internal
     */
    protected _onReset(event: JQuery.ClickEvent): void;

    /**
     * Scale the background size relative to the grid size
     * @param delta - The directional change in background size
     * @internal
     */
    protected _scaleBackgroundSize(delta: number): void;

    /**
     * Scale the grid size relative to the background image.
     * When scaling the grid size in this way, constrain the allowed values between 50px and 300px.
     * @param delta - The grid size in pixels
     * @internal
     */
    protected _scaleGridSize(delta: number): void;

    /**
     * Shift the background image relative to the grid layer
     * @internal
     */
    protected _shiftBackground({
      deltaX,
      deltaY
    }?: {
      /**
       * The number of pixels to shift in the x-direction
       * @defaultValue `0`
       */
      deltaX?: number;

      /**
       * The number of pixels to shift in the y-direction
       * @defaultValue `0`
       */
      deltaY?: number;
    }): ReturnType<GridConfig["_refresh"]>;

    /**
     * Temporarily refresh the display of the BackgroundLayer and GridLayer for the new pending dimensions
     * @internal
     */
    protected _refresh({
      background,
      grid
    }?: {
      /**
       * Refresh the background display?
       * @defaultValue `false`
       */
      background?: boolean;

      /**
       * Refresh the grid display?
       * @defaultValue `false`
       */
      grid?: boolean;
    }): void;

    protected override _onChangeInput(event: JQuery.ChangeEvent): void;

    protected override _updateObject(event: Event, formData: GridConfig.FormData): Promise<unknown>;
  }

  namespace GridConfig {
    type FormData = {
      gridType: foundry.CONST.GRID_TYPES;
      grid: number | null;
      scale: number | null;
      shiftX: number | null;
      shiftY: number | null;
    };
  }
}
