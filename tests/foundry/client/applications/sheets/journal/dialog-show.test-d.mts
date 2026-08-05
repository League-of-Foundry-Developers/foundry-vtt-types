import { expectTypeOf } from "vitest";

import ShowToPlayersDialog = foundry.applications.sheets.journal.ShowToPlayersDialog;
import DialogV2 = foundry.applications.api.DialogV2;
import ApplicationV2 = foundry.applications.api.ApplicationV2;
import HandlebarsApplicationMixin = foundry.applications.api.HandlebarsApplicationMixin;
import type { DeepPartial } from "fvtt-types/utils";

declare const dialog: ShowToPlayersDialog;
declare const prepareContextOptions: DeepPartial<ShowToPlayersDialog.RenderOptions> & { isFirstRender: boolean };
declare const formConfig: ApplicationV2.FormConfiguration;
declare const event: Event;

expectTypeOf(ShowToPlayersDialog.DEFAULT_OPTIONS).toEqualTypeOf<DialogV2.DefaultOptions>();
expectTypeOf(ShowToPlayersDialog.PARTS).toEqualTypeOf<
  Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();

expectTypeOf(dialog.document).toEqualTypeOf<JournalEntry.Implementation | JournalEntryPage.Implementation>();
expectTypeOf(dialog.isImage).toEqualTypeOf<boolean>();
expectTypeOf(dialog.title).toEqualTypeOf<string>();
expectTypeOf(dialog["_prepareContext"](prepareContextOptions)).toEqualTypeOf<
  Promise<ShowToPlayersDialog.RenderContext>
>();
expectTypeOf(dialog["_onChangeForm"](formConfig, event)).toEqualTypeOf<void>();

expectTypeOf<ShowToPlayersDialog.Configuration["document"]>().toEqualTypeOf<
  JournalEntry.Implementation | JournalEntryPage.Implementation
>();

expectTypeOf<ShowToPlayersDialog.RenderContext["buttons"]>().toEqualTypeOf<DialogV2.Button[]>();
expectTypeOf<ShowToPlayersDialog.RenderContext["isImage"]>().toEqualTypeOf<boolean>();
expectTypeOf<ShowToPlayersDialog.RenderContext["isGM"]>().toEqualTypeOf<boolean>();
expectTypeOf<ShowToPlayersDialog.RenderContext["users"]>().toEqualTypeOf<User.Implementation[]>();
expectTypeOf<ShowToPlayersDialog.RenderContext["levels"]>().toEqualTypeOf<ShowToPlayersDialog.OwnershipChoice[]>();
expectTypeOf<ShowToPlayersDialog.RenderContext["image"]>().toEqualTypeOf<ShowToPlayersDialog.ImageFields>();

// `INHERIT` is only offered for non-embedded Documents, so both level enums are possible.
expectTypeOf<ShowToPlayersDialog.OwnershipChoice["value"]>().toEqualTypeOf<
  CONST.DOCUMENT_META_OWNERSHIP_LEVELS | CONST.DOCUMENT_OWNERSHIP_LEVELS
>();
expectTypeOf<ShowToPlayersDialog.OwnershipChoice["label"]>().toEqualTypeOf<string>();

expectTypeOf<ShowToPlayersDialog.ImageFields["only"]>().toEqualTypeOf<
  foundry.data.fields.BooleanField<{ label: "JOURNALENTRYPAGE.ShowImageOnly" }>
>();
