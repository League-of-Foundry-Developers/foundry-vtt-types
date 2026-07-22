import { expectTypeOf } from "vitest";

declare const page: JournalEntryPage.Implementation;
const sheet = new foundry.applications.sheets.journal.JournalEntryPageSheet({ document: page });

expectTypeOf(sheet.document).toEqualTypeOf<JournalEntryPage.Implementation>();
expectTypeOf(sheet.toc).toEqualTypeOf<JournalEntryPage.TOC | undefined>();
expectTypeOf(sheet.isView).toEqualTypeOf<boolean>();
expectTypeOf(sheet.page).toEqualTypeOf<JournalEntryPage.Implementation>();
expectTypeOf(sheet.isV2).toEqualTypeOf<boolean>();
expectTypeOf(foundry.applications.sheets.journal.JournalEntryPageSheet.isV2).toEqualTypeOf<boolean>();

expectTypeOf(
  foundry.applications.sheets.journal.JournalEntryPageSheet.DEFAULT_OPTIONS,
).toEqualTypeOf<foundry.applications.api.DocumentSheetV2.DefaultOptions>();

declare class _TestJournalEntryPageSheetSubclass extends foundry.applications.sheets.journal.JournalEntryPageSheet {
  protected override _prepareHeadingLevels(): Record<string, string>;
  protected override _onCloseView(): void;
}
