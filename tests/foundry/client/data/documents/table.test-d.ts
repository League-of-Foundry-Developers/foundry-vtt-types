import { expectTypeOf } from "vitest";

const table = new RollTable({ name: "" });

// @ts-expect-error - A RollTable requires a name.
new RollTable({});

expectTypeOf(table.results.get("testing")).toEqualTypeOf<TableResult | undefined>();

expectTypeOf(await table.draw()).toEqualTypeOf<RollTableDraw>();
expectTypeOf((await table.roll()).results[0]).toEqualTypeOf<TableResult>();
expectTypeOf(table.data.displayRoll).toEqualTypeOf<boolean>();

declare const folder: Folder;
expectTypeOf(await RollTable.fromFolder(folder)).toEqualTypeOf<RollTable | undefined>();
