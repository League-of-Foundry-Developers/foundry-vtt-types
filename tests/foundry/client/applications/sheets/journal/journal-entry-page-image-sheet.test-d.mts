import { expectTypeOf } from "vitest";

import JournalEntryPageImageSheet = foundry.applications.sheets.journal.JournalEntryPageImageSheet;
import JournalEntryPageSheet = foundry.applications.sheets.journal.JournalEntryPageSheet;
import HandlebarsApplicationMixin = foundry.applications.api.HandlebarsApplicationMixin;
import HTMLFilePickerElement = foundry.applications.elements.HTMLFilePickerElement;
import type { DeepPartial } from "fvtt-types/utils";

declare const sheet: JournalEntryPageImageSheet;
declare const prepareContextOptions: DeepPartial<JournalEntryPageImageSheet.RenderOptions> & { isFirstRender: boolean };

expectTypeOf(JournalEntryPageImageSheet.DEFAULT_OPTIONS).toEqualTypeOf<JournalEntryPageSheet.DefaultOptions>();
expectTypeOf(JournalEntryPageImageSheet.EDIT_PARTS).toEqualTypeOf<
  Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
expectTypeOf(JournalEntryPageImageSheet.VIEW_PARTS).toEqualTypeOf<
  Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();

expectTypeOf(sheet["_prepareContext"](prepareContextOptions)).toEqualTypeOf<
  Promise<JournalEntryPageImageSheet.RenderContext>
>();

expectTypeOf<JournalEntryPageImageSheet.RenderContext["src"]>().toEqualTypeOf<JournalEntryPage.Implementation["src"]>();
expectTypeOf<JournalEntryPageImageSheet.RenderContext["caption"]>().toEqualTypeOf<
  JournalEntryPage.ImageSource["caption"]
>();
expectTypeOf<
  JournalEntryPageImageSheet.RenderContext["srcInput"]
>().toEqualTypeOf<JournalEntryPageImageSheet.SourceInput>();

// The `field` parameter exists only so this can be called as a Handlebars field helper.
expectTypeOf<JournalEntryPageImageSheet.SourceInput>().returns.toEqualTypeOf<HTMLFilePickerElement>();
expectTypeOf<
  Parameters<JournalEntryPageImageSheet.SourceInput>[0]
>().toEqualTypeOf<foundry.data.fields.DataField.Any>();
expectTypeOf<Parameters<JournalEntryPageImageSheet.SourceInput>[1]>().toEqualTypeOf<
  foundry.applications.fields.FormInputConfig<string>
>();
