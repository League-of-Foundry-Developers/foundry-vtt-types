import { DocumentMetadata } from '../abstract/document';
import { Document } from '../abstract/module';
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
