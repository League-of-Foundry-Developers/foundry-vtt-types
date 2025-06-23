import { expectTypeOf } from "vitest";
import type { GetDataReturnType } from "fvtt-types/utils";

import AdventureImporter = foundry.appv1.sheets.AdventureImporter;

declare const adventure: Adventure.Implementation;
const adventureImporter = new AdventureImporter(adventure);

expectTypeOf(adventureImporter.object).toEqualTypeOf<Adventure.Implementation>();
expectTypeOf(adventureImporter.document).toEqualTypeOf<Adventure.Implementation>();
expectTypeOf(AdventureImporter.defaultOptions).toEqualTypeOf<AdventureImporter.Options>();
expectTypeOf(adventureImporter.options).toEqualTypeOf<AdventureImporter.Options>();
expectTypeOf(adventureImporter.getData()).toEqualTypeOf<
  Promise<GetDataReturnType<AdventureImporter.AdventureImporterData>>
>();
expectTypeOf(adventureImporter.render(true)).toEqualTypeOf<AdventureImporter>();

expectTypeOf(adventureImporter.adventure).toEqualTypeOf<Adventure.Implementation>();
expectTypeOf(adventureImporter.isEditable).toEqualTypeOf<boolean>();
