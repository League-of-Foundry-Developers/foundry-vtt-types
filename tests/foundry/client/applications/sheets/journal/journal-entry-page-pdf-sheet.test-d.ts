import { expectTypeOf } from "vitest";

declare const page: JournalEntryPage.Implementation;
const sheet = new foundry.applications.sheets.journal.JournalEntryPagePDFSheet({ document: page });

expectTypeOf(sheet.document).toEqualTypeOf<JournalEntryPage.Implementation>();

expectTypeOf(foundry.applications.sheets.journal.JournalEntryPagePDFSheet.EDIT_PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
expectTypeOf(foundry.applications.sheets.journal.JournalEntryPagePDFSheet.VIEW_PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();

declare class _TestJournalEntryPagePDFSheetSubclass
  extends foundry.applications.sheets.journal.JournalEntryPagePDFSheet
{
  protected override _onLoadPDF(event: PointerEvent): void;
  protected override _getViewerParams(): URLSearchParams;
}
