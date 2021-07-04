import { expectType } from 'tsd';

const rollTables = new RollTables();
expectType<RollTable>(rollTables.get('', { strict: true }));
expectType<any[]>(rollTables.toJSON()); // TODO Adjust as soon as BaseRollTable and RollTableData have been typed
expectType<RollTableDirectory | undefined>(rollTables.directory);
