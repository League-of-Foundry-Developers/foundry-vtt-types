import { expectTypeOf } from "vitest";

const fogExplorations = new FogExplorations([]);
expectTypeOf(fogExplorations.get("", { strict: true })).toEqualTypeOf<FogExploration.Stored>();
expectTypeOf(fogExplorations.toJSON()).toEqualTypeOf<FogExploration.Stored["_source"][]>();
expectTypeOf(fogExplorations.directory).toEqualTypeOf<undefined | SidebarTab | null>();
