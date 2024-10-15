import { expectTypeOf } from "vitest";
import type Document from "../../../../../src/foundry/common/abstract/document.d.mts";

const folders = new Folders();
expectTypeOf(folders.get("", { strict: true })).toEqualTypeOf<Document.Stored<Folder>>();
expectTypeOf(folders.toJSON()).toEqualTypeOf<Document.Stored<Folder>["_source"][]>();
expectTypeOf(folders.directory).toEqualTypeOf<undefined | SidebarTab | null>();
