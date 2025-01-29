import { expectTypeOf } from "vitest";

const worldSettings = new WorldSettings([]);
expectTypeOf(worldSettings.get("", { strict: true })).toEqualTypeOf<Setting.Stored>();
expectTypeOf(worldSettings.getSetting("foo")).toEqualTypeOf<Setting.Stored | undefined>();
expectTypeOf(worldSettings.toJSON()).toEqualTypeOf<Setting.Stored["_source"][]>();
expectTypeOf(worldSettings.directory).toEqualTypeOf<null>();
