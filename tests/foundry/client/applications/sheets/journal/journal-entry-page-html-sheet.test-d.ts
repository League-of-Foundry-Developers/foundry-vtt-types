import { expectTypeOf } from "vitest";

declare const page: JournalEntryPage.Implementation;
const sheet = new foundry.applications.sheets.journal.JournalEntryPageHTMLSheet({ document: page });

expectTypeOf(sheet.document).toEqualTypeOf<JournalEntryPage.Implementation>();

expectTypeOf(foundry.applications.sheets.journal.JournalEntryPageHTMLSheet.EDIT_PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
expectTypeOf(
  foundry.applications.sheets.journal.JournalEntryPageHTMLSheet.formatHTML("<p>hi</p>"),
).toEqualTypeOf<string>();
expectTypeOf(
  foundry.applications.sheets.journal.JournalEntryPageHTMLSheet.formatHTML("<p>hi</p>", { spaces: 2 }),
).toEqualTypeOf<string>();
