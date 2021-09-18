/**
 * Configuration sheet for the Drawing object
 * @typeParam P - the type of the options object
 */
declare class DrawingConfig<P extends DrawingConfig.Options = DrawingConfig.Options> extends FormApplication<
  P,
  DrawingConfig.Data,
  Drawing
> {
  /**
   * @param drawing - The Drawing object being configured
   * @param options - Additional application rendering options
   */
  constructor(drawing: Drawing, options?: Partial<P>);

  /**
   * @defaultValue
   * ```typescript
   * mergeObject(super.defaultOptions, {
   *   id: "drawing-config",
   *   classes: ["sheet"],
   *   template: "templates/scene/drawing-config.html",
   *   width: 480,
   *   height: 360,
   *   configureDefault: false,
   *   tabs: [{navSelector: ".tabs", contentSelector: "form", initial: "position"}]
   * });
   * ```
   */
  static get defaultOptions(): DrawingConfig.Options;

  /** @override */
  get title(): string;

  /**
   * @param options - (unused)
   * @override
   */
  getData(options?: Partial<P>): DrawingConfig.Data;

  /**
   * Get the names and labels of fill type choices which can be applied
   */
  protected static _getFillTypes(): DrawingConfig.FillTypes;

  /**
   * @param event - (unused)
   * @override
   */
  protected _updateObject<F extends DrawingConfig.FormData>(
    event: Event,
    formData: F
  ): Promise<this['options']['configureDefault'] extends true ? F : Drawing>;

  /** @override */
  close(options?: FormApplication.CloseOptions): Promise<void>;

  /** @override */
  activateListeners(html: JQuery): void;

  /**
   * Reset the user Drawing configuration settings to their default values
   */
  protected _onResetDefaults(event: JQuery.ClickEvent): void;
}

declare namespace DrawingConfig {
  interface Data {
    author: string;
    isDefault: Options['configureDefault'];
    fillTypes: ReturnType<typeof DrawingConfig['_getFillTypes']>;
    fontFamilies: Record<typeof CONFIG['fontFamilies'][number], typeof CONFIG['fontFamilies'][number]>;
    object: DrawingConfig['object']['data'];
    options: DrawingConfig['options'];
    submitText: string;
  }

  type FillTypes = {
    [Key in keyof typeof foundry.CONST['DRAWING_FILL_TYPES'] as typeof foundry.CONST['DRAWING_FILL_TYPES'][Key]]: `DRAWING.FillType${Titlecase<Key>}`;
  };

  interface FormData {
    bezierFactor: foundry.data.DrawingData['_source']['bezierFactor'];
    fillAlpha: foundry.data.DrawingData['_source']['fillAlpha'];
    fillColor: foundry.data.DrawingData['_source']['fillColor'];
    fillType: foundry.data.DrawingData['_source']['fillType'];
    fontFamily: foundry.data.DrawingData['_source']['fontFamily'];
    fontSize: foundry.data.DrawingData['_source']['fontSize'] | null;
    height: foundry.data.DrawingData['_source']['height'] | null;
    rotation: foundry.data.DrawingData['_source']['rotation'] | null;
    strokeAlpha: foundry.data.DrawingData['_source']['strokeAlpha'];
    strokeColor: foundry.data.DrawingData['_source']['strokeColor'];
    strokeWidth: foundry.data.DrawingData['_source']['strokeWidth'] | null;
    text: string;
    textAlpha: foundry.data.DrawingData['_source']['textAlpha'];
    textColor: foundry.data.DrawingData['_source']['textColor'];
    texture: string;
    width: foundry.data.DrawingData['_source']['width'] | null;
    x: foundry.data.DrawingData['_source']['x'] | null;
    y: foundry.data.DrawingData['_source']['y'] | null;
    z: foundry.data.DrawingData['_source']['z'] | null;
  }

  interface Options extends FormApplication.Options {
    configureDefault: boolean;

    /**
     * Configure a preview version of the Drawing which is not yet saved
     */
    preview?: boolean;
  }
}
