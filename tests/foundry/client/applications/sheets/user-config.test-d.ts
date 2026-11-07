import { expectTypeOf, test } from "vitest";
import type { MaybePromise } from "fvtt-types/utils";

declare const doc: User.Implementation;
declare const formConfig: foundry.applications.api.ApplicationV2.FormConfiguration;
declare const event: Event;

test("foundry/client/applications/sheets/user-config", () => {
  const userSheet = new foundry.applications.sheets.UserConfig({ document: doc });

  expectTypeOf(userSheet.title).toEqualTypeOf<string>();
  expectTypeOf(userSheet["_onChangeForm"](formConfig, event)).toEqualTypeOf<MaybePromise<void>>();

  expectTypeOf(
    foundry.applications.sheets.UserConfig.DEFAULT_OPTIONS,
  ).toEqualTypeOf<foundry.applications.api.DocumentSheetV2.DefaultOptions>();
  expectTypeOf(foundry.applications.sheets.UserConfig.PARTS).toEqualTypeOf<
    Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
  >();

  expectTypeOf<foundry.applications.sheets.UserConfig.RenderContext["currentUserIsGM"]>().toEqualTypeOf<boolean>();
  expectTypeOf<foundry.applications.sheets.UserConfig.RenderContext["canUpdatePassword"]>().toEqualTypeOf<boolean>();
});
