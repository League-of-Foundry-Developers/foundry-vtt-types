import { expectTypeOf } from "vitest";

declare const doc: Macro.Implementation;
const sheet = new foundry.applications.sheets.MacroConfig({ document: doc });

expectTypeOf(sheet.document).toEqualTypeOf<Macro.Implementation>();

expectTypeOf(
  foundry.applications.sheets.MacroConfig.DEFAULT_OPTIONS,
).toEqualTypeOf<foundry.applications.api.DocumentSheetV2.DefaultOptions>();
expectTypeOf(foundry.applications.sheets.MacroConfig.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
