import { expectTypeOf } from "vitest";
import Document = foundry.abstract.Document;

const folders = new Folders();
expectTypeOf(folders.get("", { strict: true })).toEqualTypeOf<Document.Stored<Folder>>();
expectTypeOf(folders.toJSON()).toEqualTypeOf<Document.Stored<Folder>["_source"][]>();
expectTypeOf(folders.directory).toEqualTypeOf<undefined | SidebarTab | null>();
