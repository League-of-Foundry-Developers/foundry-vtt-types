import { expectTypeOf } from "vitest";
import Document = foundry.abstract.Document;

const fogExplorations = new FogExplorations([]);
expectTypeOf(fogExplorations.get("", { strict: true })).toEqualTypeOf<FogExploration.Stored>();
expectTypeOf(fogExplorations.toJSON()).toEqualTypeOf<FogExploration.Stored["_source"][]>();
expectTypeOf(fogExplorations.directory).toEqualTypeOf<undefined | SidebarTab | null>();
