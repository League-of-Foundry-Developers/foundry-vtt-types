import { expectTypeOf } from "vitest";

declare const journalEntry: JournalEntry.Implementation;
const dialog = new foundry.applications.sheets.journal.ShowToPlayersDialog({
  document: journalEntry,
  buttons: [{ action: "show", label: "Show" }],
});

expectTypeOf(dialog.document).toEqualTypeOf<JournalEntry.Implementation | JournalEntryPage.Implementation>();
expectTypeOf(dialog.isImage).toEqualTypeOf<boolean>();
expectTypeOf(dialog.title).toEqualTypeOf<string>();

expectTypeOf(
  foundry.applications.sheets.journal.ShowToPlayersDialog.DEFAULT_OPTIONS,
).toEqualTypeOf<foundry.applications.api.DialogV2.DefaultOptions>();
expectTypeOf(foundry.applications.sheets.journal.ShowToPlayersDialog.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
