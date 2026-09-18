import { expectTypeOf, test } from "vitest";
import type { GetDataReturnType } from "fvtt-types/utils";

import AdventureImporter = foundry.appv1.sheets.AdventureImporter;

declare const adventure: Adventure.Implementation;

// V14 forwards the three fields of `Adventure.ImportData` individually.
declare const importData: Adventure.ImportData;

declare const contentList: AdventureImporter.ContentListEntry;

test("foundry/client/appv1/sheets/adventure-importer", () => {
  const adventureImporter = new AdventureImporter(adventure);

  expectTypeOf(adventureImporter.object).toEqualTypeOf<Adventure.Implementation>();
  expectTypeOf(adventureImporter.document).toEqualTypeOf<Adventure.Implementation>();
  expectTypeOf(AdventureImporter.defaultOptions).toEqualTypeOf<AdventureImporter.Options>();
  expectTypeOf(adventureImporter.options).toEqualTypeOf<AdventureImporter.Options>();
  expectTypeOf(adventureImporter.getData()).toEqualTypeOf<Promise<GetDataReturnType<AdventureImporter.Data>>>();
  expectTypeOf(adventureImporter.render(true)).toEqualTypeOf<AdventureImporter>();

  expectTypeOf(adventureImporter.adventure).toEqualTypeOf<Adventure.Implementation>();
  expectTypeOf(adventureImporter.isEditable).toEqualTypeOf<boolean>();
  expectTypeOf(
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    adventureImporter._importContent(importData.toCreate, importData.toUpdate, importData.documentCount),
  ).toEqualTypeOf<Promise<Adventure.ImportResult>>();
  expectTypeOf(contentList.field).toEqualTypeOf<keyof typeof foundry.documents.BaseAdventure.contentFields>();
});
