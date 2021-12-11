import { DocumentMetadata } from '../abstract/document.mjs';
import { Document } from '../abstract/module.mjs';
import { BaseTableResult } from './baseTableResult';

/**
 * The base RollTable model definition which defines common behavior of an RollTable document between both client and server.
 */
export declare class BaseRollTable extends Document<foundry.data.RollTableData> {
  /** @override */
  static get schema(): typeof foundry.data.RollTableData;

  /** @override */
  static get metadata(): Merge<
    DocumentMetadata,
    {
      name: 'RollTable';
      collection: 'tables';
      label: 'DOCUMENT.RollTable';
      labelPlural: 'DOCUMENT.RollTables';
      embedded: {
        TableResult: typeof BaseTableResult;
      };
      isPrimary: true;
    }
  >;

  /**
   * A reference to the Collection of TableResult instances in this document, indexed by _id.
   */
  get results(): this['data']['results'];
}
