/**
 * Configuration sheet for the Drawing object
 */
declare class DrawingConfig extends FormApplication<DrawingConfig.Data, Drawing> {
  /**
   * @param drawing - The Drawing object being configured
   * @param options - Additional application rendering options
   */
  constructor(drawing: Drawing, options?: Partial<DrawingConfig.Options>);

  options: DrawingConfig.Options;

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
  getData(options?: Application.RenderOptions): DrawingConfig.Data;

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

  // I am not sure this works completely. If anything, it will only work as long as the keys in `DRAWING_FILL_TYPES` do
  // not have multiple space delimited words in them. As soon as they do, the values in this type will definitely be
  // incorrect. This is because the `titleCase` string function used in foundry.js capitalizes each space delimited word
  // on its own. Typescript's `Capitalize` only capitalizes the first letter, so there is no direct equivalent.
  type FillTypes = {
    [Key in keyof typeof CONST['DRAWING_FILL_TYPES'] as typeof CONST['DRAWING_FILL_TYPES'][Key]]: `DRAWING.FillType${Capitalize<Key>}`;
  };

  interface FormData {
    bezierFactor: Drawing.Data['bezierFactor'];
    fillAlpha: Drawing.Data['fillAlpha'];
    fillColor: Drawing.Data['fillColor'];
    fillType: Drawing.Data['fillType'];
    fontFamily: Drawing.Data['fontFamily'];
    fontSize: Drawing.Data['fontSize'] | null;
    height: Drawing.Data['height'] | null;
    rotation: Drawing.Data['rotation'] | null;
    strokeAlpha: Drawing.Data['strokeAlpha'];
    strokeColor: Drawing.Data['strokeColor'];
    strokeWidth: Drawing.Data['strokeWidth'] | null;
    text: string;
    textAlpha: Drawing.Data['textAlpha'];
    textColor: Drawing.Data['textColor'];
    texture: string;
    width: Drawing.Data['width'] | null;
    x: Drawing.Data['x'] | null;
    y: Drawing.Data['y'] | null;
    z: Drawing.Data['z'] | null;
  }

  interface Options extends FormApplication.Options {
    configureDefault: boolean;

    /**
     * Configure a preview version of the Drawing which is not yet saved
     */
    preview: boolean;
  }
}
