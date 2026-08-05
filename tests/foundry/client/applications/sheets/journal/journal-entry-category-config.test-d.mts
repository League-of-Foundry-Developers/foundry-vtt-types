import { expectTypeOf } from "vitest";

import JournalEntryCategoryConfig = foundry.applications.sheets.journal.JournalEntryCategoryConfig;
import DocumentSheetV2 = foundry.applications.api.DocumentSheetV2;
import HandlebarsApplicationMixin = foundry.applications.api.HandlebarsApplicationMixin;
import type { DeepPartial } from "fvtt-types/utils";

declare const config: JournalEntryCategoryConfig;
declare const prepareContextOptions: DeepPartial<JournalEntryCategoryConfig.RenderOptions> & {
  isFirstRender: boolean;
};
declare const event: SubmitEvent;
declare const form: HTMLFormElement;
declare const submitData: DocumentSheetV2.SubmitData<JournalEntry.Implementation>;

expectTypeOf(JournalEntryCategoryConfig.DEFAULT_OPTIONS).toEqualTypeOf<DocumentSheetV2.DefaultOptions>();
expectTypeOf(JournalEntryCategoryConfig.PARTS).toEqualTypeOf<
  Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();

expectTypeOf(config.document).toEqualTypeOf<JournalEntry.Implementation>();
expectTypeOf(config.title).toEqualTypeOf<string>();
expectTypeOf(config["_prepareContext"](prepareContextOptions)).toEqualTypeOf<
  Promise<JournalEntryCategoryConfig.RenderContext>
>();

// `submitData` is ignored; the parent entry's categories are rebuilt from the form's current ordering.
expectTypeOf(config["_processSubmitData"](event, form, submitData)).toEqualTypeOf<
  Promise<DocumentSheetV2.SubmitResult<JournalEntry.Implementation>>
>();

expectTypeOf<JournalEntryCategoryConfig.RenderContext["categories"]>().toEqualTypeOf<
  JournalEntryCategoryConfig.CategoryContext[]
>();
expectTypeOf<JournalEntryCategoryConfig.CategoryContext["field"]>().toEqualTypeOf<
  foundry.data.fields.StringField<{ blank: false }>
>();
expectTypeOf<JournalEntryCategoryConfig.CategoryContext["id"]>().toEqualTypeOf<string>();
expectTypeOf<JournalEntryCategoryConfig.CategoryContext["name"]>().toEqualTypeOf<string>();
expectTypeOf<JournalEntryCategoryConfig.CategoryContext["placeholder"]>().toEqualTypeOf<string>();
expectTypeOf<JournalEntryCategoryConfig.CategoryContext["sort"]>().toEqualTypeOf<number>();
