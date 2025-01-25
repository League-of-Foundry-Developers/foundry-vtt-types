import { expectTypeOf } from "vitest";
import type { GetDataReturnType } from "fvtt-types/utils";

declare const adventure: Adventure;
const adventureImporter = new AdventureImporter(adventure);

expectTypeOf(adventureImporter.object).toEqualTypeOf<Adventure>();
expectTypeOf(adventureImporter.document).toEqualTypeOf<Adventure>();
expectTypeOf(AdventureImporter.defaultOptions).toEqualTypeOf<AdventureImporter.Options>();
expectTypeOf(adventureImporter.options).toEqualTypeOf<AdventureImporter.Options>();
expectTypeOf(adventureImporter.getData()).toEqualTypeOf<
  Promise<GetDataReturnType<AdventureImporter.AdventureImporterData>>
>();
expectTypeOf(adventureImporter.render(true)).toEqualTypeOf<AdventureExporter>();

expectTypeOf(adventureImporter.adventure).toEqualTypeOf<Adventure>();
expectTypeOf(adventureImporter.isEditable).toEqualTypeOf<boolean>();
