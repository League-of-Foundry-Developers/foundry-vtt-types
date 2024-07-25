import type { ConfiguredDocumentClass } from "../../../../types/helperTypes.d.mts";
import type { MaybePromise } from "../../../../types/utils.d.mts";

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
      options?: Partial<Options>,
    );

    /**
     * Track the Scene Configuration sheet reference
     */
    sheet: SceneConfig;

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
     * })
     * ```
     */
    static override get defaultOptions(): (typeof FormApplication)["defaultOptions"];

    protected override _render(force?: boolean, options?: Application.RenderOptions<Options>): Promise<void>;

    override getData(options?: Partial<Options>): MaybePromise<object>;

    protected override _getSubmitData(updateData?: object | null): GridConfig.FormData;

    override close(options?: FormApplication.CloseOptions): ReturnType<FormApplication["close"]>;

    override activateListeners(html: JQuery): void;

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

    protected override _onChangeInput(event: JQuery.ChangeEvent): Promise<void>;

    protected override _updateObject(event: Event, formData: GridConfig.FormData): Promise<void>;

    /**
     * Temporarily refresh the display of the BackgroundLayer and GridLayer for the new pending dimensions
     * @param options - Options which define how the refresh is performed
     * @internal
     */
    protected _refresh(options?: {
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

    /**
     * Reset the scene back to its original settings
     * @internal
     */
    protected _reset(): Promise<void>;

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
     * @param position - The position configuration to preview
     * @internal
     */
    protected _shiftBackground(position?: {
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
    }): void;
  }

  namespace GridConfig {
    interface FormData {
      "grid.type": Scene["grid"]["type"];
      "grid.size": Scene["grid"]["size"];
      scale: Scene["width"];
      "background.offsetX": Scene["background"]["offsetX"];
      "background.offsetY": Scene["background"]["offsetY"];
    }
  }
}
