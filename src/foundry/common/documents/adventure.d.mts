import type { AnyObject, Merge } from "../../../types/utils.mts";
import type { DataModel } from "../abstract/data.mts";
import type Document from "../abstract/document.mts";
import type { DocumentMetadata } from "../abstract/document.mts";
import type * as fields from "../data/fields.d.mts";

declare global {
  type AdventureData = BaseAdventure.Properties;
}

/**
 * The Document definition for an Adventure.
 * Defines the DataSchema and common behaviors for an Adventure which are shared between both client and server.
 */
declare class BaseAdventure extends Document<BaseAdventure.Schema, BaseAdventure.Metadata> {
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

  static override fromSource<Schema extends DataSchema>(
    source: fields.SchemaField.InnerAssignmentType<Schema>,
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
  ): foundry.abstract.DataModel<Schema, DataModel.Any | null>;

  static override migrateData(source: AnyObject): AnyObject;
}
export default BaseAdventure;

declare namespace BaseAdventure {
  type Metadata = Merge<
    DocumentMetadata,
    {
      name: "Adventure";
      collection: "adventures";
      compendiumIndexFields: ["_id", "name", "img", "sort", "folder"];
      label: string;
      labelPlural: string;
      schemaVersion: string;
    }
  >;

  type SchemaField = fields.SchemaField<Schema>;
  type ConstructorData = fields.SchemaField.InnerConstructorType<Schema>;
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
    actors: fields.SetField<fields.EmbeddedDataField<Actor.ConfiguredInstance>>;

    /**
     * An array of Combat documents which are included in the adventure
     * @defaultValue `new Set()`
     */
    combats: fields.SetField<fields.EmbeddedDataField<Combat.ConfiguredInstance>>;

    /**
     * An array of Item documents which are included in the adventure
     * @defaultValue `new Set()`
     */
    items: fields.SetField<fields.EmbeddedDataField<Item.ConfiguredInstance>>;

    /**
     * An array of JournalEntry documents which are included in the adventure
     * @defaultValue `new Set()`
     */
    journal: fields.SetField<fields.EmbeddedDataField<JournalEntry.ConfiguredInstance>>;

    /**
     * An array of Scene documents which are included in the adventure
     * @defaultValue `new Set()`
     */
    scenes: fields.SetField<fields.EmbeddedDataField<Scene.ConfiguredInstance>>;

    /**
     * An array of RollTable documents which are included in the adventure
     * @defaultValue `new Set()`
     */
    tables: fields.SetField<fields.EmbeddedDataField<RollTable.ConfiguredInstance>>;

    /**
     * An array of Macro documents which are included in the adventure
     * @defaultValue `new Set()`
     */
    macros: fields.SetField<fields.EmbeddedDataField<Macro.ConfiguredInstance>>;

    /**
     * An array of Cards documents which are included in the adventure
     * @defaultValue `new Set()`
     */
    cards: fields.SetField<fields.EmbeddedDataField<Cards.ConfiguredInstance>>;

    /**
     * An array of Playlist documents which are included in the adventure
     * @defaultValue `new Set()`
     */
    playlists: fields.SetField<fields.EmbeddedDataField<Playlist.ConfiguredInstance>>;

    /**
     * An array of Folder documents which are included in the adventure
     * @defaultValue `new Set()`
     */
    folders: fields.SetField<fields.EmbeddedDataField<Folder.ConfiguredInstance>>;

    folder: fields.ForeignDocumentField<Folder.ConfiguredInstance>;

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
        ? ModelType extends typeof Document // TODO: This doesn't seem to quite work to ensure it's the configured class
          ? ModelType["implementation"]
          : ModelType
        : never
      : never;
  };
}
