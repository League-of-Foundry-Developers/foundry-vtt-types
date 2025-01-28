import { expectTypeOf } from "vitest";

// @ts-expect-error - A RollTable requires data.
new RollTable();

// @ts-expect-error - A RollTable requires a name.
new RollTable({});

const table = new RollTable({ name: "" });

expectTypeOf(table.results.get("testing")).toEqualTypeOf<TableResult | undefined>();

expectTypeOf(await table.draw()).toEqualTypeOf<RollTableDraw>();
expectTypeOf((await table.roll()).results[0]).toEqualTypeOf<TableResult>();
expectTypeOf(table.displayRoll).toEqualTypeOf<boolean>();

declare const folder: Folder;
expectTypeOf(await RollTable.fromFolder(folder)).toEqualTypeOf<RollTable.Implementation | undefined>();
