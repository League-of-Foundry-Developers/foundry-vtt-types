// FOUNDRY_VERSION: 10.291

import type { Merge } from "../../../types/utils.mts";
import type DataModel from "../abstract/data.mts";
import type Document from "../abstract/document.mts";
import type { DocumentMetadata } from "../abstract/document.mts";
import type * as fields from "../data/fields.mts";
import type * as documents from "./module.mts";

declare global {
  type AdventureData = BaseAdventure.Properties;
}

/**
 * The Document definition for an Adventure.
 * Defines the DataSchema and common behaviors for an Adventure which are shared between both client and server.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface BaseAdventure extends BaseAdventure.Properties {}
declare class BaseAdventure extends Document<BaseAdventure.SchemaField, BaseAdventure.Metadata> {
  /**
   * @param data    - Initial data from which to construct the Actor
   * @param context - Construction context options
   */
  constructor(data: BaseAdventure.ConstructorData, context?: DocumentConstructionContext);

  static override metadata: Readonly<BaseAdventure.Metadata>;

  static override defineSchema(): BaseAdventure.Schema;

  /**
   * An array of the fields which provide imported content from the Adventure.
   */
  static get contentFields(): BaseAdventure.ContentFields;

  /**
   * Provide a thumbnail image path used to represent the Adventure document.
   */
  get thumbnail(): string;

  static override fromSource<SchemaField extends fields.SchemaField.Any>(
    source: fields.SchemaField.InnerAssignmentType<SchemaField["fields"]>,
    {
      strict,
      ...context
    }?: DataModel.ConstructorOptions<null> & {
      /**
       * Models created from trusted source data are validated non-strictly
       * @defaultValue `false`
       */
      strict?: boolean;
    },
  ): DataModel<SchemaField, DataModel.Any | null>;

  static override migrateData(source: object): object;
}
export default BaseAdventure;

declare namespace BaseAdventure {
  type Metadata = Merge<
    DocumentMetadata,
    {
      name: "Adventure";
      collection: "adventures";
      compendiumIndexFields: ["_id", "name", "img", "sort", "folder"];
      label: "DOCUMENT.Adventure";
      labelPlural: "DOCUMENT.Adventures";
    }
  >;

  type SchemaField = fields.SchemaField<Schema>;
  type ConstructorData = UpdateData & Required<Pick<UpdateData, "name">>;
  type UpdateData = fields.SchemaField.InnerAssignmentType<Schema>;
  type Properties = fields.SchemaField.InnerInitializedType<Schema>;
  type Source = fields.SchemaField.InnerPersistedType<Schema>;

  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this Adventure document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * The human-readable name of the Adventure
     */
    name: fields.StringField<{
      required: true;
      blank: false;
      label: "ADVENTURE.Name";
      hint: "ADVENTURE.NameHint";
      textSearch: true;
    }>;

    /**
     * The file path for the primary image of the adventure
     * @defaultValue `null`
     */
    img: fields.FilePathField<{ categories: ["IMAGE"]; label: "ADVENTURE.Image"; hint: "ADVENTURE.ImageHint" }>;

    /**
     * A string caption displayed under the primary image banner
     * @defaultValue `""`
     */
    caption: fields.HTMLField<{ label: "ADVENTURE.Caption"; hint: "ADVENTURE.CaptionHint" }>;

    /**
     * An HTML text description for the adventure
     * @defaultValue `""`
     */
    description: fields.HTMLField<{
      label: "ADVENTURE.Description";
      hint: "ADVENTURE.DescriptionHint";
      textSearch: true;
    }>;

    /**
     * An array of Actor documents which are included in the adventure
     * @defaultValue `new Set()`
     */
    actors: fields.SetField<fields.EmbeddedDataField<documents.BaseActor>>;

    /**
     * An array of Combat documents which are included in the adventure
     * @defaultValue `new Set()`
     */
    combats: fields.SetField<fields.EmbeddedDataField<documents.BaseCombat>>;

    /**
     * An array of Item documents which are included in the adventure
     * @defaultValue `new Set()`
     */
    items: fields.SetField<fields.EmbeddedDataField<documents.BaseItem>>;

    /**
     * An array of JournalEntry documents which are included in the adventure
     * @defaultValue `new Set()`
     */
    journal: fields.SetField<fields.EmbeddedDataField<documents.BaseJournalEntry>>;

    /**
     * An array of Scene documents which are included in the adventure
     * @defaultValue `new Set()`
     */
    scenes: fields.SetField<fields.EmbeddedDataField<documents.BaseScene>>;

    /**
     * An array of RollTable documents which are included in the adventure
     * @defaultValue `new Set()`
     */
    tables: fields.SetField<fields.EmbeddedDataField<documents.BaseRollTable>>;

    /**
     * An array of Macro documents which are included in the adventure
     * @defaultValue `new Set()`
     */
    macros: fields.SetField<fields.EmbeddedDataField<documents.BaseMacro>>;

    /**
     * An array of Cards documents which are included in the adventure
     * @defaultValue `new Set()`
     */
    cards: fields.SetField<fields.EmbeddedDataField<documents.BaseCards>>;

    /**
     * An array of Playlist documents which are included in the adventure
     * @defaultValue `new Set()`
     */
    playlists: fields.SetField<fields.EmbeddedDataField<documents.BasePlaylist>>;

    /**
     * An array of Folder documents which are included in the adventure
     * @defaultValue `new Set()`
     */
    folders: fields.SetField<fields.EmbeddedDataField<documents.BaseFolder>>;

    folder: fields.ForeignDocumentField<documents.BaseFolder>;

    /**
     * The sort order of this adventure relative to its siblings
     * @defaultValue `0`
     */
    sort: fields.IntegerSortField;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: fields.ObjectField.FlagsField<"Adventure">;

    /**
     * An object of creation and access information
     * @defaultValue see {@link fields.DocumentStatsField}
     */
    _stats: fields.DocumentStatsField;
  }

  /**
   * A helper type to extract the return value for {@link BaseAdventure.contentFields}
   */
  type ContentFields = {
    [Key in keyof BaseAdventure.Schema as BaseAdventure.Schema[Key] extends fields.SetField.Any
      ? Key
      : never]: BaseAdventure.Schema[Key] extends fields.SetField<infer ElementType, any, any, any, any, any, any, any>
      ? ElementType extends fields.EmbeddedDataField<infer ModelType, any, any, any, any>
        ? ModelType
        : never
      : never;
  };
}
