import EmbeddedCollection from '../../abstract/embedded-collection.mjs';
import { ConfiguredDocumentClass, FieldReturnType, PropertiesToSource } from '../../../../types/helperTypes';
import { DocumentData } from '../../abstract/module.mjs';
import * as documents from '../../documents.mjs';
import * as fields from '../fields.mjs';

type EntityPermissions = ValueOf<typeof CONST.ENTITY_PERMISSIONS>;

interface ItemDataSchema extends DocumentSchema {
  _id: typeof fields.DOCUMENT_ID;
  name: typeof fields.REQUIRED_STRING;
  type: DocumentField<string> & {
    type: String;
    required: true;
    validate: (t: unknown) => boolean;
    validationError: 'The provided Item type must be in the array of types defined by the game system';
  };
  img: FieldReturnType<typeof fields.IMAGE_FIELD, { default: () => string }>;
  data: FieldReturnType<typeof fields.OBJECT_FIELD, { default: (data: { type: string }) => any }>; // TODO
  effects: fields.EmbeddedCollectionField<typeof documents.BaseActiveEffect>;
  folder: fields.ForeignDocumentField<{ type: typeof documents.BaseFolder }>;
  sort: typeof fields.INTEGER_SORT_FIELD;
  permission: typeof fields.DOCUMENT_PERMISSIONS;
  flags: typeof fields.OBJECT_FIELD;
}

interface ItemDataProperties {
  /**
   * The _id which uniquely identifies this Item document
   */
  _id: string | null;

  /**
   * The name of this Item
   */
  name: string;

  /**
   * An Item subtype which configures the system data model applied
   */
  type: string;

  /**
   * An image file path which provides the artwork for this Item
   * @defaultValue `ItemData.DEFAULT_ICON`
   */
  img: string | null;

  /**
   * The system data object which is defined by the system template.json model
   */
  data: object;

  /**
   * A collection of ActiveEffect embedded Documents
   */
  effects: EmbeddedCollection<ConfiguredDocumentClass<typeof documents.BaseActiveEffect>, ItemData>;

  /**
   * The _id of a Folder which contains this Item
   * @defaultValue `null`
   */
  folder: string | null;

  /**
   * The numeric sort value which orders this Item relative to its siblings
   * @defaultValue `0`
   */
  sort: number;

  /**
   * An object which configures user permissions to this Item
   * @defaultValue `{ default: CONST.ENTITY_PERMISSIONS.NONE }`
   */
  permission: Partial<Record<string, EntityPermissions>>;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags: Record<string, unknown>;
}

interface ItemDataUpdateArgs {
  _id?: string | null;
  name: string;
  type: string;
  img?: string | null;
  data?: object | null;
  effects?: ConfiguredDocumentClass<typeof documents.BaseActiveEffect>[] | null;
  folder?: string | null;
  sort?: number | null;
  permission?: Record<string, EntityPermissions> | null;
  flags?: Record<string, unknown> | null;
}

/**
 * The data schema for a Item document.
 * @see BaseItem
 */
export declare class ItemData extends DocumentData<
  ItemDataSchema,
  ItemDataProperties,
  documents.BaseItem,
  ItemDataUpdateArgs
> {
  static defineSchema(): ItemDataSchema;

  /**
   * The default icon used for newly created Item documents
   * @defaultValue `"icons/svg/item-bag.svg"`
   */
  static DEFAULT_ICON: string;

  protected _initializeSource(data: ItemDataUpdateArgs): PropertiesToSource<ItemDataProperties>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface ItemData extends ItemDataProperties {}
