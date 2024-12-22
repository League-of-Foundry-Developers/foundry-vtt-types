import { expectTypeOf } from "vitest";
import Document = foundry.abstract.Document;

const worldSettings = new WorldSettings([]);
expectTypeOf(worldSettings.get("", { strict: true })).toEqualTypeOf<Document.Stored<Setting>>();
expectTypeOf(worldSettings.getSetting("foo")).toEqualTypeOf<Document.Stored<Setting> | undefined>();
expectTypeOf(worldSettings.toJSON()).toEqualTypeOf<Document.Stored<Setting>["_source"][]>();
expectTypeOf(worldSettings.directory).toEqualTypeOf<null>();
