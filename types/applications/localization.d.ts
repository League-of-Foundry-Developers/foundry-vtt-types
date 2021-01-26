/**
 * A helper class which assists with localization and string translation
 */
declare class Localization {
  constructor(language: string);

  /**
   * The target language for localization
   * @defaultValue `'en'`
   */
  lang: string;

  /**
   * The package authorized to provide default language configurations
   * @defaultValue `'core'`
   */
  defaultModule: string;

  /**
   * The translation dictionary for the target language
   * @defaultValue `{}`
   */
  translations: Record<string, string>;

  /**
   * Fallback translations if the target keys are not found
   * @defaultValue `{}`
   */
  _fallback: Record<string, string>;

  /* -------------------------------------------- */

  /**
   * Initialize the Localization module
   * Discover available language translations and apply the current language setting
   * @returns A Promise which resolves once languages are initialized
   */
  initialize(): Promise<void>;

  /* -------------------------------------------- */

  /**
   * Set a language as the active translation source for the session
   * @param lang - A language string in CONFIG.supportedLanguages
   * @returns A Promise which resolves once the translations for the requested language are ready
   */
  setLanguage(lang: string): Promise<void>;

  /* -------------------------------------------- */

  /**
   * Discover the available supported languages from the set of packages which are provided
   * @internal
   */
  _discoverSupportedLanguages(): void;

  /* -------------------------------------------- */

  /**
   * Prepare the dictionary of translation strings for the requested language
   * @param lang - The language for which to load translations
   * @returns The retrieved translations object
   * @internal
   */
  _getTranslations(lang: string): Promise<Record<string, string>>;

  /* -------------------------------------------- */

  /**
   * Load a single translation file and return its contents as processed JSON
   * @param src - The translation file path to load
   * @internal
   */
  _loadTranslationFile(src: string): Promise<object>;

  /* -------------------------------------------- */
  /*  Localization API                            */
  /* -------------------------------------------- */

  /**
   * Return whether a certain string has a known translation defined.
   * @param stringId - The string key being translated
   * @param fallback - Allow fallback translations to count?
   *                   (unused)
   */
  has(stringId: string, fallback?: any): boolean;

  /* -------------------------------------------- */

  /**
   * Localize a string by drawing a translation from the available translations dictionary, if available
   * If a translation is not available, the original string is returned
   * @param stringId - The string ID to translate
   * @returns The translated string
   *
   * @example
   * ```typescript
   * {
   *   "MYMODULE.MYSTRING": "Hello, this is my module!"
   * }
   * game.i18n.localize("MYMODULE.MYSTRING"); // Hello, this is my module!
   * ```
   */
  localize(stringId: string): string;

  /* -------------------------------------------- */

  /**
   * Localize a string including variable formatting for input arguments.
   * Provide a string ID which defines the localized template.
   * Variables can be included in the template enclosed in braces and will be substituted using those named keys.
   *
   * @param stringId - The string ID to translate
   * @param data     - Provided input data
   * @returns The translated and formatted string
   *
   * @example
   * ```typescript
   * {
   *   "MYMODULE.GREETING": "Hello {name}, this is my module!"
   * }
   * game.i18n.format("MYMODULE.GREETING", {name: "Andrew"}); // Hello Andrew, this is my module!
   * ```
   */
  format(stringId: string, data: Record<string, any>): string;
}
