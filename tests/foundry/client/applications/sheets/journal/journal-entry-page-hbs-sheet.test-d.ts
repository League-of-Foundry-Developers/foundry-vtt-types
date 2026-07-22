import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

declare const page: JournalEntryPage.Implementation;
const sheet = new foundry.applications.sheets.journal.JournalEntryPageHandlebarsSheet({ document: page });

expectTypeOf(sheet.document).toEqualTypeOf<JournalEntryPage.Implementation>();

expectTypeOf(foundry.applications.sheets.journal.JournalEntryPageHandlebarsSheet.EDIT_PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
expectTypeOf(foundry.applications.sheets.journal.JournalEntryPageHandlebarsSheet.VIEW_PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();

declare class _TestJournalEntryPageHandlebarsSheetSubclass
  extends foundry.applications.sheets.journal.JournalEntryPageHandlebarsSheet
{
  protected override _prepareContentContext(
    context: foundry.applications.api.ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<foundry.applications.sheets.journal.JournalEntryPageHandlebarsSheet.RenderOptions>,
  ): Promise<void>;
}
