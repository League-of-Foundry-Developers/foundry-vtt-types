import type { MaybePromise } from "../../../../utils/index.d.mts";

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
    DrawingDocument.ConfiguredInstance
  > {
    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   id: "drawing-config",
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

    override getData(options?: Partial<Options>): MaybePromise<object>; // TODO: Implement GetDataReturnType

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
    type Any = DrawingConfig<any>;

    interface FormData {
      author: string;
      bezierFactor: DrawingDocument["bezierFactor"];
      fillAlpha: DrawingDocument["fillAlpha"];
      fillColor: DrawingDocument["fillColor"];
      fillType: DrawingDocument["fillType"];
      fontFamily: DrawingDocument["fontFamily"];
      fontSize: DrawingDocument["fontSize"];
      "shape.height": DrawingDocument["shape"]["height"];
      rotation: DrawingDocument["rotation"];
      strokeAlpha: DrawingDocument["strokeAlpha"];
      strokeColor: DrawingDocument["strokeColor"];
      strokeWidth: DrawingDocument["strokeWidth"];
      text: DrawingDocument["text"];
      textAlpha: DrawingDocument["textAlpha"];
      textColor: DrawingDocument["textColor"];
      texture: DrawingDocument["texture"];
      "shape.width": DrawingDocument["shape"]["width"];
      x: DrawingDocument["x"];
      y: DrawingDocument["y"];
      z: DrawingDocument["z"];
    }
  }
}
