import type { DeepPartial, Identity, MaybePromise } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      FontConfig: FontConfig.Any;
    }
  }
}

/**
 * A V2 application responsible for configuring custom fonts for the world.
 */
declare class FontConfig<
  RenderContext extends FontConfig.RenderContext = FontConfig.RenderContext,
  Configuration extends FontConfig.Configuration = FontConfig.Configuration,
  RenderOptions extends FontConfig.RenderOptions = FontConfig.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  /**
   * @param options - App config
   *
   * @remarks The font properties are merged over whatever is passed, so supplying `family`, `weight`,
   * `style`, `src` or `preview` here has no effect.
   */
  constructor(options?: DeepPartial<Configuration>);

  /**
   * Font types.
   * @defaultValue
   * ```js
   * {
   *   FILE: "file",
   *   SYSTEM: "system"
   * }
   * ```
   */
  static FONT_TYPES: Readonly<FontConfig.FontTypes>;

  /**
   * The Foundry game setting key storing the world's fonts.
   */
  static SETTING: "fonts";

  /**
   * @defaultValue
   * ```js
   * {
   *   id: "font-config",
   *   tag: "form",
   *   window: {
   *     contentClasses: ["standard-form"],
   *     title: "SETTINGS.FontConfigL",
   *     icon: "fa-solid fa-font"
   *   },
   *   position: {
   *     width: 600
   *   },
   *   form: {
   *     closeOnSubmit: true
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: FontConfig.DefaultOptions;

  /**
   * @defaultValue
   * ```js
   * {
   *   body: {
   *     template: "templates/settings/menus/font-config.hbs",
   *     scrollable: [""]
   *   },
   *   footer: {
   *     template: "templates/generic/form-footer.hbs"
   *   }
   * }
   * ```
   */
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * The new or in-progress font object we're editing.
   */
  object: FontConfig.NewFontDefinition;

  /**
   * Returns a list of loaded font families.
   *
   * @remarks Only families whose definition set `editor: true` and which loaded successfully.
   */
  static getAvailableFonts(): string[];

  /**
   * Returns a record of loaded font families, formatted for selectOptions.
   */
  static getAvailableFontChoices(): Record<string, string>;

  /**
   * Load a font definition for a given family.
   * @param family     - The font family name (case-sensitive).
   * @param definition - The font family definition.
   * @returns Returns true if the font was successfully loaded.
   */
  static loadFont(
    family: string,
    definition: CONFIG.Font.FamilyDefinition,
    options?: FontConfig.LoadFontOptions,
  ): Promise<boolean>;

  /**
   * Ensure that fonts have loaded and are ready for use.
   * Enforce a maximum timeout in milliseconds.
   * Proceed after that point even if fonts are not yet available.
   * @internal
   */
  static _loadFonts(options?: FontConfig.LoadFontsOptions): Promise<void>;

  /**
   * Collect font definitions from both config and user settings.
   */
  protected static _collectDefinitions(): Record<string, CONFIG.Font.FamilyDefinition>[];

  /**
   * Create a FontFace from a definition.
   * @param family     - The font family name.
   * @param definition - The font definition.
   * @returns The new FontFace.
   *
   * @remarks `null` for a definition carrying no `urls` array, such as a system-installed family.
   */
  protected static _createFontFace(family: string, definition: CONFIG.Font.Definition): FontFace | null;

  /**
   * Format a font definition for display.
   * @param family     - The font family name.
   * @param definition - The font definition.
   * @returns The formatted definition.
   *
   * @remarks Markup, not plain text; an empty definition formats as the bare family name.
   */
  protected static _formatFont(family: string, definition: CONFIG.Font.Definition): string;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  /**
   * Build an array of font data objects for a specific font family definition.
   * @param family     - The name of the font family.
   * @param definition - The font family definition, expected to have a `fonts` array.
   *
   * @remarks A family with no font faces still yields one entry, standing in for the OS-installed font.
   */
  protected _getDataForDefinition(family: string, definition: CONFIG.Font.FamilyDefinition): FontConfig.FontData[];

  /**
   * @privateRemarks Returns a promise for add and delete actions, and nothing for selection.
   */
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  protected override _onClickAction(event: PointerEvent, target: ApplicationV2.ActionTarget): MaybePromise<void>;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): MaybePromise<void>;

  /**
   * Add a new font definition.
   *
   * @remarks Warns and does nothing if the family is blank, or if a file font has no source path.
   */
  protected _onAddFont(): Promise<void>;

  /**
   * Delete a font from definitions.
   */
  protected _onDeleteFont(event: PointerEvent): Promise<void>;

  /**
   * Select a font to preview/edit.
   */
  protected _onSelectFont(event: PointerEvent): void;

  /**
   * @remarks Prompts for a world reload if any font was added or deleted while this was open.
   */
  override close(options?: ApplicationV2.ClosingOptions): Promise<this>;

  #FontConfig: true;

  static #FontConfigStatic: true;
}

