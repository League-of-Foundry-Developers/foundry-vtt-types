import { expectTypeOf } from "vitest";

import JournalEntryPageMarkdownSheet = foundry.applications.sheets.journal.JournalEntryPageMarkdownSheet;
import JournalEntryPageCodeMirrorSheet = foundry.applications.sheets.journal.JournalEntryPageCodeMirrorSheet;
import JournalEntryPageSheet = foundry.applications.sheets.journal.JournalEntryPageSheet;
import HandlebarsApplicationMixin = foundry.applications.api.HandlebarsApplicationMixin;
import DocumentSheetV2 = foundry.applications.api.DocumentSheetV2;
import FormDataExtended = foundry.applications.ux.FormDataExtended;

declare const sheet: JournalEntryPageMarkdownSheet;
declare const event: SubmitEvent;
declare const form: HTMLFormElement;
declare const formData: FormDataExtended;

expectTypeOf(JournalEntryPageMarkdownSheet.DEFAULT_OPTIONS).toEqualTypeOf<JournalEntryPageSheet.DefaultOptions>();
expectTypeOf(JournalEntryPageMarkdownSheet.EDIT_PARTS).toEqualTypeOf<
  Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
expectTypeOf(JournalEntryPageMarkdownSheet.format).toEqualTypeOf<CONST.JOURNAL_ENTRY_PAGE_FORMATS>();

// V14 reparented this sheet from `JournalEntryPageTextSheet` onto the code-mirror base.
expectTypeOf(sheet).toExtend<JournalEntryPageCodeMirrorSheet>();

expectTypeOf(sheet["_prepareContentContext"]).returns.toEqualTypeOf<Promise<void>>();
expectTypeOf(sheet["_prepareSubmitData"](event, form, formData)).toEqualTypeOf<
  DocumentSheetV2.SubmitData<JournalEntryPage.Implementation>
>();

// Only added in edit mode.
expectTypeOf<JournalEntryPageMarkdownSheet.RenderContext["markdownFormat"]>().toEqualTypeOf<
  CONST.JOURNAL_ENTRY_PAGE_FORMATS | undefined
>();
