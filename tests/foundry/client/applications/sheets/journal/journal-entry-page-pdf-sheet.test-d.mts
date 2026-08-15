import { expectTypeOf } from "vitest";

import JournalEntryPagePDFSheet = foundry.applications.sheets.journal.JournalEntryPagePDFSheet;
import JournalEntryPageSheet = foundry.applications.sheets.journal.JournalEntryPageSheet;
import HandlebarsApplicationMixin = foundry.applications.api.HandlebarsApplicationMixin;
import HTMLFilePickerElement = foundry.applications.elements.HTMLFilePickerElement;

declare const sheet: JournalEntryPagePDFSheet;
declare const pointerEvent: PointerEvent;

expectTypeOf(JournalEntryPagePDFSheet.DEFAULT_OPTIONS).toEqualTypeOf<JournalEntryPageSheet.DefaultOptions>();
expectTypeOf(JournalEntryPagePDFSheet.EDIT_PARTS).toEqualTypeOf<
  Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
expectTypeOf(JournalEntryPagePDFSheet.VIEW_PARTS).toEqualTypeOf<
  Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
expectTypeOf(JournalEntryPagePDFSheet["_sizes"]).toEqualTypeOf<Record<string, number>>();

expectTypeOf(sheet["_prepareContentContext"]).returns.toEqualTypeOf<Promise<void>>();
expectTypeOf(sheet["_onRender"]).returns.toEqualTypeOf<Promise<void>>();
expectTypeOf(sheet["_onLoadPDF"](pointerEvent)).toEqualTypeOf<void>();
expectTypeOf(sheet["_getViewerParams"]()).toEqualTypeOf<URLSearchParams>();

// The content part's members are only set for that part, so they are optional on the shared render context.
expectTypeOf<JournalEntryPagePDFSheet.RenderContext["params"]>().toEqualTypeOf<URLSearchParams | undefined>();
expectTypeOf<JournalEntryPagePDFSheet.RenderContext["src"]>().toEqualTypeOf<
  JournalEntryPage.Implementation["src"] | undefined
>();
expectTypeOf<JournalEntryPagePDFSheet.RenderContext["srcInput"]>().toEqualTypeOf<
  JournalEntryPagePDFSheet.SourceInput | undefined
>();

expectTypeOf<JournalEntryPagePDFSheet.PrepareContentContext["params"]>().toEqualTypeOf<URLSearchParams>();
expectTypeOf<JournalEntryPagePDFSheet.SourceInput>().returns.toEqualTypeOf<HTMLFilePickerElement>();
