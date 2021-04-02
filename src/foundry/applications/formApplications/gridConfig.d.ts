/**
 * A tool for fine tuning the grid in a Scene
 * @typeParam P - the type of the options object
 */
declare class GridConfig<P extends FormApplication.Options = FormApplication.Options> extends FormApplication<
  P,
  GridConfig.Data,
  Scene
> {
  constructor(scene: Scene, sheet: GridConfig['sheet'], options?: Partial<P>);

  /**
   * Track the Scene Configuration sheet reference
   */
  sheet: SceneConfig;

  /**
   * The counter-factual dimensions being evaluated
   * @defaultValue `{}`
   */
  protected _dimensions: Canvas.Dimensions | {};

  /**
   * A reference to the bound key handler function so it can be removed
   * @defaultValue `null`
   */
  protected _keyHandler: ((event: KeyboardEvent) => void) | null;

  /**
   * A reference to the bound mousewheel handler function so it can be removed
   * @defaultValue `null`
   */
  protected _wheelHandler: ((event: WheelEvent) => void) | null;

  /**
   * @override
   * @defaultValue
   * ```typescript
   * mergeObject(super.defaultOptions, {
   *   id: "grid-config",
   *   template: "templates/scene/grid-config.html",
   *   title: game.i18n.localize("SCENES.GridConfigTool"),
   *   width: 480,
   *   height: "auto",
   *   closeOnSubmit: true,
   *   submitOnChange: true
   * });
   * ```
   */
  static get defaultOptions(): typeof FormApplication['defaultOptions'];

  /**
   * @override
   */
  getData(options?: Application.RenderOptions): GridConfig.Data;

  /**
   * @override
   */
  protected _render(force?: boolean, options?: Application.RenderOptions): Promise<void>;

  /**
   * @override
   */
  activateListeners(html: JQuery): void;

  /**
   * @override
   */
  close(options?: FormApplication.CloseOptions): ReturnType<FormApplication['close']>;

  /**
   * Handle resetting the form and re-drawing back to the original dimensions
   * @param event - The original keydown event
   */
  protected _onKeyDown(event: KeyboardEvent): void;

  /**
   * Handle resetting the form and re-drawing back to the original dimensions
   * @param event - The original wheel event
   */
  protected _onWheel(event: WheelEvent): void;

  /**
   * Handle resetting the form and re-drawing back to the original dimensions
   * @param event - The original click event
   */
  protected _onReset(event: JQuery.ClickEvent): void;

  /**
   * Scale the background size relative to the grid size
   * @param delta - The directional change in background size
   */
  protected _scaleBackgroundSize(delta: number): void;

  /**
   * Scale the grid size relative to the background image.
   * When scaling the grid size in this way, constrain the allowed values between 50px and 300px.
   * @param delta - The grid size in pixels
   */
  protected _scaleGridSize(delta: number): void;

  /**
   * Shift the background image relative to the grid layer
   * @param deltaX - The number of pixels to shift in the x-direction
   *                 (default: `0`)
   * @param deltaY - The number of pixels to shift in the y-direction
   *                 (default: `0`)
   */
  protected _shiftBackground({
    deltaX,
    deltaY
  }?: {
    deltaX?: number;
    deltaY?: number;
  }): ReturnType<GridConfig['_refresh']>;

  /**
   * Temporarily refresh the display of the BackgroundLayer and GridLayer for the new pending dimensions
   * @param background - Refresh the background display?
   *                     (default: `false`)
   * @param grid       - Refresh the grid display?
   *                     (default: `false`)
   */
  protected _refresh({ background, grid }?: { background?: boolean; grid?: boolean }): void;

  /**
   * @override
   */
  protected _onChangeInput(event: JQuery.ChangeEvent): void;

  /**
   * @param event - (unused)
   * @override
   */
  protected _updateObject(event: Event, formData: GridConfig.FormData): ReturnType<Scene['update']>;
}

declare namespace GridConfig {
  interface Data {
    gridTypes: ReturnType<typeof SceneConfig['_getGridTypes']>;
    scale: number;
    scene: Scene.Data;
  }

  type FormData = Pick<Scene.Data, 'gridType'> & {
    grid: Scene.Data['grid'] | null;
    scale: number | null;
    shiftX: Scene.Data['shiftX'] | null;
    shiftY: Scene.Data['shiftY'] | null;
  };
}
