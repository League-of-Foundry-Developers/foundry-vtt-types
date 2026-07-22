import { expectTypeOf } from "vitest";

declare const doc: TableResult.Implementation;
const sheet = new foundry.applications.sheets.TableResultConfig({ document: doc });

expectTypeOf(sheet.document).toEqualTypeOf<TableResult.Implementation>();

expectTypeOf(
  foundry.applications.sheets.TableResultConfig.DEFAULT_OPTIONS,
).toEqualTypeOf<foundry.applications.api.DocumentSheetV2.DefaultOptions>();
expectTypeOf(foundry.applications.sheets.TableResultConfig.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
expectTypeOf(foundry.applications.sheets.TableResultConfig.RESULT_TYPES).toEqualTypeOf<
  { value: string; label: string }[]
>();
expectTypeOf(foundry.applications.sheets.TableResultConfig.prepareResultUpdateData).toBeFunction();
