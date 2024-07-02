import { expectTypeOf } from "vitest";
import type { StoredDocument } from "../../../../../src/types/utils.d.mts";

const fogExplorations = new FogExplorations([]);
expectTypeOf(fogExplorations.get("", { strict: true })).toEqualTypeOf<StoredDocument<FogExploration>>();
expectTypeOf(fogExplorations.toJSON()).toEqualTypeOf<StoredDocument<FogExploration>["_source"][]>();
expectTypeOf(fogExplorations.directory).toEqualTypeOf<undefined | SidebarTab | null>();
