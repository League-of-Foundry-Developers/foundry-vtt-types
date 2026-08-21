import type { AnyObject, DotKeys, Identity, InexactPartial } from "#utils";

/**
 * A helper class which assists with localization and string translation
 */
declare class Localization {
  /**
   * @param serverLanguage - The default language configuration setting for the server
   */
  constructor(serverLanguage?: string);

  /**
   * The target language for localization
   * @defaultValue `"en"`
   */
  lang: string;

  /**
   * The package authorized to provide default language configurations
   * @defaultValue `"core"`
   */
  defaultModule: string;

  /**
   * The translation dictionary for the target language
   * @defaultValue `{}`
   */
  translations: Localization.Translations;

  /**
   * Fallback translations if the target keys are not found
   * @internal
   * @defaultValue `{}`
   */
  protected _fallback: Localization.Translations;

  /**
   * A reusable PluralRules instance
   */
  get pluralRules(): Intl.PluralRules;

  /**
   * Initialize the Localization module
   * Discover available language translations and apply the current language setting
   * @returns A Promise which resolves once languages are initialized
   */
  initialize(): Promise<void>;

  /**
   * Perform one-time localization of the fields in a DataModel schema, translating their label and hint properties.
   * @param model   - The DataModel class to localize
   * @param options - Options which configure how localization is performed
   *
   * @see {@linkcode foundry.abstract.DataModel.LOCALIZATION_PREFIXES} for an example of the class definition and
   * localization file structure.
   */
  static localizeDataModel(
    model: foundry.abstract.DataModel.AnyConstructor,
    options?: Localization.LocalizeDataModelOptions,
  ): void;

  /**
   * Localize the "label" and "hint" properties for all fields in a data schema.
   */
  static localizeSchema(
    schema: foundry.data.fields.SchemaField.Any,

    /** @defaultValue `[]` */
    prefixes?: string[],
    options?: Localization.LocalizeSchemaOptions,
  ): void;

  /**
   * Set a language as the active translation source for the session
   * @param lang - A language string in CONFIG.supportedLanguages
   * @returns A Promise which resolves once the translations for the requested language are ready
   */
  setLanguage(lang: string): Promise<void>;

  /**
   * Return whether a certain string has a known translation defined.
   * @param stringId - The string key being translated
   * @param fallback - Allow fallback translations to count? (default: `true`)
   */
  has(stringId: string, fallback?: boolean): boolean;

  /**
   * Localize a string by drawing a translation from the available translations dictionary, if available. Variables can
   * be included in the template enclosed in curly braces and will be substituted using those named keys.
   * @param stringId - The string ID to translate
   * @param data     - Data for variable formating: values can be anything meaningfully stringifiable.
   * @returns The translated string, if a translation was found, or else the inputted stringId
   *
   * @example Localizing a simple string in JavaScript
   * ```js
   * {
   *   "MYMODULE.MYSTRING": "Hello, this is my module!"
   * }
   * _loc("MYMODULE.MYSTRING"); // Hello, this is my module!
   * ```
   * @example Localizing a formatted string in JavaScript
   * ```js
   * {
   *   "MYMODULE.GREETING": "Hello {name}, this is my module!"
   * }
   * _loc("MYMODULE.GREETING" {name: "Andrew"}); // Hello Andrew, this is my module!
   * ```
   *
   * @example Localizing a simple string in Handlebars
   * ```hbs
   * {{localize "MYMODULE.MYSTRING"}} <!-- Hello, this is my module! -->
   *
   * ```
   * @example Localizing a formatted string in Handlebars
   * ```hbs
   * {{localize "MYMODULE.GREETING" name="Andrew"}} <!-- Hello, this is my module! -->
   * ```
   */
  localize(stringId: string, data?: AnyObject): string;

  /**
   * @remarks An alias of {@linkcode Localization.localize | Localization#localize}, which took over variable
   * formatting in v14.
   * @privateRemarks Not declared in the class body; assigned to the prototype by `Object.defineProperties`.
   */
  format(stringId: string, data?: AnyObject): string;

  /**
   * Retrieve list formatter configured to the world's language setting.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/ListFormat/ListFormat | Intl.ListFormat}
   */
  getListFormatter(options?: Localization.GetListFormatterOptions): Intl.ListFormat;

  /**
   * Sort an array of objects by a given key in a localization-aware manner.
   * @param objects - The objects to sort, this array will be mutated
   * @param key     - The key to sort the objects by. This can be provided in dot-notation.
   */
  sortObjects<T extends object>(objects: Array<T>, key: DotKeys<T>): T[];

  #Localization: true;

  static #LocalizationStatic: true;
}

declare namespace Localization {
  interface Any extends AnyLocalization {}
  interface AnyConstructor extends Identity<typeof AnyLocalization> {}

  interface Translations {
    [K: string]: string | Translations;
  }

  /** @internal */
  interface _PrefixPathOptions {
    /**
     * A localization path prefix used to prefix all field names within this model. This is generally not required.
     * @defaultValue `""`
     */
    prefixPath?: string | undefined;
  }

  interface LocalizeDataModelOptions extends _PrefixPathOptions {
    /**
     * An array of localization key prefixes to use. If not specified, prefixes
     * are learned from the DataModel.LOCALIZATION_PREFIXES static property.
     */
    prefixes?: string[] | undefined;
  }

  /** @internal */
  interface _LocalizeSchemaOptions {
    /**
     * @defaultValue `new Set()`
     * @remarks Used for recursive calls, not intended to be passed externally
     */
    seenFields: Set<foundry.data.fields.DataField.Any>;
  }

  interface LocalizeSchemaOptions extends InexactPartial<_LocalizeSchemaOptions>, _PrefixPathOptions {}

  interface GetListFormatterOptions {
    /**
     * The list formatter style, either "long", "short", or "narrow".
     * @defaultValue `"long"`
     */
    style?: Intl.ListFormatStyle | undefined;

    /**
     * The list formatter type, either "conjunction", "disjunction", or "unit".
     * @defaultValue `"conjunction"`
     */
    type?: Intl.ListFormatType | undefined;
  }
}

export default Localization;

declare abstract class AnyLocalization extends Localization {
  constructor(...args: never);
}
