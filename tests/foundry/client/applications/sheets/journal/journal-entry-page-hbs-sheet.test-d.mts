import { expectTypeOf } from "vitest";

import JournalEntryPageHandlebarsSheet = foundry.applications.sheets.journal.JournalEntryPageHandlebarsSheet;
import HandlebarsApplicationMixin = foundry.applications.api.HandlebarsApplicationMixin;
import ApplicationV2 = foundry.applications.api.ApplicationV2;
import DocumentSheetV2 = foundry.applications.api.DocumentSheetV2;
import FormDataExtended = foundry.applications.ux.FormDataExtended;
import type { DeepPartial } from "fvtt-types/utils";

declare const sheet: JournalEntryPageHandlebarsSheet;
declare const partOptions: HandlebarsApplicationMixin.RenderOptions;
declare const event: SubmitEvent;
declare const form: HTMLFormElement;
declare const formData: FormDataExtended;

expectTypeOf(JournalEntryPageHandlebarsSheet.EDIT_PARTS).toEqualTypeOf<
  Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
expectTypeOf(JournalEntryPageHandlebarsSheet.VIEW_PARTS).toEqualTypeOf<
  Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();

expectTypeOf(sheet["_configureRenderParts"](partOptions)).toEqualTypeOf<
  Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
expectTypeOf(sheet["_prepareContentContext"]).returns.toEqualTypeOf<Promise<void>>();
expectTypeOf(sheet["_prepareHeaderContext"]).returns.toEqualTypeOf<Promise<void>>();
expectTypeOf(sheet["_prepareFooterContext"]).returns.toEqualTypeOf<Promise<void>>();
expectTypeOf(sheet["_preparePartContext"]).returns.toEqualTypeOf<
  Promise<ApplicationV2.RenderContextOf<JournalEntryPageHandlebarsSheet>>
>();
expectTypeOf(sheet["_prepareSubmitData"](event, form, formData)).toEqualTypeOf<
  DocumentSheetV2.SubmitData<JournalEntryPage.Implementation>
>();

// Each part context member is only set for the one part that consumes it, so all of them are optional on the
// shared render context.
expectTypeOf<JournalEntryPageHandlebarsSheet.RenderContext["categories"]>().toEqualTypeOf<
  JournalEntryPageHandlebarsSheet.CategoryChoice[] | undefined
>();
expectTypeOf<JournalEntryPageHandlebarsSheet.RenderContext["headingLevels"]>().toEqualTypeOf<
  Record<string, string> | undefined
>();
expectTypeOf<JournalEntryPageHandlebarsSheet.RenderContext["buttons"]>().toEqualTypeOf<
  ApplicationV2.FormFooterButton[] | undefined
>();

// They are required on the part context they originate from.
expectTypeOf<JournalEntryPageHandlebarsSheet.PreparePartContext["categories"]>().toEqualTypeOf<
  JournalEntryPageHandlebarsSheet.CategoryChoice[]
>();
expectTypeOf<JournalEntryPageHandlebarsSheet.PreparePartContext["headingLevels"]>().toEqualTypeOf<
  Record<string, string>
>();

expectTypeOf<JournalEntryPageHandlebarsSheet.CategoryChoice["value"]>().toEqualTypeOf<string>();
expectTypeOf<JournalEntryPageHandlebarsSheet.CategoryChoice["label"]>().toEqualTypeOf<string>();

class TestJournalEntryPageHandlebarsSheet extends JournalEntryPageHandlebarsSheet {
  protected override async _prepareContentContext(
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<JournalEntryPageHandlebarsSheet.RenderOptions>,
  ): Promise<void> {
    await super._prepareContentContext(context, options);
  }
}

declare const testSheet: TestJournalEntryPageHandlebarsSheet;
expectTypeOf(testSheet.page).toEqualTypeOf<JournalEntryPage.Implementation>();
