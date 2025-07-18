import { expectTypeOf } from "vitest";
import { Folders } from "#client/documents/collections/_module.mjs";

const folders = new Folders([]);
expectTypeOf(folders.get("", { strict: true })).toEqualTypeOf<Folder.Stored>();
expectTypeOf(folders.toJSON()).toEqualTypeOf<Folder.Stored["_source"][]>();
expectTypeOf(folders.directory).toEqualTypeOf<undefined | foundry.applications.sidebar.AbstractSidebarTab.Any | null>();
