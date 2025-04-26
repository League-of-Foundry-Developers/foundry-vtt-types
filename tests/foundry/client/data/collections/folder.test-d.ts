import { expectTypeOf } from "vitest";

const folders = new Folders();
expectTypeOf(folders.get("", { strict: true })).toEqualTypeOf<Folder.Stored>();
expectTypeOf(folders.toJSON()).toEqualTypeOf<Folder.Stored["_source"][]>();
expectTypeOf(folders.directory).toEqualTypeOf<undefined | SidebarTab | null>();
