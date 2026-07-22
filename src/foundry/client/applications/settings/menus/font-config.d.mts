import type { DeepPartial, Identity, InexactPartial } from "#utils";
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
  constructor(options?: DeepPartial<Configuration>);

  /** Font types */
  static FONT_TYPES: Readonly<{
    /** Font is a file */
    FILE: "file";

    /** Font is from the system */
    SYSTEM: "system";
  }>;

  /**
   * The Foundry game setting key storing the world's fonts.
   * @defaultValue `"fonts"`
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

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * The new or in-progress font object we're editing.
   */
  object: FontConfig.NewFontDefinition;

  /**
   * Returns a list of loaded font families.
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
   * @param options    - (default: `{}`)
   * @returns Returns true if the font was successfully loaded.
   */
  static loadFont(
    family: string,
    definition: CONFIG.Font.FamilyDefinition,
    options?: InexactPartial<FontConfig.LoadFontOptions>,
  ): Promise<boolean>;

  /**
   * Ensure that fonts have loaded and are ready for use.
   * Enforce a maximum timeout in milliseconds.
   * Proceed after that point even if fonts are not yet available.
   * @param options - (default: `{}`)
   * @internal
   */
  static _loadFonts(options?: InexactPartial<FontConfig.LoadFontsOptions>): Promise<void>;

  /**
   * Collect font definitions from both config and user settings.
   */
  protected static _collectDefinitions(): Record<string, CONFIG.Font.FamilyDefinition>[];

  /**
   * Create a FontFace from a definition.
   * @param family     - The font family name.
   * @param definition - The font definition.
   * @returns The new FontFace.
   */
  protected static _createFontFace(family: string, definition: CONFIG.Font.Definition): FontFace | null;

  /**
   * Format a font definition for display.
   * @param family     - The font family name.
   * @param definition - The font definition.
   * @returns The formatted definition.
   */
  protected static _formatFont(family: string, definition: CONFIG.Font.Definition): string;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  protected override _prepareContext(options: DeepPartial<RenderOptions>): Promise<RenderContext>;

  /**
   * Build an array of font data objects for a specific font family definition.
   * @param family     - The name of the font family.
   * @param definition - The font family definition, expected to have a `fonts` array.
   * @returns An array of font data objects.
   */
  protected _getDataForDefinition(family: string, definition: CONFIG.Font.FamilyDefinition): FontConfig.FontRowData[];

  protected override _onClickAction(event: PointerEvent, target: ApplicationV2.ActionTarget): void;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  /**
   * Add a new font definition.
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

  override close(options?: DeepPartial<ApplicationV2.ClosingOptions>): Promise<this>;

  #FontConfig: true;
}

declare namespace FontConfig {
  interface Any extends AnyFontConfig {}
  interface AnyConstructor extends Identity<typeof AnyFontConfig> {}

  interface NewFontDefinition {
    family: string;

    /** @defaultValue `400` */
    weight?: number;

    /** @defaultValue `"normal"` */
    style?: string;

    /** @defaultValue `""` */
    src?: string;

    preview?: string;

    /** @defaultValue `FontConfig.FONT_TYPES.FILE` */
    type?: "file" | "system";
  }

  interface FontRowData {
    family: string;
    index: number;
    selected: boolean;
    font: string;
  }

  interface _LoadFontOptions {
    /** The host Document to load fonts for. */
    document: Document;
  }

  interface LoadFontOptions extends InexactPartial<_LoadFontOptions> {}

  interface _LoadFontsOptions extends _LoadFontOptions {
    /**
     * The maximum time to spend loading fonts before proceeding.
     * @defaultValue `4500`
     */
    timeout: number;
  }

  interface LoadFontsOptions extends InexactPartial<_LoadFontsOptions> {}

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, ApplicationV2.RenderContext {
    fonts: FontRowData[];
    selected: CONFIG.Font.Definition | null | undefined;
    isSystemFont: boolean;
    isFileFont: boolean;
    font: NewFontDefinition;
    fontWeights: { value: number; label: string }[];
    preview: {
      family: string | null;
      weight: number | null;
      style: string | null;
      text: string | undefined;
    };
    fontStyles: { value: string; label: string }[];
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
