import { ConfiguredFlags, PropertiesToSource } from "../../../../types/helperTypes";
import DocumentData from "../../abstract/data.mjs";
import { BaseTableResult } from "../../documents.mjs";
import { fields } from "../module.mjs";

interface TableResultDataSchema extends DocumentSchema {
  _id: fields.DocumentId;
  type: DocumentField<foundry.CONST.TABLE_RESULT_TYPES> & {
    type: typeof Number;
    default: typeof foundry.CONST.TABLE_RESULT_TYPES.TEXT;
    validate: (t: unknown) => t is foundry.CONST.TABLE_RESULT_TYPES;
    validationError: "Invalid TableResult type provided";
  };
  text: fields.BlankString;
  img: fields.ImageField;
  collection: fields.StringField;
  resultId: fields.StringField;
  weight: fields.PositiveIntegerField;
  range: DocumentField<[number, number]> & {
    type: [typeof Number];
    required: true;
    default: [];
    validate: typeof _isValidResultRange;
    validationError: "Invalid TableResult range which must be a length-2 array of ascending integers";
  };
  drawn: fields.BooleanField;
  flags: fields.ObjectField;
}

/**
 * Validate whether a table result has a valid result range.
 * @internal
 * @param range - The proposed result range
 * @returns Is the range valid?
 */
declare function _isValidResultRange(range: unknown): range is [number, number];

interface TableResultDataProperties {
  /**
   * The _id which uniquely identifies this TableResult embedded document
   * @defaultValue `null`
   */
  _id: string | null;

  /**
   * A result sub-type from CONST.TABLE_RESULT_TYPES
   * @defaultValue `CONST.TABLE_RESULT_TYPES.TEXT`
   */
  type: foundry.CONST.TABLE_RESULT_TYPES;

  /**
   * The text which describes the table result
   * @defaultValue `""`
   */
  text: string;

  /**
   * An image file url that represents the table result
   */
  img: string | null | undefined;

  /**
   * A named collection from which this result is drawn
   */
  collection: string | undefined;

  /**
   * The _id of a Document within the collection this result references
   */
  resultId: string | undefined;

  /**
   * The probabilistic weight of this result relative to other results
   */
  weight: number | undefined;

  /**
   * A length 2 array of ascending integers which defines the range of dice roll
   * totals which produce this drawn result
   */
  range: [number, number];

  /**
   * Has this result already been drawn (without replacement)
   * @defaultValue `false`
   */
  drawn: boolean;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags: ConfiguredFlags<"TableResult">;
}

interface TableResultDataConstructorData {
  /**
   * The _id which uniquely identifies this TableResult embedded document
   * @defaultValue `null`
   */
  _id?: string | null | undefined;

  /**
   * A result sub-type from CONST.TABLE_RESULT_TYPES
   * @defaultValue `CONST.TABLE_RESULT_TYPES.TEXT`
   */
  type?: foundry.CONST.TABLE_RESULT_TYPES | null | undefined;

  /**
   * The text which describes the table result
   * @defaultValue `""`
   */
  text?: string | null | undefined;

  /**
   * An image file url that represents the table result
   */
  img?: string | null | undefined;

  /**
   * A named collection from which this result is drawn
   */
  collection?: string | null | undefined;

  /**
   * The _id of a Document within the collection this result references
   */
  resultId?: string | null | undefined;

  /**
   * The probabilistic weight of this result relative to other results
   */
  weight?: number | null | undefined;

  /**
   * A length 2 array of ascending integers which defines the range of dice roll
   * totals which produce this drawn result
   */
  range: [number, number];

  /**
   * Has this result already been drawn (without replacement)
   * @defaultValue `false`
   */
  drawn?: boolean | null | undefined;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags?: ConfiguredFlags<"TableResult"> | null | undefined;
}

type TableResultDataSource = PropertiesToSource<TableResultDataProperties>;

export class TableResultData extends DocumentData<
  TableResultDataSchema,
  TableResultDataProperties,
  TableResultDataSource,
  TableResultDataConstructorData,
  BaseTableResult
> {
  static override defineSchema(): TableResultDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface TableResultData extends TableResultDataProperties {}
