import { expectTypeOf } from "vitest";
import type { JSONValue } from "fvtt-types/utils";

declare const page: JournalEntryPage.Implementation;
const sheet = new foundry.applications.sheets.journal.JournalEntryPageCodeMirrorSheet({ document: page });

expectTypeOf(sheet.document).toEqualTypeOf<JournalEntryPage.Implementation>();

expectTypeOf(foundry.applications.sheets.journal.JournalEntryPageCodeMirrorSheet.VIEW_PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();

declare class _TestJournalEntryPageCodeMirrorSheetSubclass
  extends foundry.applications.sheets.journal.JournalEntryPageCodeMirrorSheet
{
  protected override _onDrop(event: DragEvent): void;
  protected override _onDropContentLink(event: DragEvent, eventData: JSONValue): Promise<void>;
}
