import type { ConfiguredDocumentClassForName } from "../../../../types/helperTypes";

declare global {
  interface DrawingConfigOptions extends FormApplicationOptions {
    /**
     * Configure the default drawing settings, instead of a specific Drawing
     * @defaultValue `false`
     */
    configureDefault: boolean;
  }

  /**
   * The Application responsible for configuring a single Drawing document within a parent Scene.
   * @typeParam Options - the type of the options object
   */
  class DrawingConfig<Options extends DrawingConfigOptions = DrawingConfigOptions> extends FormApplication<
    Options,
    InstanceType<ConfiguredDocumentClassForName<"Drawing">>
  > {
    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   id: "drawing-config",
     *   classes: ["sheet"],
     *   template: "templates/scene/drawing-config.html",
     *   width: 480,
     *   height: "auto",
     *   configureDefault: false,
     *   tabs: [{ navSelector: ".tabs", contentSelector: "form", initial: "position" }],
     * });
     * ```
     */
    static override get defaultOptions(): DrawingConfigOptions;

    override get title(): string;

    override get id(): string;

    override getData(options?: Partial<Options>): MaybePromise<object>;

    /**
     * Get the names and labels of fill type choices which can be applied
     * @internal
     */
    protected static _getFillTypes(): DrawingConfig.FillTypes;

    protected override _updateObject(event: Event, formData: DrawingConfig.FormData): Promise<unknown>;

    override close(options?: FormApplication.CloseOptions): Promise<void>;

    override activateListeners(html: JQuery): void;

    /**
     * Reset the user Drawing configuration settings to their default values
     * @param event - The originating mouse-click event
     */
    protected _onResetDefaults(event: JQuery.ClickEvent): void;
  }

  namespace DrawingConfig {
    type FillTypes = {
      [Key in keyof typeof foundry.CONST["DRAWING_FILL_TYPES"] as typeof foundry.CONST["DRAWING_FILL_TYPES"][Key]]: `DRAWING.FillType${Titlecase<Key>}`;
    };

    interface FormData {
      bezierFactor: number;
      fillAlpha: number;
      fillColor: string;
      fillType: foundry.CONST.DRAWING_FILL_TYPES;
      fontFamily: string;
      fontSize: number | null;
      height: number | null;
      rotation: number | null;
      strokeAlpha: number;
      strokeColor: string;
      strokeWidth: number | null;
      text: string;
      textAlpha: number;
      textColor: string;
      texture: string;
      width: number | null;
      x: number | null;
      y: number | null;
      z: number | null;
    }
  }
}
