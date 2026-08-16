import { expectTypeOf } from "vitest";

import AdventureImporterV2 = foundry.applications.sheets.AdventureImporterV2;
import ApplicationV2 = foundry.applications.api.ApplicationV2;
import DocumentSheetV2 = foundry.applications.api.DocumentSheetV2;

declare const doc: Adventure.Implementation;
const importer = new AdventureImporterV2({ document: doc });

expectTypeOf(importer.adventure).toEqualTypeOf<Adventure.Implementation>();
expectTypeOf(importer.isEditable).toBeBoolean();

expectTypeOf(AdventureImporterV2.DEFAULT_OPTIONS).toEqualTypeOf<DocumentSheetV2.DefaultOptions>();

declare const importOptions: Adventure.ImportOptions;
declare const importData: Adventure.ImportData;
declare const importResult: Adventure.ImportResult;
expectTypeOf(importer._configureImport(importOptions)).toEqualTypeOf<Promise<void>>();
expectTypeOf(importer._preImport(importData, importOptions)).toEqualTypeOf<Promise<void>>();
expectTypeOf(importer._onImport(importResult, importOptions)).toEqualTypeOf<Promise<void>>();

declare const context: AdventureImporterV2.RenderContext;
expectTypeOf(context.adventure).toEqualTypeOf<Adventure.Implementation>();
expectTypeOf(context.description).toBeString();
expectTypeOf(context.loading).toBeBoolean();
expectTypeOf(context.contents).toEqualTypeOf<AdventureImporterV2.ContentListEntry[]>();
expectTypeOf(context.imported).toBeBoolean();
expectTypeOf(context.optionsSchema).toEqualTypeOf<foundry.data.fields.SchemaField.Any | undefined>();
expectTypeOf(context.buttons).toEqualTypeOf<ApplicationV2.FormFooterButton[]>();

class CustomAdventureImporter extends AdventureImporterV2 {
  protected override _getContentList(): AdventureImporterV2.ContentListEntry[] {
    return super._getContentList();
  }

  protected override _onToggleImportAll(event: Event): void {
    super._onToggleImportAll(event);
  }
}

expectTypeOf(CustomAdventureImporter).toExtend<AdventureImporterV2.AnyConstructor>();
