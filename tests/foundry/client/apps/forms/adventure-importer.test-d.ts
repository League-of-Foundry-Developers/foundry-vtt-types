import { expectTypeOf } from "vitest";
import type { GetDataReturnType } from "fvtt-types/utils";

const adventure = new Adventure({ name: "Fun adventure" });
const adventureImporter = new AdventureImporter(adventure);

expectTypeOf(adventureImporter.object).toEqualTypeOf<Adventure>();
expectTypeOf(adventureImporter.document).toEqualTypeOf<Adventure>();
expectTypeOf(AdventureImporter.defaultOptions).toEqualTypeOf<AdventureImporter.Options>();
expectTypeOf(adventureImporter.options).toEqualTypeOf<AdventureImporter.Options>();
expectTypeOf(adventureImporter.getData()).toEqualTypeOf<
  Promise<GetDataReturnType<AdventureImporter.AdventureExporterData>>
>();
expectTypeOf(adventureImporter.render(true)).toEqualTypeOf<AdventureExporter>();

expectTypeOf(adventureImporter.adventure).toEqualTypeOf<Adventure>();
expectTypeOf(adventureImporter.isEditable).toEqualTypeOf<boolean>();
