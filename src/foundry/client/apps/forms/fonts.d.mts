import type { GetDataReturnType, MaybePromise } from "#utils";

declare global {
  class FontConfig<Options extends FontConfig.Options = FontConfig.Options> extends FormApplication<
    FontConfig.NewFontDefinition,
    Options
  > {
    constructor(object?: FontConfig.NewFontDefinition, options?: Options);

    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   title: game.i18n.localize("SETTINGS.FontConfigL"),
     *   id: "font-config",
     *   template: "templates/sidebar/apps/font-config.html",
     *   popOut: true,
     *   width: 600,
     *   height: "auto",
     *   closeOnSubmit: false,
     *   submitOnChange: true
     * });
     * ```
     */
    static override get defaultOptions(): FontConfig.Options;

    /**
     * Whether a font is distributed to connected clients or found on their OS.
     */
    static FONT_TYPES: { FILE: "file"; SYSTEM: "system" };

    override getData(options?: Partial<Options>): MaybePromise<GetDataReturnType<FontConfig.Data>>;

    /**
     * Template data for a given font definition.
     * @param family     - The font family.
     * @param definition - The font family definition.
     */
    protected _getDataForDefinition(
      family: string,
      definition: CONFIG.Font.FamilyDefinition,
    ): { family: string; index: number; font: string }[];

    override activateListeners(html: JQuery<HTMLElement>): void;

    protected override _updateObject(event: Event, formData?: object): Promise<void>;

    close(options?: FormApplication.CloseOptions): Promise<void>;

    /**
     * Handle application controls.
     * @param event - The click event.
     */
    protected _onClickControl(event: MouseEvent): void;

    /**
     * Add a new custom font definition.
     */
    protected _onAddFont(): Promise<void>;

    /**
     * Delete a font.
     * @param event - The click event
     */
    protected _onDeleteFont(event: MouseEvent): Promise<void>;

    /**
     * Select a font to preview.
     * @param event - The click event
     */
    protected _onSelectFont(event: MouseEvent): void;

    /**
     * Define the setting key where this world's font information will be stored.
     */
    static SETTING: "fonts";

    /**
     * Get the list of fonts that successfully loaded.
     */
    static getAvailableFonts(): string[];

    /**
     * Get the list of fonts formatted for display with selectOptions.
     */
    static getAvailableFontChoices(): Record<string, string>;

    /**
     * Load a font definition.
     * @param family     - The font family name (case-sensitive).
     * @param definition - The font family definition.
     * @returns Returns true if the font was successfully loaded.
     */
    static loadFont(family: string, definition: CONFIG.Font.FamilyDefinition): Promise<boolean>;

    /**
     * Ensure that fonts have loaded and are ready for use.
     * Enforce a maximum timeout in milliseconds.
     * Proceed after that point even if fonts are not yet available.
     * @param ms -  The maximum time to spend loading fonts before proceeding.
     *              (default: `4500`)
     */
    protected static _loadFonts(ms?: number): Promise<void>;

    /**
     * Collect all the font definitions and combine them.
     */
    protected static _collectDefinitions(): Record<string, CONFIG.Font.FamilyDefinition>;

    /**
     * Create FontFace object from a FontDefinition.
     * @param family - The font family name.
     * @param font   - The font definition.
     */
    protected static _createFontFace(family: string, font: CONFIG.Font.Definition): FontFace;

    /**
     * Format a font definition for display.
     * @param family     - The font family.
     * @param definition - The font definition.
     */
    protected static _formatFont(family: string, definition: CONFIG.Font.Definition): string;
  }

  type NewFontDefinition = FontConfig.NewFontDefinition;

  namespace FontConfig {
    interface Any extends FontConfig<any> {}

    interface Options extends FormApplication.Options {}

    /**
     * @deprecated Replaced with {@linkcode FontConfig.Data}
     */
    type FontConfigData = Data;

    interface Data {
      fonts: { family: string; index: number; font: string }[];
      selected: { family: string; index: number } | null;
      family: string | undefined;
      weights: Array<{ value: foundry.CONST.FONT_WEIGHTS; label: string }>;
    }

    interface NewFontDefinition {
      /**
       * The font family.
       */
      family?: string;

      /**
       * The font weight.
       * @defaultValue `400`
       */
      weight?: number;

      /**
       * The font style.
       * @defaultValue `"normal"`
       */
      style?: string;

      /**
       * The font file
       * @defaultValue `""`
       */
      src?: string;

      /**
       * The text to preview the font.
       * @defaultValue `game.i18n.localize("FONTS.FontPreview")`
       */
      preview?: string;
    }
  }
}
