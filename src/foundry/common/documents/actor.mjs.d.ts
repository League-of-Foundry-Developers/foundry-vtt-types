import type { DataModel, DataSchema } from '../abstract/data.mjs';
import { DocumentMetadata, DocumentModificationOptions } from '../abstract/document.mjs';
import BaseUser from './user.mjs';
import Document from '../abstract/document.mjs';
import * as documents from './module.mjs';
import * as fields from '../data/fields.mjs';
import type { DocumentStatsSchema, PrototypeToken } from '../data/data.mjs';
import type { FlagsField } from '../data/flagsField';
import type { ConfiguredDocumentClass } from '../../../types/helperTypes.js';

interface BaseActorSchema extends DataSchema {
  /**
   * The _id which uniquely identifies this Actor document
   */
  _id: fields.DocumentIdField<{}>;

  /**
   * The name of this Actor
   */
  name: fields.StringField<{ required: true; blank: false }>;

  /**
   * An Actor subtype which configures the system data model applied
   */
  type: fields.StringField<{
    required: true;
    choices: () => typeof BaseActor.TYPES;
    validationError: 'must be in the array of Actor types defined by the game system';
  }>;

  /**
   * An image file path which provides the artwork for this Actor
   */
  img: fields.FilePathField<{ categories: ['IMAGE']; initial: () => typeof BaseActor.DEFAULT_ICON }>;

  /**
   * The system data object which is defined by the system template.json model
   */
  system: fields.SystemDataField<typeof BaseActor, {}>;

  /**
   * Default Token settings which are used for Tokens created from this Actor
   */
  prototypeToken: fields.EmbeddedDataField<typeof PrototypeToken, {}>;

  // TODO causes circularly references
  /**
   * A Collection of Item embedded Documents
   */
  //   items: fields.EmbeddedCollectionField<typeof documents.BaseItem, {}>;

  /**
   * A Collection of ActiveEffect embedded Documents
   */
  effects: fields.EmbeddedCollectionField<typeof documents.BaseActiveEffect, {}>;

  /**
   * The _id of a Folder which contains this Actor
   */
  folder: fields.ForeignDocumentField<typeof documents.BaseFolder, {}>;

  /**
   * The numeric sort value which orders this Actor relative to its siblings
   */
  sort: typeof documents.BaseFolder.SORT_FIELD;

  /**
   * An object which configures ownership of this Actor
   */
  ownership: fields.DocumentOwnershipField<{}>;

  /**
   * An object of optional key/value flags
   */
  flags: FlagsField<'Actor', {}>;

  /**
   * An object of creation and access information.
   */
  _stats: typeof DocumentStatsSchema;
}

type BaseActorMetadata = Merge<
  DocumentMetadata,
  {
    name: 'Actor';
    collection: 'actors';
    compendiumIndexFields: ['_id', 'name', 'img', 'type', 'sort'];
    embedded: { ActiveEffect: 'effects'; Item: 'items' };
    label: 'DOCUMENT.Actor';
    labelPlural: 'DOCUMENT.Actors';
    permissions: {
      create: CanCreate;
      update: CanUpdate;
    };

    types: string[];
  }
>;

type BaseActorShims = {
  /**
   * Rename data to system
   * @deprecated since v10
   */
  //   data: BaseActor['system'];

  /**
   * Rename permission to ownership
   * @deprecated since v10
   */
  permission: BaseActor['ownership'];

  /**
   * Prototype token migration
   * @deprecated since v10
   */
  token: BaseActor['prototypeToken'];
};

type CanCreate = (user: BaseUser, doc: BaseActor) => boolean;

type CanUpdate = (
  user: BaseUser,
  doc: BaseActor,
  data: DeepPartial<DataModel.SchemaToSource<BaseActor['schema']>>
) => boolean;

/**
 * The base Actor model definition which defines common behavior of an Actor document between both client and server.
 */
declare class BaseActor extends Document<
  BaseActorSchema,
  InstanceType<ConfiguredDocumentClass<typeof documents.BaseToken>>,
  BaseActorMetadata,
  BaseActorShims
> {
  /* -------------------------------------------- */
  /*  Model Configuration                         */
  /* -------------------------------------------- */

  /** {@inheritdoc} */
  static override get metadata(): BaseActorMetadata;

  /** {@inheritdoc} */
  static override defineSchema(): BaseActorSchema;

  /* ---------------------------------------- */

  /**
   * The default icon used for newly created Actor documents.
   * (initialized: `typeof CONST.DEFAULT_TOKEN`)
   */
  static DEFAULT_ICON: string;

  /* ---------------------------------------- */

  /**
   * The allowed set of Actor types which may exist.
   * (initialized: `game.documentTypes?.Actor || []`)
   */
  static get TYPES(): string[];

  /* ---------------------------------------- */

  /** {@inheritdoc} */
  protected override _initializeSource(
    data: DataModel.SchemaToSourceInput<this['schema']>,
    options?: object
  ): DataModel.SchemaToSource<this['schema']>;

  /* -------------------------------------------- */

  /** {@inheritdoc} */
  static canUserCreate(user: BaseUser): boolean;

  /**
   * Is a user able to create this actor?
   * @param user - The user attempting the creation operation.
   * @param doc - The Actor being created.
   */
  #canCreate: CanCreate;

  /* -------------------------------------------- */

  /**
   * Is a user able to update an existing actor?
   * @param user - The user attempting the update operation.
   * @param doc  - The Actor being updated.
   * @param data - The update delta being applied.
   */
  #canUpdate: CanUpdate;

  protected override _preCreate(
    data: DataModel.SchemaToSourceInput<BaseActorSchema>,
    options: DocumentModificationOptions,
    user: BaseUser
  ): Promise<void>;

  protected override _preUpdate(
    changed: DataModel.SchemaToSourceInput<BaseActorSchema>,
    options: DocumentModificationOptions,
    user: BaseUser
  ): Promise<void>;

  /* -------------------------------------------- */
  /*  Deprecations and Compatibility              */
  /* -------------------------------------------- */

  /** {@inheritdoc} */
  static override migrateData(data: Record<string, unknown>): Record<string, unknown>;

  /** {@inheritdoc} */
  static override shimData(data: Record<string, unknown>, options: DataModel.ShimDataOptions): Record<string, unknown>;
}

export default BaseActor;
