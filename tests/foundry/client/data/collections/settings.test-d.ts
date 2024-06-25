import { expectTypeOf } from "vitest";
import type { StoredDocument } from "../../../../../src/types/utils.d.mts";

const worldSettings = new WorldSettings();
expectTypeOf(worldSettings.get("", { strict: true })).toEqualTypeOf<StoredDocument<Setting>>();
expectTypeOf(worldSettings.getSetting("foo")).toEqualTypeOf<StoredDocument<Setting> | undefined>();
expectTypeOf(worldSettings.toJSON()).toEqualTypeOf<StoredDocument<Setting>["_source"][]>();
expectTypeOf(worldSettings.directory).toEqualTypeOf<null>();
