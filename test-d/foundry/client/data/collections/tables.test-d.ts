import { expectType } from 'tsd';
import type DataModel from '../../../../../src/foundry/common/abstract/data.mjs';

const rollTables = new RollTables();
expectType<StoredDocument<RollTable>>(rollTables.get('', { strict: true }));
expectType<(DataModel.SchemaToSource<foundry.documents.BaseRollTable['schema']> & { _id: string })[]>(
  rollTables.toJSON()
);
expectType<RollTableDirectory | undefined>(rollTables.directory);
