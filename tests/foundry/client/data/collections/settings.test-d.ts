import { expectTypeOf } from "vitest";
import type Document from "../../../../../src/foundry/common/abstract/document.d.mts";

const worldSettings = new WorldSettings([]);
expectTypeOf(worldSettings.get("", { strict: true })).toEqualTypeOf<Document.Stored<Setting>>();
expectTypeOf(worldSettings.getSetting("foo")).toEqualTypeOf<Document.Stored<Setting> | undefined>();
expectTypeOf(worldSettings.toJSON()).toEqualTypeOf<Document.Stored<Setting>["_source"][]>();
expectTypeOf(worldSettings.directory).toEqualTypeOf<null>();
