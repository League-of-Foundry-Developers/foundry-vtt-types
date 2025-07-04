import { expectTypeOf } from "vitest";

declare const doc: User.Implementation;
const userSheet = new foundry.applications.sheets.UserConfig({ document: doc });

expectTypeOf(userSheet.title).toEqualTypeOf<string>();

expectTypeOf(
  foundry.applications.sheets.UserConfig.DEFAULT_OPTIONS,
).toEqualTypeOf<foundry.applications.api.DocumentSheetV2.DefaultOptions>();
expectTypeOf(foundry.applications.sheets.UserConfig.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
