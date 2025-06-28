import type { DotKeys, Identity, InexactPartial } from "#utils";

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
   * @example
   * JavaScript class definition and localization call.
   * ```js
   * class MyDataModel extends foundry.abstract.DataModel {
   *   static defineSchema() {
   *     return {
   *       foo: new foundry.data.fields.StringField(),
   *       bar: new foundry.data.fields.NumberField()
   *     };
   *   }
   *   static LOCALIZATION_PREFIXES = ["MYMODULE.MYDATAMODEL"];
   * }
   *
   * Hooks.on("i18nInit", () => {
   *   Localization.localizeDataModel(MyDataModel);
   * });
   * ```
   *
   * JSON localization file
   * ```json
   * {
   *   "MYMODULE": {
   *     "MYDATAMODEL": {
   *       "FIELDS" : {
   *         "foo": {
   *           "label": "Foo",
   *           "hint": "Instructions for foo"
   *         },
   *         "bar": {
   *           "label": "Bar",
   *           "hint": "Instructions for bar"
   *         }
   *       }
   *     }
   *   }
   * }
   * ```
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

  /** @deprecated Made hard private in v13 (this warning will be removed in v14) */
  protected _discoverSupportedLanguages(): never;

  /** @deprecated Made hard private in v13 (this warning will be removed in v14) */
  protected _getTranslations(lang: never): never;

  /** @deprecated Made hard private in v13 (this warning will be removed in v14) */
  protected _filterLanguagePaths(pkg: never, lang: never): never;

  /** @deprecated Made hard private in v13 (this warning will be removed in v14) */
  protected _loadTranslationFile(src: never): never;

  /**
   * Return whether a certain string has a known translation defined.
   * @param stringId - The string key being translated
   * @param fallback - Allow fallback translations to count? (default: `true`)
   */
  has(stringId: string, fallback?: boolean): boolean;

  /**
   * Localize a string by drawing a translation from the available translations dictionary, if available
   * If a translation is not available, the original string is returned
   * @param stringId - The string ID to translate
   * @returns The translated string
   *
   * @example <caption>Localizing a simple string in JavaScript</caption>
   * ```typescript
   * {
   *   "MYMODULE.MYSTRING": "Hello, this is my module!"
   * }
   * game.i18n.localize("MYMODULE.MYSTRING"); // Hello, this is my module!
   * ```
   *
   * @example <caption>Localizing a simple string in Handlebars</caption>
   * ```handlebars
   * {{localize "MYMODULE.MYSTRING"}} <!-- Hello, this is my module! -->
   * ```
   */
  localize(stringId: string): string;

  /**
   * Localize a string including variable formatting for input arguments.
   * Provide a string ID which defines the localized template.
   * Variables can be included in the template enclosed in braces and will be substituted using those named keys.
   *
   * @param stringId - The string ID to translate
   * @param data     - Provided input data (default: `{}`)
   * @returns The translated and formatted string
   *
   * @example <caption>Localizing a formatted string in JavaScript</caption>
   * ```typescript
   * {
   *   "MYMODULE.GREETING": "Hello {name}, this is my module!"
   * }
   * game.i18n.format("MYMODULE.GREETING" {name: "Andrew"}); // Hello Andrew, this is my module!
   * ```
   *
   * @example <caption>Localizing a formatted string in Handlebars</caption>
   * ```handlebars
   * {{localize "MYMODULE.GREETING" name="Andrew"}} <!-- Hello, this is my module! -->
   * ```
   */
  format(stringId: string, data?: Record<string, string>): string;

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
}

declare namespace Localization {
  interface Any extends AnyLocalization {}
  interface AnyConstructor extends Identity<typeof AnyLocalization> {}

  interface Translations {
    [K: string]: string | Translations;
  }

  interface LocalizeDataModelOptions {
    /**
     * An array of localization key prefixes to use. If not specified, prefixes
     * are learned from the DataModel.LOCALIZATION_PREFIXES static property.
     */
    prefixes?: string[] | undefined;

    /**
     * A localization path prefix used to prefix all field names within this model. This is generally not required.
     */
    prefixPath?: string | undefined;
  }

  type _LocalizeSchemaOptions = InexactPartial<{
    /**
     * @defaultValue `new Set()`
     * @remarks Used for recursive calls, not intended to be passed externally
     */
    seenFields: Set<foundry.data.fields.DataField.Any>;
  }>;

  interface LocalizeSchemaOptions extends _LocalizeSchemaOptions, Pick<LocalizeDataModelOptions, "prefixPath"> {}

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
