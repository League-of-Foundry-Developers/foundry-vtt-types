import {
  ConfiguredDocumentClass,
  ConfiguredFlags,
  FieldReturnType,
  PropertiesToSource
} from "../../../../types/helperTypes";
import EmbeddedCollection from "../../abstract/embedded-collection.mjs";
import { DocumentData } from "../../abstract/module.mjs";
import * as documents from "../../documents.mjs";
import * as fields from "../fields.mjs";

interface RollTableDataSchema extends DocumentSchema {
  _id: fields.DocumentId;
  name: fields.RequiredString;
  img: FieldReturnType<fields.ImageField, { default: () => typeof RollTableData.DEFAULT_ICON }>;
  description: fields.StringField;
  results: fields.EmbeddedCollectionField<typeof documents.BaseTableResult>;
  formula: fields.StringField;
  replacement: FieldReturnType<fields.BooleanField, { default: true }>;
  displayRoll: FieldReturnType<fields.BooleanField, { default: true }>;
  folder: fields.ForeignDocumentField<{ type: typeof documents.BaseFolder }>;
  sort: fields.IntegerSortField;
  permission: fields.DocumentPermissions;
  flags: fields.ObjectField;
}

interface RollTableDataProperties {
  /**
   * The _id which uniquely identifies this RollTable document
   * @defaultValue `null`
   */
  _id: string | null;

  /**
   * The name of this RollTable
   */
  name: string;

  /**
   * An image file path which provides the thumbnail artwork for this RollTable
   * @defaultValue `RollTableData.DEFAULT_ICON`
   */
  img: string;

  /**
   * The HTML text description for this RollTable document
   */
  description: string | undefined;

  /**
   * A Collection of TableResult embedded documents which belong to this RollTable
   * @defaultValue `new EmbeddedCollection(TableResultData, [], BaseTableResult.implementation)`
   */
  results: EmbeddedCollection<ConfiguredDocumentClass<typeof documents.BaseTableResult>, RollTableData>;

  /**
   * The Roll formula which determines the results chosen from the table
   */
  formula: string | undefined;

  /**
   * Are results from this table drawn with replacement?
   * @defaultValue `true`
   */
  replacement: boolean;

  /**
   * Is the Roll result used to draw from this RollTable displayed in chat?
   * @defaultValue `true`
   */
  displayRoll: boolean;

  /**
   * The _id of a Folder which contains this RollTable
   */
  folder: string | null;

  /**
   * The numeric sort value which orders this RollTable relative to its siblings
   * @defaultValue `0`
   */
  sort: number;

  /**
   * An object which configures user permissions to this RollTable
   * @defaultValue `{ default: CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE }`
   */
  permission: Partial<Record<string, foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS>>;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags: ConfiguredFlags<"RollTable">;
}

interface RollTableDataConstructorData {
  /**
   * The _id which uniquely identifies this RollTable document
   */
  _id?: string | null | undefined;

  /**
   * The name of this RollTable
   */
  name: string;

  /**
   * An image file path which provides the thumbnail artwork for this RollTable
   * @defaultValue `RollTableData.DEFAULT_ICON`
   */
  img?: string | null | undefined;

  /**
   * The HTML text description for this RollTable document
   */
  description?: string | null | undefined;

  /**
   * A Collection of TableResult embedded documents which belong to this RollTable
   * @defaultValue `new EmbeddedCollection(TableResultData, [], BaseTableResult.implementation)`
   */
  results?: ConstructorParameters<ConfiguredDocumentClass<typeof documents.BaseTableResult>>[0][] | null | undefined;

  /**
   * The Roll formula which determines the results chosen from the table
   */
  formula?: string | null | undefined;

  /**
   * Are results from this table drawn with replacement?
   * @defaultValue `true`
   */
  replacement?: boolean | null | undefined;

  /**
   * Is the Roll result used to draw from this RollTable displayed in chat?
   * @defaultValue `true`
   */
  displayRoll?: boolean | null | undefined;

  /**
   * The _id of a Folder which contains this RollTable
   */
  folder?: InstanceType<ConfiguredDocumentClass<typeof documents.BaseFolder>> | string | null | undefined;

  /**
   * The numeric sort value which orders this RollTable relative to its siblings
   */
  sort?: number | null | undefined;

  /**
   * An object which configures user permissions to this RollTable
   * @defaultValue `{ default: CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE }`
   */
  permission?: Partial<Record<string, foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS>> | null | undefined;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags?: ConfiguredFlags<"RollTable"> | null | undefined;
}

type RollTableDataSource = PropertiesToSource<RollTableDataProperties>;

/**
 * The data schema for an RollTable document.
 * @see BaseRollTable
 */
export class RollTableData extends DocumentData<
  RollTableDataSchema,
  RollTableDataProperties,
  RollTableDataSource,
  RollTableDataConstructorData,
  documents.BaseRollTable
> {
  static override defineSchema(): RollTableDataSchema;

  /**
   * The default icon used for newly created Macro documents
   * @remarks Incorrect description, really for the RollTables.
   * @defaultValue `"icons/svg/d20-grey.svg"`
   */
  static DEFAULT_ICON: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RollTableData extends RollTableDataProperties {}
