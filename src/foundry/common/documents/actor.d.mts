import type { AnyObject, Merge } from "../../../types/utils.mts";
import type Document from "../abstract/document.mts";
import type { DocumentMetadata } from "../abstract/document.mts";
import type { PrototypeToken } from "../data/data.mts";
import type * as fields from "../data/fields.d.mts";
import type * as documents from "./_module.d.mts";

declare global {
  type ActorData = BaseActor.Properties;
}

declare namespace BaseActor {
  type TypeNames = fields.TypeDataField.TypeNames<typeof BaseActor>;

  type Metadata = Merge<
    DocumentMetadata,
    {
      name: "Actor";
      collection: "actors";
      indexed: true;
      compendiumIndexFields: ["_id", "name", "img", "type", "sort", "folder"];
      embedded: { ActiveEffect: "effects"; Item: "items" };
      label: string;
      labelPlural: string;
      permissions: {
        create: (user: documents.BaseUser, doc: Document.Any) => boolean;
        update: (user: documents.BaseUser, doc: Document.Any, data: UpdateData) => boolean;
      };
      schemaVersion: string;

      /**
       * @deprecated since v10, BaseActor.metadata.types is deprecated since v10 in favor of BaseActor.TYPES.
       */
      types: typeof BaseActor.TYPES;
    }
  >;

  type SchemaField = fields.SchemaField<Schema>;
  type ConstructorData = fields.SchemaField.InnerConstructorType<Schema>;
  type UpdateData = fields.SchemaField.InnerAssignmentType<Schema>;
  type Properties = fields.SchemaField.InnerInitializedType<Schema>;
  type Source = fields.SchemaField.InnerPersistedType<Schema>;

  interface Schema<TypeName extends TypeNames = TypeNames> extends DataSchema {
    /**
     * The _id which uniquely identifies this Actor document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /** The name of this Actor */
    name: fields.StringField<{ required: true; blank: false; textSearch: true }>;

    /** An Actor subtype which configures the system data model applied */
    type: fields.StringField<
      {
        required: true;
        choices: () => typeof BaseActor.TYPES;
        validationError: "must be in the array of Actor types defined by the game system";
      },
      TypeName,
      TypeName,
      TypeName
    >;

    /**
     * An image file path which provides the artwork for this Actor
     * @defaultValue `null`
     */
    img: fields.FilePathField<{ categories: "IMAGE"[]; initial: () => typeof BaseActor.DEFAULT_ICON }>;

    /**
     * The system data object which is defined by the system template.json model
     * @defaultValue `{}`
     */
    system: fields.TypeDataField<typeof BaseActor>;

    /**
     * Default Token settings which are used for Tokens created from this Actor
     * @defaultValue see {@link PrototypeToken}
     */
    prototypeToken: fields.EmbeddedDataField<PrototypeToken>;

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
    folder: fields.ForeignDocumentField<documents.BaseFolder>;

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

/**
 * The Document definition for an Actor.
 * Defines the DataSchema and common behaviors for an Actor which are shared between both client and server.
 */
declare class BaseActor extends Document<BaseActor.Schema, BaseActor.Metadata> {
  /**
   * @param data    - Initial data from which to construct the Actor
   * @param context - Construction context options
   */
  constructor(data: BaseActor.ConstructorData, context?: DocumentConstructionContext);

  static override metadata: Readonly<BaseActor.Metadata>;

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

  /**
   * The allowed set of Actor types which may exist.
   */
  static get TYPES(): BaseActor.TypeNames[];

  protected override _initializeSource(
    data: fields.SchemaField.InnerAssignmentType<documents.BaseActor.Schema> | this,
    options?: any,
  ): fields.SchemaField.InnerPersistedType<documents.BaseActor.Schema>;

  static override canUserCreate(user: documents.BaseUser): boolean;

  /**
   * Is a user able to create this actor?
   * @param user - The user attempting the creation operation.
   * @param doc  - The Actor being created.
   * @internal
   */
  static #canCreate(user: documents.BaseUser, doc: BaseActor): boolean;

  /**
   * Is a user able to update an existing actor?
   * @param user - The user attempting the update operation.
   * @param doc  - The Actor being updated.
   * @param data - The update delta being applied.
   * @internal
   */
  static #canUpdate(user: documents.BaseUser, doc: BaseActor, data: BaseActor.UpdateData): boolean;

  /**
   * @privateRemarks _preCreate and _preUpdate are overridden but with no signature changes.
   * For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.
   */

  static override migrateData(source: AnyObject): AnyObject;

  static override shimData(
    data: AnyObject,
    options?: {
      /**
       * Apply shims to embedded models?
       * @defaultValue `true`
       */
      embedded?: boolean;
    },
  ): AnyObject;
}

export default BaseActor;
