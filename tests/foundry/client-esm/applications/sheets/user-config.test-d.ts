import { expectTypeOf } from "vitest";

declare const doc: User;
const userSheet = new foundry.applications.sheets.UserConfig({ document: doc });

expectTypeOf(userSheet.title).toEqualTypeOf<string>();

expectTypeOf(foundry.applications.sheets.UserConfig.DEFAULT_OPTIONS).toEqualTypeOf<
  foundry.applications.api.DocumentSheetV2.Configuration<User>
>();
expectTypeOf(foundry.applications.sheets.UserConfig.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
