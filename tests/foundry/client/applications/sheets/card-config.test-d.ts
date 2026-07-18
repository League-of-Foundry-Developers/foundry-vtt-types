import { expectTypeOf } from "vitest";

declare const doc: Card.Implementation;
const sheet = new foundry.applications.sheets.CardConfig({ document: doc });

expectTypeOf(sheet.document).toEqualTypeOf<Card.Implementation>();

expectTypeOf(
  foundry.applications.sheets.CardConfig.DEFAULT_OPTIONS,
).toEqualTypeOf<foundry.applications.api.DocumentSheetV2.DefaultOptions>();
expectTypeOf(foundry.applications.sheets.CardConfig.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
expectTypeOf(foundry.applications.sheets.CardConfig.TABS).toEqualTypeOf<
  Record<string, foundry.applications.api.ApplicationV2.TabsConfiguration>
>();
expectTypeOf(foundry.applications.sheets.CardConfig.TYPES).toEqualTypeOf<Record<string, string>>();
