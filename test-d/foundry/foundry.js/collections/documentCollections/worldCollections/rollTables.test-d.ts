import { expectType } from 'tsd';
import type { RollTableDataProperties } from '../../../../../../src/foundry/common/data/data.mjs/rollTableData';
import type { PropertiesToSource } from '../../../../../../src/types/helperTypes';

const rollTables = new RollTables();
expectType<StoredDocument<RollTable>>(rollTables.get('', { strict: true }));
expectType<(PropertiesToSource<RollTableDataProperties> & { _id: string })[]>(rollTables.toJSON());
expectType<RollTableDirectory | undefined>(rollTables.directory);
