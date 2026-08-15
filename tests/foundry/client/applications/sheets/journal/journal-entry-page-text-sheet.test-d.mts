import { expectTypeOf } from "vitest";

import JournalEntryPageTextSheet = foundry.applications.sheets.journal.JournalEntryPageTextSheet;
import JournalEntryPageSheet = foundry.applications.sheets.journal.JournalEntryPageSheet;
import DocumentSheetV2 = foundry.applications.api.DocumentSheetV2;
import FormDataExtended = foundry.applications.ux.FormDataExtended;
import type { DeepPartial } from "fvtt-types/utils";

declare const sheet: JournalEntryPageTextSheet;
declare const prepareContextOptions: DeepPartial<JournalEntryPageTextSheet.RenderOptions> & { isFirstRender: boolean };
declare const event: SubmitEvent;
declare const form: HTMLFormElement;
declare const formData: FormDataExtended;

expectTypeOf(JournalEntryPageTextSheet.DEFAULT_OPTIONS).toEqualTypeOf<JournalEntryPageSheet.DefaultOptions>();
expectTypeOf(JournalEntryPageTextSheet.format).toEqualTypeOf<CONST.JOURNAL_ENTRY_PAGE_FORMATS>();

expectTypeOf(sheet["_prepareContext"](prepareContextOptions)).toEqualTypeOf<
  Promise<JournalEntryPageTextSheet.RenderContext>
>();
expectTypeOf(sheet["_prepareSubmitData"](event, form, formData)).toEqualTypeOf<
  DocumentSheetV2.SubmitData<JournalEntryPage.Implementation>
>();

// Foundry documents this as `boolean`, but the ProseMirror subclass returns `undefined` when the sheet has no
// editor element, so the union is declared here for assignability.
expectTypeOf(sheet["_isEditorDirty"]()).toEqualTypeOf<boolean | undefined>();

expectTypeOf<JournalEntryPageTextSheet.RenderContext["text"]>().toEqualTypeOf<JournalEntryPageTextSheet.TextContext>();
expectTypeOf<JournalEntryPageTextSheet.TextContext>().toEqualTypeOf<JournalEntryPage.Implementation["text"]>();

class TestJournalEntryPageTextSheet extends JournalEntryPageTextSheet {
  protected override _isEditorDirty(): boolean {
    return super._isEditorDirty() ?? false;
  }
}

declare const testSheet: TestJournalEntryPageTextSheet;
expectTypeOf(testSheet["_isEditorDirty"]()).toEqualTypeOf<boolean>();
