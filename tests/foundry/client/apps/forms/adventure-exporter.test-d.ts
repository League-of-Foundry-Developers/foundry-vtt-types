import { expectTypeOf } from "vitest";
import type { GetDataReturnType } from "../../../../../src/utils/index.d.mts";

const adventure = new Adventure({ name: "Some dude" }, { pack: "abc" }) as Adventure & { pack: string };
const adventureExporter = new AdventureExporter(adventure);

expectTypeOf(adventureExporter.object).toEqualTypeOf<Adventure>();
expectTypeOf(adventureExporter.document).toEqualTypeOf<Adventure>();
expectTypeOf(AdventureExporter.defaultOptions).toEqualTypeOf<AdventureExporter.Options>();
expectTypeOf(adventureExporter.options).toEqualTypeOf<AdventureExporter.Options>();
expectTypeOf(adventureExporter.getData()).toEqualTypeOf<
  Promise<GetDataReturnType<AdventureExporter.AdventureExporterData>>
>();
expectTypeOf(adventureExporter.render(true)).toEqualTypeOf<AdventureExporter>();

expectTypeOf(adventureExporter.adventure).toEqualTypeOf<Adventure>();
expectTypeOf(adventureExporter.contentTree).toEqualTypeOf<Record<string, AdventureExporter.AdventureContentTreeRoot>>();
