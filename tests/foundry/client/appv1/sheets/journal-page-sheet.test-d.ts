import { expectTypeOf } from "vitest";
import type { GetDataReturnType, MaybePromise } from "fvtt-types/utils";

import JournalPageSheet = foundry.appv1.sheets.JournalPageSheet;

declare const journalEntryPage: JournalEntryPage.Implementation;
const journalPageSheet = new JournalPageSheet(journalEntryPage);

expectTypeOf(journalPageSheet.object).toEqualTypeOf<JournalEntryPage.Implementation>();
expectTypeOf(journalPageSheet.document).toEqualTypeOf<JournalEntryPage.Implementation>();
expectTypeOf(JournalPageSheet.defaultOptions).toEqualTypeOf<JournalPageSheet.Options>();
expectTypeOf(journalPageSheet.options).toEqualTypeOf<JournalPageSheet.Options>();
expectTypeOf(journalPageSheet.getData()).toEqualTypeOf<MaybePromise<GetDataReturnType<JournalPageSheet.Data>>>();
expectTypeOf(journalPageSheet.render(true)).toEqualTypeOf<JournalPageSheet>();

expectTypeOf(JournalPageSheet.isV2).toEqualTypeOf<boolean>();
expectTypeOf(journalPageSheet.isV2).toEqualTypeOf<boolean>();

// Options registered by `defaultOptions` but previously missing from the interface.
expectTypeOf(journalPageSheet.options.viewClasses).toEqualTypeOf<string[]>();
expectTypeOf(journalPageSheet.options.includeTOC).toEqualTypeOf<boolean>();

// `getData` gained a conditional `categories` list in V14.
declare const pageData: JournalPageSheet.Data;
expectTypeOf(pageData.categories).toEqualTypeOf<JournalPageSheet.CategoryChoice[] | undefined>();

declare const journalTextPageSheet: foundry.appv1.sheets.JournalTextPageSheet;
expectTypeOf(journalTextPageSheet.saveEditor("content")).toEqualTypeOf<Promise<void>>();
expectTypeOf(journalTextPageSheet.saveEditor("content", { preventRender: false })).toEqualTypeOf<Promise<void>>();
expectTypeOf(journalTextPageSheet.isEditorDirty()).toEqualTypeOf<boolean>();

// Subclasses can override the new protected hooks (the `override` keyword would error if signatures didn't match).
class CustomJournalPageSheet extends JournalPageSheet {
  protected override _closeView(): void {}
  protected override _onAutosave(_html: string): void {}
  protected override _onNewSteps(): void {}
}
void CustomJournalPageSheet;
