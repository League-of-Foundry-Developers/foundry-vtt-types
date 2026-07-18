import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

declare const page: JournalEntryPage.Implementation;
const sheet = new foundry.applications.sheets.journal.JournalEntryPageProseMirrorSheet({ document: page });

expectTypeOf(sheet.document).toEqualTypeOf<JournalEntryPage.Implementation>();

expectTypeOf(foundry.applications.sheets.journal.JournalEntryPageProseMirrorSheet.EDIT_PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
expectTypeOf(foundry.applications.sheets.journal.JournalEntryPageProseMirrorSheet.VIEW_PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();

declare class _TestJournalEntryPageProseMirrorSheetSubclass
  extends foundry.applications.sheets.journal.JournalEntryPageProseMirrorSheet
{
  protected override _canRender(
    options: DeepPartial<foundry.applications.sheets.journal.JournalEntryPageProseMirrorSheet.RenderOptions>,
  ): boolean | void;
  protected override _isEditorDirty(): boolean | undefined;
  _onAutosave(content: string): void;
  _onNewSteps(): void;
}