declare namespace FontConfig {
  interface Any extends AnyFontConfig {}
  interface AnyConstructor extends Identity<typeof AnyFontConfig> {}

  interface FontTypes {
    /** Font is a file */
    FILE: "file";

    /** Font is from the system */
    SYSTEM: "system";
  }

  type FontType = FontTypes[keyof FontTypes];

  interface LoadFontOptions {
    /** The host Document to load fonts for. */
    document?: Document | undefined;
  }

  interface LoadFontsOptions extends LoadFontOptions {
    /**
     * The maximum time to spend loading fonts before proceeding.
     *
     * @defaultValue `4500`
     */
    timeout?: number | undefined;
  }

  /**
   * @remarks Every member but `preview` and `type` is reset to `null` on each render, then re-filled
   * from the selected font face, so a font that defines none of them leaves them `null`.
   */
  interface NewFontDefinition {
    family: string | null;

    /** @defaultValue `400` */
    weight: number | null;

    /** @defaultValue `"normal"` */
    style: string | null;

    /** @defaultValue `""` */
    src: string | null;

    preview: string;

    /**
     * @remarks Not part of Foundry's typedef, but the constructor sets it and the render context
     * branches on it.
     * @defaultValue {@linkcode FontConfig.FONT_TYPES | FontConfig.FONT_TYPES.FILE}
     */
    type: FontType;
  }

  /** A single font face within a family, as rendered in the font list. */
  interface FontData {
    family: string;

    index: number;

    selected: boolean;

    /** @remarks Markup produced by {@linkcode FontConfig._formatFont}. */
    font: string;
  }

  interface Choice<Value> {
    value: Value;
    label: string;
  }

  interface PreviewContext {
    family: string | null;

    weight: number | null;

    style: string | null;

    text: string;
  }

  /**
   * @remarks Foundry's override of `_prepareContext` does not call `super`. Therefore it does not
   * inherit context from its parent class.
   */
  interface RenderContext {
    fonts: FontData[];

    /**
     * @remarks `null` when nothing is selected, and `undefined` when the selected family no longer
     * holds a face at the selected index.
     */
    selected: CONFIG.Font.Definition | null | undefined;

    isSystemFont: boolean;

    isFileFont: boolean;

    font: NewFontDefinition;

    fontWeights: Choice<number>[];

    preview: PreviewContext;

    fontStyles: Choice<string>[];

    buttons: ApplicationV2.FormFooterButton[];
  }

  interface Configuration<FontConfig extends FontConfig.Any = FontConfig.Any>
    extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration<FontConfig>, NewFontDefinition {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<FontConfig extends FontConfig.Any = FontConfig.Any> = DeepPartial<Configuration<FontConfig>> &
    object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}
}

declare abstract class AnyFontConfig extends FontConfig<
  FontConfig.RenderContext,
  FontConfig.Configuration,
  FontConfig.RenderOptions
> {
  constructor(...args: never);
}

export default FontConfig;
