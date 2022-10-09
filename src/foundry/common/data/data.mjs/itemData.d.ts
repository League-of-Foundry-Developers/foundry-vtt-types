import {
  ConfiguredData,
  ConfiguredDocumentClass,
  ConfiguredFlags,
  ConfiguredSource,
  FieldReturnType,
  PropertiesToSource
} from "../../../../types/helperTypes";
import EmbeddedCollection from "../../abstract/embedded-collection.mjs";
import { DocumentData } from "../../abstract/module.mjs";
import * as documents from "../../documents.mjs";
import * as fields from "../fields.mjs";

interface ItemDataSchema extends DocumentSchema {
  _id: fields.DocumentId;
  name: fields.RequiredString;
  type: DocumentField<string> & {
    type: typeof String;
    required: true;
    validate: (t: unknown) => boolean;
    validationError: "The provided Item type must be in the array of types defined by the game system";
  };
  img: FieldReturnType<fields.ImageField, { default: () => typeof ItemData.DEFAULT_ICON }>;
  data: fields.SystemDataField;
  effects: fields.EmbeddedCollectionField<typeof documents.BaseActiveEffect>;
  folder: fields.ForeignDocumentField<{ type: typeof documents.BaseFolder }>;
  sort: fields.IntegerSortField;
  permission: fields.DocumentPermissions;
  flags: fields.ObjectField;
}

interface ItemDataBaseProperties {
  /**
   * The _id which uniquely identifies this Item document
   * @defaultValue `null`
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
   * @defaultValue template from template.json for type or `{}`
   */
  data: object;

  /**
   * A collection of ActiveEffect embedded Documents
   * @defaultValue `new EmbeddedCollection(ActiveEffectData, [], BaseActiveEffect.implementation)`
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
   * @defaultValue `{ default: CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE }`
   */
  permission: Partial<Record<string, foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS>>;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags: ConfiguredFlags<"Item">;
}

interface ItemDataConstructorData {
  /**
   * The _id which uniquely identifies this Item document
   * @defaultValue `null`
   */
  _id?: string | null | undefined;

  /**
   * The name of this Item
   */
  name: string;

  /**
   * An Item subtype which configures the system data model applied
   */
  type: ItemDataSource["type"];

  /**
   * An image file path which provides the artwork for this Item
   * @defaultValue `ItemData.DEFAULT_ICON`
   */
  img?: string | null | undefined;

  /**
   * The system data object which is defined by the system template.json model
   * @defaultValue template from template.json for type or `{}`
   */
  data?: DeepPartial<ItemDataSource["data"]> | null | undefined;

  /**
   * A collection of ActiveEffect embedded Documents
   * @defaultValue `new EmbeddedCollection(ActiveEffectData, [], BaseActiveEffect.implementation)`
   */
  effects?: ConstructorParameters<ConfiguredDocumentClass<typeof documents.BaseActiveEffect>>[0][] | null | undefined;

  /**
   * The _id of a Folder which contains this Item
   * @defaultValue `null`
   */
  folder?: InstanceType<ConfiguredDocumentClass<typeof documents.BaseFolder>> | string | null | undefined;

  /**
   * The numeric sort value which orders this Item relative to its siblings
   * @defaultValue `0`
   */
  sort?: number | null | undefined;

  /**
   * An object which configures user permissions to this Item
   * @defaultValue `{ default: CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE }`
   */
  permission?: Partial<Record<string, foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS>> | null | undefined;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags?: ConfiguredFlags<"Item"> | null | undefined;
}

type ItemDataBaseSource = PropertiesToSource<ItemDataBaseProperties>;
type ItemDataProperties = ItemDataBaseProperties & ConfiguredData<"Item">;
type ItemDataSource = ItemDataBaseSource & ConfiguredSource<"Item">;

type DocumentDataConstructor = Pick<typeof DocumentData, keyof typeof DocumentData>;

interface ItemDataConstructor extends DocumentDataConstructor {
  new (data: ItemDataConstructorData, document?: documents.BaseItem | null): ItemData;

  defineSchema(): ItemDataSchema;

  /**
   * The default icon used for newly created Item documents
   * @defaultValue `"icons/svg/item-bag.svg"`
   */
  DEFAULT_ICON: string;
}

/**
 * The data schema for a Item document.
 * @see BaseItem
 */
export type ItemData = DocumentData<
  ItemDataSchema,
  ItemDataProperties,
  ItemDataSource,
  ItemDataConstructorData,
  documents.BaseItem
> &
  ItemDataProperties & {
    _initializeSource(data: ItemDataConstructorData): ItemDataSource;
  };
export const ItemData: ItemDataConstructor;
