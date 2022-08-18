import { ConfiguredDocumentClass } from './../../../types/helperTypes.d';
import Document, { DocumentMetadata } from '../abstract/document.mjs';
import * as CONST from '../constants.mjs';
import * as fields from '../data/fields.mjs';
import { DataModel, DataSchema } from '../abstract/module.mjs';
import type { BaseUser } from './module.mjs';
import type { FlagsField } from '../data/flagsField';

interface BaseTableResultSchema extends DataSchema {
  /**
   * The _id which uniquely identifies this TableResult embedded document
   */
  _id: fields.DocumentIdField<{}>;

  /**
   * A result subtype from CONST.TABLE_RESULT_TYPES
   * (default: `0`)
   */
  type: fields.NumberField<{
    required: true;
    choices: CONST.TABLE_RESULT_TYPES[];
    initial: typeof CONST.TABLE_RESULT_TYPES.TEXT;
    validationError: 'must be a value in CONST.TABLE_RESULT_TYPES';
  }>;

  /**
   * The text which describes the table result
   */
  text: fields.HTMLField<{}>;

  /**
   * An image file url that represents the table result
   */
  img: fields.FilePathField<{ categories: ['IMAGE'] }>;

  /**
   * A named collection from which this result is drawn
   */
  documentCollection: fields.StringField<{}>;

  /**
   * The _id of a Document within the collection this result references
   */
  documentId: fields.ForeignDocumentField<typeof Document, { idOnly: true }>;

  /**
   * The probabilistic weight of this result relative to other results
   * (default: `1`)
   */
  weight: fields.NumberField<{ required: true; integer: true; positive: true }>;

  /**
   * A length 2 array of ascending integers which defines the range of dice roll totals which produce this drawn result
   */
  range: fields.ArrayField<
    fields.NumberField<{ integer: true }>,
    {
      validate: <R>(r: R) => R extends Array<number> & { length: 2 } ? true : false;
      validationError: 'must be a length-2 array of ascending integers';
    }
  >;

  /**
   * Has this result already been drawn (without replacement)
   * (default: `false`)
   */
  drawn: fields.BooleanField<{}>;

  /**
   * An object of optional key/value flags
   */
  flags: FlagsField<'TableResult', {}>;
}

type CanUpdate = (
  user: BaseUser,
  doc: BaseTableResult,
  data: DeepPartial<DataModel.SchemaToSource<BaseTableResult['schema']>>
) => boolean;

type BaseTableResultMetadata = Merge<
  DocumentMetadata,
  {
    name: 'TableResult';
    collection: 'results';
    label: 'DOCUMENT.TableResult';
    labelPlural: 'DOCUMENT.TableResults';
    coreTypes: `${ValueOf<typeof CONST.TABLE_RESULT_TYPES>}`[];
    permissions: {
      update: CanUpdate;
    };
  }
>;

type BaseTableResultShims = {
  /**
   * Rename collection to resultCollection
   * @deprecated since v10
   */
  collection: BaseTableResult['documentCollection'];

  /**
   * Rename collection to resultCollection
   * @deprecated since v10
   */
  resultCollection: BaseTableResult['documentCollection'];

  /**
   * Rename collection to resultCollection
   * @deprecated since v10
   */
  resultId: BaseTableResult['documentId'];
};

/**
 * The Document definition for a TableResult.
 * Defines the DataSchema and common behaviors for a TableResult which are shared between both client and server.
 */
declare class BaseTableResult extends Document<
  BaseTableResultSchema,
  InstanceType<ConfiguredDocumentClass<typeof RollTable>>,
  BaseTableResultMetadata,
  BaseTableResultShims
> {
  /* -------------------------------------------- */
  /*  Model Configuration                         */
  /* -------------------------------------------- */

  /** {@inheritdoc} */
  static override readonly metadata: BaseTableResultMetadata;

  /** {@inheritdoc} */
  static override defineSchema(): BaseTableResultSchema;

  /**
   * Is a user able to update an existing TableResult?
   */
  static #canUpdate: CanUpdate;

  /* -------------------------------------------- */
  /*  Model Methods                               */
  /* -------------------------------------------- */

  /** {@inheritdoc} */
  override testUserPermission(
    user: foundry.documents.BaseUser,
    permission: keyof typeof foundry.CONST.DOCUMENT_PERMISSION_LEVELS | foundry.CONST.DOCUMENT_PERMISSION_LEVELS,
    { exact }?: { exact?: boolean }
  ): boolean;

  /* -------------------------------------------- */
  /*  Deprecations and Compatibility              */
  /* -------------------------------------------- */

  /** {@inheritdoc} */
  static override migrateData(data: Record<string, unknown>): Record<string, unknown>;

  /* ---------------------------------------- */

  /** {@inheritdoc} */
  static override shimData(data: Record<string, unknown>, options: DataModel.ShimDataOptions): Record<string, unknown>;
}

export default BaseTableResult;
