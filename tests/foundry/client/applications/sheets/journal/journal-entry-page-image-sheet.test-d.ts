import { expectTypeOf } from "vitest";

declare const page: JournalEntryPage.Implementation;
const sheet = new foundry.applications.sheets.journal.JournalEntryPageImageSheet({ document: page });

expectTypeOf(sheet.document).toEqualTypeOf<JournalEntryPage.Implementation>();

expectTypeOf(foundry.applications.sheets.journal.JournalEntryPageImageSheet.EDIT_PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
expectTypeOf(foundry.applications.sheets.journal.JournalEntryPageImageSheet.VIEW_PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
