import { expectTypeOf } from "vitest";

declare const doc: Adventure.Implementation;
const adventureImporter = new foundry.applications.sheets.AdventureImporterV2({ document: doc });

expectTypeOf(adventureImporter.document).toEqualTypeOf<Adventure.Implementation>();
expectTypeOf(adventureImporter.adventure).toEqualTypeOf<Adventure.Implementation>();
expectTypeOf(adventureImporter.isEditable).toEqualTypeOf<boolean>();

expectTypeOf(
  foundry.applications.sheets.AdventureImporterV2.DEFAULT_OPTIONS,
).toEqualTypeOf<foundry.applications.api.DocumentSheetV2.DefaultOptions>();
expectTypeOf(foundry.applications.sheets.AdventureImporterV2.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();

declare class _TestAdventureImporterSubclass extends foundry.applications.sheets.AdventureImporterV2 {
  protected override _configureImport(importOptions: Adventure.ImportOptions): Promise<void>;
  protected override _preImport(
    importData: Adventure.ImportData,
    importOptions: Adventure.ImportOptions,
  ): Promise<void>;
  protected override _onImport(
    importResult: Adventure.ImportResult,
    importOptions: Adventure.ImportOptions,
  ): Promise<void>;
}
