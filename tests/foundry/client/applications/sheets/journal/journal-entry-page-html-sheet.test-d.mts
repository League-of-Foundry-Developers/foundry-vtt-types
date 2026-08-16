import { expectTypeOf } from "vitest";

import JournalEntryPageHTMLSheet = foundry.applications.sheets.journal.JournalEntryPageHTMLSheet;
import JournalEntryPageCodeMirrorSheet = foundry.applications.sheets.journal.JournalEntryPageCodeMirrorSheet;
import JournalEntryPageSheet = foundry.applications.sheets.journal.JournalEntryPageSheet;
import HandlebarsApplicationMixin = foundry.applications.api.HandlebarsApplicationMixin;
import DocumentSheetV2 = foundry.applications.api.DocumentSheetV2;
import FormDataExtended = foundry.applications.ux.FormDataExtended;

declare const sheet: JournalEntryPageHTMLSheet;
declare const event: SubmitEvent;
declare const form: HTMLFormElement;
declare const formData: FormDataExtended;

expectTypeOf(JournalEntryPageHTMLSheet.DEFAULT_OPTIONS).toEqualTypeOf<JournalEntryPageSheet.DefaultOptions>();
expectTypeOf(JournalEntryPageHTMLSheet.EDIT_PARTS).toEqualTypeOf<
  Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();

expectTypeOf(sheet).toExtend<JournalEntryPageCodeMirrorSheet>();
expectTypeOf(sheet["_prepareContentContext"]).returns.toEqualTypeOf<Promise<void>>();
expectTypeOf(sheet["_prepareSubmitData"](event, form, formData)).toEqualTypeOf<
  DocumentSheetV2.SubmitData<JournalEntryPage.Implementation>
>();

expectTypeOf(JournalEntryPageHTMLSheet.formatHTML("<p>foo</p>")).toEqualTypeOf<string>();
expectTypeOf(JournalEntryPageHTMLSheet.formatHTML("<p>foo</p>", {})).toEqualTypeOf<string>();
expectTypeOf(JournalEntryPageHTMLSheet.formatHTML("<p>foo</p>", { spaces: 2 })).toEqualTypeOf<string>();
expectTypeOf(JournalEntryPageHTMLSheet.formatHTML("<p>foo</p>", { spaces: "\t" })).toEqualTypeOf<string>();
expectTypeOf(JournalEntryPageHTMLSheet.formatHTML("<p>foo</p>", { spaces: undefined })).toEqualTypeOf<string>();

expectTypeOf<JournalEntryPageHTMLSheet.FormatHTMLOptions["spaces"]>().toEqualTypeOf<string | number | undefined>();

// Only added in edit mode.
expectTypeOf<JournalEntryPageHTMLSheet.TextContext["formatted"]>().toEqualTypeOf<string | undefined>();
expectTypeOf<JournalEntryPageHTMLSheet.TextContext>().toExtend<JournalEntryPageCodeMirrorSheet.TextContext>();
expectTypeOf<JournalEntryPageHTMLSheet.RenderContext["text"]>().toEqualTypeOf<JournalEntryPageHTMLSheet.TextContext>();
