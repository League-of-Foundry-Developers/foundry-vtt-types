import Document, { DocumentMetadata } from '../abstract/document.mjs';
import * as documents from './module.mjs';
import * as fields from '../data/fields.mjs';
import { DocumentStatsSchema } from '../data/data.mjs';
import type BaseUser from './user.mjs';
import type { ConfiguredDocumentClass } from '../../../types/helperTypes.js';
import type { FlagsField } from '../data/flagsField.js';

type BaseItemSchema = {
  /** The _id which uniquely identifies this Item document */
  _id: fields.DocumentIdField<{}>;

  /** The name of this Item */
  name: fields.StringField<{ required: true; blank: false }>;

  /** An Item subtype which configures the system data model applied */
  type: fields.StringField<{
    required: true;
    choices: () => typeof BaseItem.TYPES;
    validationError: 'must be in the array of Item types defined by the game system';
  }>;

  /** An image file path which provides the artwork for this Item */
  img: fields.FilePathField<{ categories: ['IMAGE']; initial: () => typeof BaseItem.DEFAULT_ICON }>;

  /** The system data object which is defined by the system template.json model */
  system: fields.SystemDataField<typeof BaseItem, {}>;

  /** A collection of ActiveEffect embedded Documents */
  effects: fields.EmbeddedCollectionField<typeof documents.BaseActiveEffect, {}>;

  /** The _id of a Folder which contains this Item */
  folder: fields.ForeignDocumentField<typeof documents.BaseFolder, {}>;

  /** The numeric sort value which orders this Item relative to its siblings */
  sort: typeof documents.BaseFolder.SORT_FIELD;

  /** An object which configures ownership of this Item */
  ownership: fields.DocumentOwnershipField<{}>;

  /** An object of optional key/value flags */
  flags: FlagsField<'Item', {}>;

  /** An object of creation and access information */
  _stats: typeof DocumentStatsSchema;
};

type BaseItemMetadata = Merge<
  DocumentMetadata,
  {
    name: 'Item';
    collection: 'items';
    compendiumIndexFields: ['_id', 'name', 'img', 'type', 'sort'];
    embedded: { ActiveEffect: 'effects' };
    label: 'DOCUMENT.Item';
    labelPlural: 'DOCUMENT.Items';
    permissions: { create: 'ITEM_CREATE' };

    types: typeof BaseItem.TYPES;
  }
>;

type BaseItemShims = {
  /**
   * Rename data to system
   * @deprecated since v10
   */
  data: BaseItem['system'];

  /**
   * Rename permission to ownership
   * @deprecated since v10
   */
  permission: BaseItem['ownership'];
};

/**
 * The base Item model definition which defines common behavior of an Item document between both client and server.
 */
declare class BaseItem extends Document<
  BaseItemSchema,
  InstanceType<ConfiguredDocumentClass<typeof documents.BaseActor>>,
  BaseItemMetadata,
  BaseItemShims
> {
  static override get metadata(): BaseItemMetadata;

  static override defineSchema(): BaseItemSchema;

  /**
   * The default icon used for newly created Item documents
   *
   * (instanciated: `icons/svg/item-bag.svg`)
   */
  static DEFAULT_ICON: string;

  /**
   * The allowed set of Item types which may exist.
   *
   * (instanciated: `game.documentTypes?.Item || []`)
   */
  static get TYPES(): string[];

  /** {@inheritdoc} */
  override canUserModify(user: BaseUser, action: 'create' | 'update' | 'delete', data?: object): boolean;

  /** {@inheritdoc} */
  override testUserPermission(
    user: BaseUser,
    permission: keyof typeof foundry.CONST.DOCUMENT_PERMISSION_LEVELS | foundry.CONST.DOCUMENT_PERMISSION_LEVELS,
    { exact }?: { exact?: boolean }
  ): boolean;

  /* -------------------------------------------- */
  /*  Deprecations and Compatibility              */
  /* -------------------------------------------- */

  /** {@inheritdoc} */
  static override migrateData(data: Record<string, unknown>): Record<string, unknown>;

  static override shimData(data: Record<string, unknown>): Record<string, unknown>;
}

export default BaseItem;
