import { expectType } from 'tsd';
import type { RollTableDataSource } from '../../../../../src/foundry/common/data/data.mjs.d.ts/rollTableData';

const rollTables = new RollTables();
expectType<StoredDocument<RollTable>>(rollTables.get('', { strict: true }));
expectType<(RollTableDataSource & { _id: string })[]>(rollTables.toJSON());
expectType<RollTableDirectory | undefined>(rollTables.directory);
