import { expectTypeOf } from "vitest";

import JournalEntryPageVideoSheet = foundry.applications.sheets.journal.JournalEntryPageVideoSheet;
import JournalEntryPageSheet = foundry.applications.sheets.journal.JournalEntryPageSheet;
import HandlebarsApplicationMixin = foundry.applications.api.HandlebarsApplicationMixin;
import HTMLFilePickerElement = foundry.applications.elements.HTMLFilePickerElement;
import DocumentSheetV2 = foundry.applications.api.DocumentSheetV2;
import FormDataExtended = foundry.applications.ux.FormDataExtended;

declare const sheet: JournalEntryPageVideoSheet;
declare const event: SubmitEvent;
declare const form: HTMLFormElement;
declare const formData: FormDataExtended;

expectTypeOf(JournalEntryPageVideoSheet.DEFAULT_OPTIONS).toEqualTypeOf<JournalEntryPageSheet.DefaultOptions>();
expectTypeOf(JournalEntryPageVideoSheet.EDIT_PARTS).toEqualTypeOf<
  Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
expectTypeOf(JournalEntryPageVideoSheet.VIEW_PARTS).toEqualTypeOf<
  Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();

expectTypeOf(sheet["_prepareContentContext"]).returns.toEqualTypeOf<Promise<void>>();
expectTypeOf(sheet["_onRender"]).returns.toEqualTypeOf<Promise<void>>();
expectTypeOf(sheet["_getYouTubeVars"]()).toEqualTypeOf<YT.PlayerVars>();
expectTypeOf(sheet["_prepareSubmitData"](event, form, formData)).toEqualTypeOf<
  DocumentSheetV2.SubmitData<JournalEntryPage.Implementation>
>();

expectTypeOf(sheet["_timeComponentsToTimestamp"]({})).toEqualTypeOf<number>();
expectTypeOf(sheet["_timeComponentsToTimestamp"]({ h: 1, m: 2, s: 3 })).toEqualTypeOf<number>();
expectTypeOf(sheet["_timestampToTimeComponents"](3723)).toEqualTypeOf<JournalEntryPageVideoSheet.TimeComponents>();

// Every component is omitted when it would be zero.
expectTypeOf<JournalEntryPageVideoSheet.TimeComponents["h"]>().toEqualTypeOf<number | undefined>();
expectTypeOf<JournalEntryPageVideoSheet.TimeComponents["m"]>().toEqualTypeOf<number | undefined>();
expectTypeOf<JournalEntryPageVideoSheet.TimeComponents["s"]>().toEqualTypeOf<number | undefined>();

// The content part's members are only set for that part, so they are optional on the shared render context.
expectTypeOf<JournalEntryPageVideoSheet.RenderContext["flexRatio"]>().toEqualTypeOf<boolean | undefined>();
expectTypeOf<JournalEntryPageVideoSheet.RenderContext["isYouTube"]>().toEqualTypeOf<boolean | undefined>();
expectTypeOf<JournalEntryPageVideoSheet.PrepareContentContext["flexRatio"]>().toEqualTypeOf<boolean>();
expectTypeOf<
  JournalEntryPageVideoSheet.PrepareContentContext["timestamp"]
>().toEqualTypeOf<JournalEntryPageVideoSheet.TimestampContext>();
expectTypeOf<
  JournalEntryPageVideoSheet.PrepareContentContext["yt"]
>().toEqualTypeOf<JournalEntryPageVideoSheet.YouTubeContext>();

// `undefined` when the page has no starting timestamp, or when this component is zero.
expectTypeOf<JournalEntryPageVideoSheet.TimestampPart["value"]>().toEqualTypeOf<number | undefined>();
expectTypeOf<JournalEntryPageVideoSheet.TimestampPart["field"]>().toEqualTypeOf<foundry.data.fields.NumberField>();

// The minutes and seconds components render as text inputs rather than number inputs.
expectTypeOf<JournalEntryPageVideoSheet.TimestampTextPart>().toExtend<JournalEntryPageVideoSheet.TimestampPart>();
expectTypeOf<JournalEntryPageVideoSheet.TimestampTextPart["input"]>().returns.toEqualTypeOf<HTMLInputElement>();
expectTypeOf<
  JournalEntryPageVideoSheet.TimestampContext["h"]
>().toEqualTypeOf<JournalEntryPageVideoSheet.TimestampPart>();
expectTypeOf<
  JournalEntryPageVideoSheet.TimestampContext["m"]
>().toEqualTypeOf<JournalEntryPageVideoSheet.TimestampTextPart>();

expectTypeOf<JournalEntryPageVideoSheet.YouTubeContext["id"]>().toEqualTypeOf<string>();
expectTypeOf<JournalEntryPageVideoSheet.SourceInput>().returns.toEqualTypeOf<HTMLFilePickerElement>();
