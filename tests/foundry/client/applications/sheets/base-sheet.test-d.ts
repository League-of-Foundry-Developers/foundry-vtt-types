import { expectTypeOf } from "vitest";

declare const doc: Item.Implementation;
const sheet = new foundry.applications.sheets.BaseSheet<Item.Implementation>({ document: doc });

expectTypeOf(sheet.document).toEqualTypeOf<Item.Implementation>();

expectTypeOf(
  foundry.applications.sheets.BaseSheet.DEFAULT_OPTIONS,
).toEqualTypeOf<foundry.applications.api.DocumentSheetV2.DefaultOptions>();
expectTypeOf(foundry.applications.sheets.BaseSheet.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
