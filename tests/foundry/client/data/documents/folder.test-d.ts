import { expectTypeOf } from "vitest";

// @ts-expect-error - A Folder requires name.
new Folder();

// @ts-expect-error - A Folder requires name.
new Folder({});

const folder = new Folder({ name: "foo", type: "JournalEntry" });
expectTypeOf(folder).toEqualTypeOf<Folder>();

expectTypeOf(folder.depth).toEqualTypeOf<number | undefined>();
expectTypeOf(folder.children).toEqualTypeOf<Folder.Implementation[]>();
expectTypeOf(folder.displayed).toEqualTypeOf<boolean>();
expectTypeOf(folder.expanded).toEqualTypeOf<boolean>();
expectTypeOf(folder.ancestors).toEqualTypeOf<Folder.Implementation[]>();

expectTypeOf(await Folder.createDialog()).toEqualTypeOf<Folder | undefined | null>();
expectTypeOf(folder.getSubfolders(true)).toEqualTypeOf<Folder.Implementation[]>();
expectTypeOf(folder.getParentFolders()).toEqualTypeOf<Folder.Implementation[]>();
