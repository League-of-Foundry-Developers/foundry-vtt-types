import { expectTypeOf } from "vitest";
import type { GetDataReturnType } from "fvtt-types/utils";

declare const adventure: Adventure.Implementation & { pack: string };
const adventureExporter = new AdventureExporter(adventure);

expectTypeOf(adventureExporter.object).toEqualTypeOf<Adventure.Implementation>();
expectTypeOf(adventureExporter.document).toEqualTypeOf<Adventure.Implementation>();
expectTypeOf(AdventureExporter.defaultOptions).toEqualTypeOf<AdventureExporter.Options>();
expectTypeOf(adventureExporter.options).toEqualTypeOf<AdventureExporter.Options>();
expectTypeOf(adventureExporter.getData()).toEqualTypeOf<
  Promise<GetDataReturnType<AdventureExporter.AdventureExporterData>>
>();
expectTypeOf(adventureExporter.render(true)).toEqualTypeOf<AdventureExporter>();

expectTypeOf(adventureExporter.adventure).toEqualTypeOf<Adventure.Implementation>();
expectTypeOf(adventureExporter.contentTree).toEqualTypeOf<Record<string, AdventureExporter.AdventureContentTreeRoot>>();
