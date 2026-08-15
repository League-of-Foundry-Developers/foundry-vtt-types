import type { DeepPartial, Identity, MaybePromise } from "#utils";
import type CategoryBrowser from "../../api/category-browser.d.mts";
import type { Document } from "#common/abstract/_module.d.mts";
import type { fields } from "#client/data/_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      DefaultSheetsConfig: DefaultSheetsConfig.Any;
    }
  }
}

declare class DefaultSheetsConfig<
  Entry extends DefaultSheetsConfig.Entry = DefaultSheetsConfig.Entry,
  RenderContext extends DefaultSheetsConfig.RenderContext<Entry> = DefaultSheetsConfig.RenderContext<Entry>,
  Configuration extends DefaultSheetsConfig.Configuration = DefaultSheetsConfig.Configuration,
  RenderOptions extends DefaultSheetsConfig.RenderOptions = DefaultSheetsConfig.RenderOptions,
> extends CategoryBrowser<Entry, RenderContext, Configuration, RenderOptions> {
  static override DEFAULT_OPTIONS: DefaultSheetsConfig.DefaultOptions;

  /**
   * The Default Sheets setting name
   * @remarks This is mutable at runtime, but Foundry types it as the literal, and it is not intended to ever change.
   */
  static SETTING: "sheetClasses";

  /**
   * The "sheetClasses" Setting field
   */
  static get SCHEMA(): DefaultSheetsConfig.SettingField;

  /**
   * Register the "sheetClasses" Setting and this menu application.
   *
   * @remarks Does nothing outside a game view, so the setting is absent on the setup and join screens.
   */
  static registerSetting(): void;

  /**
   * @remarks Only document types that carry type data get a category, and a type whose only sheet is
   * the sole default is omitted.
   *
   * @privateRemarks Synchronous at runtime; kept as the base's `MaybePromise` return so subclasses
   * may remain asynchronous.
   */
  protected override _prepareCategoryData(): MaybePromise<Record<string, CategoryBrowser.CategoryData<Entry>>>;

  static #DefaultSheetsConfig: true;
}

declare namespace DefaultSheetsConfig {
  interface Any extends AnyDefaultSheetsConfig {}
  interface AnyConstructor extends Identity<typeof AnyDefaultSheetsConfig> {}

  /**
   * All document types with configurable default sheets
   * @remarks The exclusions are hard-coded to mirror the private static `DefaultSheetsConfig.#DOCUMENT_TYPES`.
   */
  type DefaultSheetDocument = Exclude<
    Document.Type,
    "ActorDelta" | "ChatMessage" | "FogExploration" | "JournalEntryCategory" | "Setting"
  >;

  /** @internal */
  type _DocTOF = fields.TypedObjectField<
    fields.StringField<{ required: true; nullable: true; blank: false; initial: null }>
  >;

  interface Schema extends Record<DefaultSheetDocument, _DocTOF>, fields.DataSchema {}

  type SettingField = fields.SchemaField<DefaultSheetsConfig.Schema>;

  interface SettingData extends fields.SchemaField.InitializedData<Schema> {}

  interface Entry {
    /** @remarks `${documentName}-${subtype}`. */
    id: string;

    /** @remarks `${documentName}.${subtype}`, the form field name this entry submits under. */
    name: string;

    label: string;

    /**
     * @remarks The empty string while the subtype still follows its default sheet, which is how an
     * unaltered `sheetClasses` entry stays `null`.
     */
    value: string;

    choices: Record<string, string>;
  }

  interface RenderContext<Entry extends DefaultSheetsConfig.Entry> extends CategoryBrowser.RenderContext<Entry> {}

  interface Configuration extends CategoryBrowser.Configuration {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions = DeepPartial<Configuration> & object;

  interface RenderOptions extends CategoryBrowser.RenderOptions {}
}

declare abstract class AnyDefaultSheetsConfig extends DefaultSheetsConfig<
  DefaultSheetsConfig.Entry,
  DefaultSheetsConfig.RenderContext<DefaultSheetsConfig.Entry>,
  DefaultSheetsConfig.Configuration,
  DefaultSheetsConfig.RenderOptions
> {
  constructor(...args: never);
}

export default DefaultSheetsConfig;
