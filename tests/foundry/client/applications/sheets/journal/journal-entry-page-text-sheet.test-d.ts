import { expectTypeOf } from "vitest";

declare const page: JournalEntryPage.Implementation;
const sheet = new foundry.applications.sheets.journal.JournalEntryPageTextSheet({ document: page });

expectTypeOf(sheet.document).toEqualTypeOf<JournalEntryPage.Implementation>();

expectTypeOf(
  foundry.applications.sheets.journal.JournalEntryPageTextSheet.format,
).toEqualTypeOf<CONST.JOURNAL_ENTRY_PAGE_FORMATS>();

declare class _TestJournalEntryPageTextSheetSubclass
  extends foundry.applications.sheets.journal.JournalEntryPageTextSheet
{
  protected override _isEditorDirty(): boolean | undefined;
}
