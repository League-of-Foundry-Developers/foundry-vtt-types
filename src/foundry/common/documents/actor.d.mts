import type { AnyObject } from "fvtt-types/utils";
import type Document from "../abstract/document.mts";
import type { PrototypeToken } from "../data/data.mts";
import type * as fields from "../data/fields.d.mts";
import type * as documents from "./_module.d.mts";

type DataSchema = foundry.data.fields.DataSchema;

/**
 * The Actor Document.
 * Defines the DataSchema and common behaviors for an Actor which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare class BaseActor extends Document<"Actor", BaseActor.Schema, any> {
  /**
   * @privateRemarks Manual override of the return due to TS limitations with static `this`
   */
  static get TYPES(): BaseActor.TypeNames[];

  /**
   * @param data    - Initial data from which to construct the Actor
   * @param context - Construction context options
   */
  // TODO(LukeAbby): This constructor is causing a circular error.
  // constructor(data: BaseActor.ConstructorData, context?: Document.ConstructionContext<BaseActor.Parent>);

  override parent: BaseActor.Parent;

  static override metadata: BaseActor.Metadata;

  static override defineSchema(): BaseActor.Schema;

  /**
   * The default icon used for newly created Actor documents.
   * @defaultValue `CONST.DEFAULT_TOKEN`
   */
  static DEFAULT_ICON: string;

  /**
   * Determine default artwork based on the provided actor data
   * @param actorData - The source actor data
   */
  static getDefaultArtwork(actorData: BaseActor.ConstructorData): {
    img: string;
    texture: { src: string };
  };

  protected override _initializeSource(
    data: BaseActor.ConstructorData | this,
    options?: Omit<foundry.abstract.DataModel.DataValidationOptions, "parent">,
  ): BaseActor.Source;

  static override canUserCreate(user: User): boolean;

  /**
   * @privateRemarks _preCreate and _preUpdate are overridden but with no signature changes.
   * For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.
   */

  static override migrateData(source: AnyObject): AnyObject;

  #baseActor: true;
}

declare namespace BaseActor {
  type Parent = null;

  type TypeNames = Game.Model.TypeNames<"Actor">;

  type Metadata = Document.MetadataFor<BaseActor>;

  type SchemaField = fields.SchemaField<Schema>;
  type ConstructorData = fields.SchemaField.InnerConstructorType<Schema>;
  type UpdateData = fields.SchemaField.InnerAssignmentType<Schema>;
  type Properties = fields.SchemaField.InnerInitializedType<Schema>;
  type Source = fields.SchemaField.InnerPersistedType<Schema>;

  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this Actor document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /** The name of this Actor */
    name: fields.StringField<{ required: true; blank: false; textSearch: true }>;

    /** An Actor subtype which configures the system data model applied */
    type: fields.DocumentTypeField<typeof BaseActor>;

    /**
     * An image file path which provides the artwork for this Actor
     * @defaultValue `null`
     */
    img: fields.FilePathField<{ categories: "IMAGE"[]; initial: (data: unknown) => string }>;

    /**
     * The system data object which is defined by the system template.json model
     * @defaultValue `{}`
     */
    system: fields.TypeDataField<typeof BaseActor>;

    /**
     * Default Token settings which are used for Tokens created from this Actor
     * @defaultValue see {@link PrototypeToken}
     */
    prototypeToken: fields.EmbeddedDataField<typeof PrototypeToken>;

    /**
     * A Collection of Item embedded Documents
     * @defaultValue `[]`
     */
    items: fields.EmbeddedCollectionField<typeof documents.BaseItem, Actor.ConfiguredInstance>;

    /**
     * A Collection of ActiveEffect embedded Documents
     * @defaultValue `[]`
     */
    effects: fields.EmbeddedCollectionField<typeof documents.BaseActiveEffect, Actor.ConfiguredInstance>;

    /**
     * The _id of a Folder which contains this Actor
     * @defaultValue `null`
     */
    folder: fields.ForeignDocumentField<typeof documents.BaseFolder>;

    /**
     * The numeric sort value which orders this Actor relative to its siblings
     * @defaultValue `0`
     */
    sort: fields.IntegerSortField;

    /**
     * An object which configures ownership of this Actor
     * @defaultValue `{ default: DOCUMENT_OWNERSHIP_LEVELS.NONE }`
     */
    ownership: fields.DocumentOwnershipField;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: fields.ObjectField.FlagsField<"Actor">;

    /**
     * An object of creation and access information
     * @defaultValue see {@link fields.DocumentStatsField}
     */
    _stats: fields.DocumentStatsField;
  }
}

export default BaseActor;
