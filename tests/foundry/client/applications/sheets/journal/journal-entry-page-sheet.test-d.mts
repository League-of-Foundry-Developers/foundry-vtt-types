import { expectTypeOf } from "vitest";

import JournalEntryPageSheet = foundry.applications.sheets.journal.JournalEntryPageSheet;
import DocumentSheetV2 = foundry.applications.api.DocumentSheetV2;
import type { DeepPartial } from "fvtt-types/utils";

declare const sheet: JournalEntryPageSheet;
declare const element: HTMLElement;
declare const renderOptions: DeepPartial<JournalEntryPageSheet.RenderOptions>;
declare const prepareContextOptions: DeepPartial<JournalEntryPageSheet.RenderOptions> & { isFirstRender: boolean };

expectTypeOf(JournalEntryPageSheet.DEFAULT_OPTIONS).toEqualTypeOf<JournalEntryPageSheet.DefaultOptions>();
expectTypeOf(JournalEntryPageSheet.emittedEvents).toEqualTypeOf<string[]>();
expectTypeOf(JournalEntryPageSheet.isV2).toEqualTypeOf<boolean>();

expectTypeOf(sheet.document).toEqualTypeOf<JournalEntryPage.Implementation>();
expectTypeOf(sheet.page).toEqualTypeOf<JournalEntryPage.Implementation>();
expectTypeOf(sheet.isV2).toEqualTypeOf<boolean>();
expectTypeOf(sheet.isView).toEqualTypeOf<boolean>();

// `undefined` until the first render with `includeTOC` enabled.
expectTypeOf(sheet.toc).toEqualTypeOf<JournalEntryPage.TOC | undefined>();

expectTypeOf(sheet["_insertElement"](element)).toEqualTypeOf<Promise<void>>();
expectTypeOf(sheet["_insertElement"](element, renderOptions)).toEqualTypeOf<Promise<void>>();
expectTypeOf(sheet["_prepareContext"](prepareContextOptions)).toEqualTypeOf<
  Promise<JournalEntryPageSheet.RenderContext>
>();
expectTypeOf(sheet["_prepareHeadingLevels"]()).toEqualTypeOf<Record<string, string>>();
expectTypeOf(sheet["_onCloseView"]()).toEqualTypeOf<void>();

expectTypeOf<JournalEntryPageSheet.RenderContext>().toExtend<
  DocumentSheetV2.RenderContext<JournalEntryPage.Implementation>
>();
expectTypeOf<JournalEntryPageSheet.RenderContext["name"]>().toEqualTypeOf<string>();
expectTypeOf<JournalEntryPageSheet.RenderContext["uuid"]>().toEqualTypeOf<string>();
expectTypeOf<JournalEntryPageSheet.RenderContext["title"]>().toEqualTypeOf<JournalEntryPage.Implementation["title"]>();

expectTypeOf<JournalEntryPageSheet.Configuration["includeTOC"]>().toEqualTypeOf<boolean>();
expectTypeOf<JournalEntryPageSheet.Configuration["mode"]>().toEqualTypeOf<"edit" | "view">();
expectTypeOf<JournalEntryPageSheet.Configuration["viewClasses"]>().toEqualTypeOf<string[]>();

class TestJournalEntryPageSheet extends JournalEntryPageSheet {
  protected override _prepareHeadingLevels(): Record<string, string> {
    return super._prepareHeadingLevels();
  }

  protected override _onCloseView(): void {
    super._onCloseView();
  }
}

declare const testSheet: TestJournalEntryPageSheet;
expectTypeOf(testSheet.toc).toEqualTypeOf<JournalEntryPage.TOC | undefined>();
