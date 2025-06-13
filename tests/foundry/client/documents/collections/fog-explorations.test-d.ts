import { expectTypeOf } from "vitest";
import { FogExplorations } from "#client/documents/collections/_module.mjs";

const fogExplorations = new FogExplorations([]);
expectTypeOf(fogExplorations.get("", { strict: true })).toEqualTypeOf<FogExploration.Stored>();
expectTypeOf(fogExplorations.toJSON()).toEqualTypeOf<FogExploration.Stored["_source"][]>();
expectTypeOf(fogExplorations.directory).toEqualTypeOf<
  undefined | foundry.applications.sidebar.AbstractSidebarTab.Any | null
>();
