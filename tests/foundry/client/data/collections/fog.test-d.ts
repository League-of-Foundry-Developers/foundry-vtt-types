import { expectTypeOf } from "vitest";
import type Document from "../../../../../src/foundry/common/abstract/document.d.mts";

const fogExplorations = new FogExplorations([]);
expectTypeOf(fogExplorations.get("", { strict: true })).toEqualTypeOf<Document.Stored<FogExploration>>();
expectTypeOf(fogExplorations.toJSON()).toEqualTypeOf<Document.Stored<FogExploration>["_source"][]>();
expectTypeOf(fogExplorations.directory).toEqualTypeOf<undefined | SidebarTab | null>();
