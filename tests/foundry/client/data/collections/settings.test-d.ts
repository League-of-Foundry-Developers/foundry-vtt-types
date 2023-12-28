import { expectTypeOf } from "vitest";
import type { StoredDocument } from "../../../../../src/types/utils.mts";

const worldSettings = new WorldSettings();
expectTypeOf(worldSettings.get("", { strict: true })).toEqualTypeOf<StoredDocument<Setting>>();
expectTypeOf(worldSettings.getSetting("foo")).toEqualTypeOf<StoredDocument<Setting> | undefined>();
expectTypeOf(worldSettings.toJSON()).toEqualTypeOf<StoredDocument<Setting>["data"]["_source"][]>();
expectTypeOf(worldSettings.directory).toEqualTypeOf<undefined>();
