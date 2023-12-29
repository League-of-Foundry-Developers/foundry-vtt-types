import { expectTypeOf } from "vitest";
import type { StoredDocument } from "../../../../../src/types/utils.mts";

const folders = new Folders();
expectTypeOf(folders.get("", { strict: true })).toEqualTypeOf<StoredDocument<Folder>>();
expectTypeOf(folders.toJSON()).toEqualTypeOf<StoredDocument<Folder>["data"]["_source"][]>();
expectTypeOf(folders.directory).toEqualTypeOf<undefined | SidebarTab | SidebarDirectory<"Folder"> | undefined>();
