import { expectTypeOf } from "vitest";

declare const doc: JournalEntry.Implementation;
const sheet = new foundry.applications.sheets.journal.JournalEntryCategoryConfig({ document: doc });

expectTypeOf(sheet.title).toEqualTypeOf<string>();

expectTypeOf(
  foundry.applications.sheets.journal.JournalEntryCategoryConfig.DEFAULT_OPTIONS,
).toEqualTypeOf<foundry.applications.api.DocumentSheetV2.DefaultOptions>();
expectTypeOf(foundry.applications.sheets.journal.JournalEntryCategoryConfig.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
