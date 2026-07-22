import { expectTypeOf } from "vitest";

declare const page: JournalEntryPage.Implementation;
const sheet = new foundry.applications.sheets.journal.JournalEntryPageMarkdownSheet({ document: page });

expectTypeOf(sheet.document).toEqualTypeOf<JournalEntryPage.Implementation>();
expectTypeOf(
  foundry.applications.sheets.journal.JournalEntryPageMarkdownSheet.format,
).toEqualTypeOf<CONST.JOURNAL_ENTRY_PAGE_FORMATS>();
expectTypeOf(foundry.applications.sheets.journal.JournalEntryPageMarkdownSheet.EDIT_PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
