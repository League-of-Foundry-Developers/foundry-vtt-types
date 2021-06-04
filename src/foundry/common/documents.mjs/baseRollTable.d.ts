import { DocumentMetadata } from '../abstract/document.mjs';
import { Document } from '../abstract/module.mjs';
import { BaseTableResult } from './baseTableResult';

/**
 * The RollTable document model.
 */
export declare class BaseRollTable extends Document<any, any> {
  static get metadata(): Merge<
    DocumentMetadata,
    {
      name: 'RollTable';
      collection: 'tables';
      label: 'DOCUMENT.RollTable';
      embedded: {
        TableResult: typeof BaseTableResult;
      };
      isPrimary: true;
    }
  >;
}
