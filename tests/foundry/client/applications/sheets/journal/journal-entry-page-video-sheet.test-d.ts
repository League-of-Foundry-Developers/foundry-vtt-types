import { expectTypeOf } from "vitest";

declare const page: JournalEntryPage.Implementation;
const sheet = new foundry.applications.sheets.journal.JournalEntryPageVideoSheet({ document: page });

expectTypeOf(sheet.document).toEqualTypeOf<JournalEntryPage.Implementation>();

expectTypeOf(foundry.applications.sheets.journal.JournalEntryPageVideoSheet.EDIT_PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
expectTypeOf(foundry.applications.sheets.journal.JournalEntryPageVideoSheet.VIEW_PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();

declare class _TestJournalEntryPageVideoSheetSubclass
  extends foundry.applications.sheets.journal.JournalEntryPageVideoSheet
{
  protected override _getYouTubeVars(): YT.PlayerVars;
  protected override _timeComponentsToTimestamp(
    components: foundry.applications.sheets.journal.JournalEntryPageVideoSheet.TimeComponents,
  ): number;
  protected override _timestampToTimeComponents(
    timestamp: number | undefined,
  ): foundry.applications.sheets.journal.JournalEntryPageVideoSheet.TimeComponents;
}
