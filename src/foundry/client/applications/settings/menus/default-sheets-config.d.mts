import type { StringField } from "#common/data/fields.mjs";
import type { Identity } from "#utils";
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
  /**
   * The Default Sheets setting name
   * @remarks Foundry does nothing to make this readonly, but they do type is as the literal and it's clearly assumed not to change.
   */
  static SETTING: "sheetClasses";

  /**
   * The "sheetClasses" Setting field
   */
  static get SCHEMA(): DefaultSheetsConfig.SettingField;

  /**
   * Register the "sheetClasses" Setting and this menu application.
   */
  static registerSetting(): void;

  protected override _prepareCategoryData(): Promise<Record<string, CategoryBrowser.CategoryData<Entry>>>;

  static #DefaultSheetsConfig: true;
}

declare namespace DefaultSheetsConfig {
  interface Any extends AnyDefaultSheetsConfig {}
  interface AnyConstructor extends Identity<typeof AnyDefaultSheetsConfig> {}

  /**
   * All document types with configurable default sheets
   * @remarks The exceptions here are hard-coded and stored in the `DefaultSheetsConfig.#DOCUMENT_TYPES` private static property.
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
    field: StringField;
    choices: Record<string, string>;
    value: string;
  }

  interface RenderContext<Entry extends DefaultSheetsConfig.Entry> extends CategoryBrowser.RenderContext<Entry> {}
  interface Configuration extends CategoryBrowser.Configuration {}
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
