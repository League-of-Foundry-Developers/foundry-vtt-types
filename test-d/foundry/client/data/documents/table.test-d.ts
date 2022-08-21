import { expectError, expectType } from "tsd";

const table = new RollTable({ name: "" });

expectError(new RollTable({}));

expectType<TableResult | undefined>(table.results.get("testing"));

expectType<RollTableDraw>(await table.draw());
expectType<TableResult>((await table.roll()).results[0]);
expectType<boolean>(table.data.displayRoll);

declare const folder: Folder;
expectType<RollTable | undefined>(await RollTable.fromFolder(folder));
