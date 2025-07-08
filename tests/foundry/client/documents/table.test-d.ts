import { expectTypeOf } from "vitest";

// @ts-expect-error A RollTable requires data.
new RollTable.implementation();

// @ts-expect-error A RollTable requires a name.
new RollTable.implementation({});

const table = new RollTable.implementation({ name: "" });

expectTypeOf(table.results.get("testing")).toEqualTypeOf<TableResult.Implementation | undefined>();

expectTypeOf(await table.draw()).toEqualTypeOf<RollTable.Draw>();
expectTypeOf((await table.roll()).results).toEqualTypeOf<TableResult.Implementation[]>();
expectTypeOf(table.displayRoll).toEqualTypeOf<boolean>();

declare const folder: Folder.Implementation;
expectTypeOf(await RollTable.fromFolder(folder)).toEqualTypeOf<RollTable.Stored | undefined>();
