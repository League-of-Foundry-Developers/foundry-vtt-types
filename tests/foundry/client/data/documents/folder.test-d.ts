import { expectTypeOf } from "vitest";

// @ts-expect-error - A Scene requires name.
new Folder();

// @ts-expect-error - A Scene requires name.
new Folder({});

const folder = new Folder({ name: "foo", type: "JournalEntry" });

expectTypeOf(folder.depth).toEqualTypeOf<number | undefined>();
expectTypeOf(folder.children).toEqualTypeOf<Folder.ConfiguredInstance[]>();
expectTypeOf(folder.displayed).toEqualTypeOf<boolean>();
expectTypeOf(folder.expanded).toEqualTypeOf<boolean>();
expectTypeOf(folder.ancestors).toEqualTypeOf<Folder.ConfiguredInstance[]>();

expectTypeOf(await Folder.createDialog()).toEqualTypeOf<Folder | undefined | null>();
expectTypeOf(folder.getSubfolders(true)).toEqualTypeOf<Folder.ConfiguredInstance[]>();
expectTypeOf(folder.getParentFolders()).toEqualTypeOf<Folder.ConfiguredInstance[]>();
